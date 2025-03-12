document.addEventListener('DOMContentLoaded', function () {
    const predictionElement = document.querySelector('.genuine');
    if (predictionElement) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
});
