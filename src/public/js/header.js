document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.navbar-burger');
    const navLinks = document.querySelector('.navbar-links');

    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
});