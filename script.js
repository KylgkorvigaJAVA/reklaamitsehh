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
});
