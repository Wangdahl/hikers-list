// Flipping heading arrow on dropdown
document.addEventListener('DOMContentLoaded', () => {
    const heading = document.getElementById('packListTitle');
    heading.addEventListener('click', () => {
        heading.querySelector('i').classList.toggle('open');
    });
});