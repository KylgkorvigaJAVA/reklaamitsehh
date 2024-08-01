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
});
