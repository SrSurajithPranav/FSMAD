document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.createElement('button');
    themeToggle.textContent = 'Toggle Theme';
    themeToggle.className = 'theme-toggle';
    document.body.insertBefore(themeToggle, document.body.firstChild);

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('light-mode');
    });
});
