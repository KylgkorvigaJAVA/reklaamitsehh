document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.category-link').forEach(categoryLink => {
        categoryLink.addEventListener('click', (event) => {
            event.preventDefault();

            const targetId = categoryLink.getAttribute('data-target');
            const overlay = document.getElementById(targetId);

            const imgSrc = categoryLink.querySelector('.category-image').src;
            overlay.style.backgroundImage = `url(${imgSrc})`;

            document.querySelectorAll('.category').forEach(c => c.classList.add('hidden'));
            overlay.classList.add('active');
        });
    });

    document.querySelectorAll('.overlay .close').forEach(closeButton => {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();

            closeButton.closest('.overlay').classList.remove('active');
            document.querySelectorAll('.category').forEach(c => c.classList.remove('hidden'));
        });
    });


    /* MOBILE SIDENAV MENU LOGIC START
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

    const menuIcon = document.querySelector('.mobile-menu-icon');
    const sidenav = document.getElementById('mobileSidenav');
    const closeBtn = sidenav.querySelector('.mobilenavclosebtn');

    // Define the width of the sidenav in percentage
    const sidenavWidth = '80%';
    // Variable to track menu state
    let menuOpen = false;
    
    // Function to open the menu
    function openMenu() {
        sidenav.style.width = sidenavWidth;
        menuOpen = true;
        // Push a new state with menuOpen true
        history.pushState({ menuOpen: true }, '');
    }

    // Function to close the menu
    function closeMenu() {
        sidenav.style.width = '0';
        menuOpen = false;
        history.back();
        history.pushState({ menuOpen: false }, '');
    }

    // Mobile menu open event
    menuIcon.addEventListener('click', () => {
        openMenu();
    });

    // Mobile menu close event
    closeBtn.addEventListener('click', () => {
        closeMenu();
    });

    // Close the sidenav if the user clicks outside of it
    document.addEventListener('click', (event) => {
        if (sidenav.style.width === sidenavWidth && !sidenav.contains(event.target) && event.target !== menuIcon) {
            closeMenu();
        }
    });

    // Close the sidenav if the user swipes to the right
    let touchStartX = 0;

    sidenav.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
    });

    sidenav.addEventListener('touchend', (event) => {
        let touchEndX = event.changedTouches[0].clientX;
        if (touchEndX > touchStartX + 50) {  // Detect right swipe (50px threshold)
            closeMenu();
        }
    });
    
    // Close the sidenav if the user presses the back button with the sidenav open
    window.addEventListener('popstate', (event) => {
        if (menuOpen) {
            sidenav.style.width = '0';
            menuOpen = false;
            event.preventDefault();
        }
    });

    /* MOBILE SIDENAV MENU LOGIC END
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

    // CATEGORY SCROLL/SWIPE START #############################

    const overlays = document.querySelectorAll('.overlay');
    const categoryLinks = document.querySelectorAll('.category-link');
    let currentOverlayIndex = 0;

    // Function to open an overlay
    function openOverlay(index) {
        overlays.forEach((overlay, i) => {
            if (i === index) {
                const categoryImage = categoryLinks[i].querySelector('.category-image').src;
                overlay.style.backgroundImage = `url(${categoryImage})`;
                overlay.classList.add('active');
                overlay.querySelector('.overlay-content').classList.add('active');
            } else {
                overlay.classList.remove('active');
                overlay.querySelector('.overlay-content').classList.remove('active');
            }
        });
        currentOverlayIndex = index;
    }

    // Function to close all overlays
    function closeAllOverlays() {
        overlays.forEach(overlay => {
            overlay.classList.remove('active');
            overlay.querySelector('.overlay-content').classList.remove('active');
        });
    }

    // Event listener for opening overlays
    categoryLinks.forEach((link, index) => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            openOverlay(index);
        });
    });

    // Event listener for closing overlays
    overlays.forEach(overlay => {
        overlay.querySelectorAll('.close').forEach(closeButton => {
            closeButton.addEventListener('click', function() {
                closeAllOverlays();
            });
        });
    });

    // Event listener for scrolling to next/previous overlay on desktop
    document.addEventListener('wheel', function(event) {
        if (overlays[currentOverlayIndex].classList.contains('active')) {
            if (event.deltaY > 0) {
                // Scroll down
                if (currentOverlayIndex < overlays.length - 1) {
                    openOverlay(currentOverlayIndex + 1);
                }
            } else {
                // Scroll up
                if (currentOverlayIndex > 0) {
                    openOverlay(currentOverlayIndex - 1);
                }
            }
        }
    });

    /* MOBILE SWIPE GESTURE DISABLED FOR NOW #############################

    // Variables to track touch events for mobile swipe
    let swipeStartY = 0;
    let swipeEndY = 0;

    // Add touch event listeners to each overlay
    overlays.forEach(overlay => {
        overlay.addEventListener('touchstart', function(event) {
            swipeStartY = event.changedTouches[0].screenY;
        });

        overlay.addEventListener('touchend', function(event) {
            swipeEndY = event.changedTouches[0].screenY;
            handleSwipeGesture();
        });
    });

    // Function to handle swipe gestures
    function handleSwipeGesture() {
        if (overlays[currentOverlayIndex].classList.contains('active')) {
            if (swipeEndY < swipeStartY - 50) {
                // Swipe up (next overlay)
                if (currentOverlayIndex < overlays.length - 1) {
                    openOverlay(currentOverlayIndex + 1);
                }
            } else if (swipeEndY > swipeStartY + 50) {
                // Swipe down (previous overlay)
                if (currentOverlayIndex > 0) {
                    openOverlay(currentOverlayIndex - 1);
                }
            }
        }
    }
    */
    
    // CATEGORY SCROLL/SWIPE END #############################

    const header = document.querySelector('header');

    // Function to update CSS variable for header height
    function updateHeaderHeight() {
        const headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }

    // Run on page load
    updateHeaderHeight();

    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight);


    /* LIGHTBOX LOGIC START
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

    document.querySelectorAll(".image-grid").forEach((imageGrid) => {
        const imgs = imageGrid.querySelectorAll("img");
        const lightboxModal = document.getElementById("lightbox-modal");
        const bsModal = new bootstrap.Modal(lightboxModal);
        const modalBody = lightboxModal.querySelector(".modal-body .container-fluid");
        let currentSlideIndex = 0;

        // Handle image clicks using event delegation
        imageGrid.addEventListener('click', (e) => {
            const img = e.target.closest('img');
            if (img && imageGrid.contains(img)) {
                e.preventDefault();
                currentSlideIndex = Array.from(imgs).indexOf(img);
                createCarousel(imgs);
                bsModal.show();
            }
        });        

        function createCarousel(images) {
            // Generate carousel slides
            const slides = Array.from(images).map((img, index) => `
                <div class="carousel-item${index === currentSlideIndex ? ' active' : ''}">
                    <img src="${img.src}" alt="${img.alt}">
                    ${img.getAttribute("data-caption") ? createCaption(img.getAttribute("data-caption")) : ""}
                </div>
            `).join('');

            // Insert carousel HTML into the modal
            modalBody.innerHTML = `
                <div class="carousel slide" data-bs-ride="false">
                    <div class="carousel-inner">
                        ${slides}
                    </div>
                    <button class="carousel-control-prev" type="button">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            `;

            const items = modalBody.querySelectorAll('.carousel-item');
            const totalItems = items.length;
            const prevBtn = modalBody.querySelector('.carousel-control-prev');
            const nextBtn = modalBody.querySelector('.carousel-control-next');

            function createCaption(caption) {
                return `<div class="carousel-caption">
                   <p class="m-0">${caption}</p>
                  </div>`;
            }

            function prevSilde() {
                items[currentSlideIndex].classList.remove('active');
                currentSlideIndex = (currentSlideIndex - 1 + totalItems) % totalItems;
                items[currentSlideIndex].classList.add('active');
            }

            function nextSilde() {
                items[currentSlideIndex].classList.remove('active');
                currentSlideIndex = (currentSlideIndex + 1) % totalItems;
                items[currentSlideIndex].classList.add('active');
            }

            // Navigate to the previous slide
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSilde();
            });

            // Navigate to the next slide
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSilde();
            });

            // Navigate to next image if user swipes
            // Use named events in order to be able to remove them later
            touchStartX = 0;

            function myTouchStart(event) {
                touchStartX = event.touches[0].clientX;
            }

            lightboxModal.addEventListener('touchstart', myTouchStart);

            function myTouchEnd(event) {
                let touchEndX = event.changedTouches[0].clientX;
                if (touchEndX > touchStartX + 50) {  // Detect right swipe (50px threshold)
                    prevSilde();
                } else if (touchEndX < touchStartX - 50) {  // Detect left swipe (50px threshold)
                    nextSilde();
                }
            }

            lightboxModal.addEventListener('touchend', myTouchEnd);

            // Navigate to prev or next image with arrow keys
            function myKeyDown(event) {
                event.preventDefault();

                if (event.key === 'ArrowLeft') {
                    prevSilde();
                } else if (event.key === 'ArrowRight') {
                    nextSilde();
                }
            }

            // Listen for keydown events to navigate with arrow keys
            lightboxModal.addEventListener('keydown', myKeyDown);

            // Close the lightbox if clicked outside the image
            lightboxModal.addEventListener('click', (e) => {
                const isOutsideImage = !e.target.closest('.carousel-item img');
                const isControlButton = e.target.closest('.carousel-control-prev, .carousel-control-next');

                // Close only if clicked outside the image and not on control buttons
                if (isOutsideImage && !isControlButton) {
                    bsModal.hide();
                }
            });


            // Clean up the carousel when the modal is closed
            lightboxModal.addEventListener('hidden.bs.modal', () => {
                // Remove these event listeners when the modal is hidden so they don't get duplicated when the modal is opened again
                lightboxModal.removeEventListener('touchstart', myTouchStart);
                lightboxModal.removeEventListener('touchend', myTouchEnd);
                lightboxModal.removeEventListener('keydown', myKeyDown);

                modalBody.innerHTML = '';
            });

        }
    });

    /* LIGHTBOX LOGIC END
    –––––––––––––––––––––––––––––––––––––––––––––––––– */

});
