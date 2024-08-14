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

    // Mobile menu open event
    const menuIcon = document.querySelector('.mobile-menu-icon');
    const sidenav = document.getElementById('mobileSidenav');
    const closeBtn = sidenav.querySelector('.mobilenavclosebtn');

    // Define the width of the sidenav in percentage
    const sidenavWidth = '80%';

    menuIcon.addEventListener('click', () => {
        sidenav.style.width = sidenavWidth;
    });

    // Mobile menu close event
    closeBtn.addEventListener('click', () => {
        sidenav.style.width = '0';
    });

    // Optional: Close the sidenav if the user clicks outside of it
    document.addEventListener('click', (event) => {
        if (sidenav.style.width === sidenavWidth && !sidenav.contains(event.target) && event.target !== menuIcon) {
            sidenav.style.width = '0';
        }
    });
});
