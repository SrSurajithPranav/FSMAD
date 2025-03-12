document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('featureChart')) {
        const ctx = document.getElementById('featureChart').getContext('2d');
        const features = result.features;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(features).map(key => key.replace('_', ' ')),
                datasets: [{
                    label: 'Feature Values',
                    data: Object.values(features),
                    backgroundColor: 'rgba(0, 221, 235, 0.6)',
                    borderColor: '#00ddeb',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        });
    }
});
