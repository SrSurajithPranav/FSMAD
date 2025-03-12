document.addEventListener('DOMContentLoaded', function () {
    const analyzeForm = document.getElementById('analyzeForm');
    const analyzeStaticButton = document.getElementById('analyzeStatic');

    if (analyzeForm) {
        analyzeForm.addEventListener('submit', function () {
            showLoadingSpinner();
        });
    }

    if (analyzeStaticButton) {
        analyzeStaticButton.addEventListener('click', function () {
            showLoadingSpinner();
        });
    }

    function showLoadingSpinner() {
        const container = document.querySelector('.container');
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        container.appendChild(spinner);
    }
});
