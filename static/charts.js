document.addEventListener("DOMContentLoaded", function () {
    const featureData = {{ result.features | tojson }};
    const labels = Object.keys(featureData);
    const values = Object.values(featureData);

    // Feature Breakdown Chart (Bar Chart)
    new Chart(document.getElementById('featuresChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feature Values',
                data: values,
                backgroundColor: 'rgba(255, 107, 107, 0.6)',
                borderColor: 'rgba(255, 107, 107, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feature Breakdown',
                    font: { size: 16 }
                }
            }
        }
    });

    // Comparative Analysis Chart (Pie Chart)
    new Chart(document.getElementById('comparisonChart'), {
        type: 'pie',
        data: {
            labels: ['Followers', 'Friends', 'Statuses', 'Listed'],
            datasets: [{
                data: [featureData.followers_count, featureData.friends_count, featureData.statuses_count, featureData.listed_count],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparative Analysis',
                    font: { size: 16 }
                }
            }
        }
    });

    // Radar Chart (Feature Distribution)
    new Chart(document.getElementById('radarChart'), {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feature Distribution',
                data: values,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feature Distribution',
                    font: { size: 16 }
                }
            }
        }
    });

    // Engagement Over Time Chart (Line Chart)
    new Chart(document.getElementById('engagementChart'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Engagement Trend',
                data: [featureData.statuses_count / 4, featureData.statuses_count / 3, featureData.statuses_count / 2, featureData.statuses_count],
                borderColor: '#42a5f5',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Engagement Over Time',
                    font: { size: 16 }
                }
            }
        }
    });

    // Sentiment Analysis Chart (Doughnut Chart)
    new Chart(document.getElementById('sentimentChart'), {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                data: [70, 20, 10], // Example data (replace with actual sentiment data)
                backgroundColor: ['#4bc0c0', '#ffce56', '#ff6384']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Sentiment Analysis',
                    font: { size: 16 }
                }
            }
        }
    });

    // Network Activity Chart (Bar Chart)
    new Chart(document.getElementById('networkChart'), {
        type: 'bar',
        data: {
            labels: ['Retweets', 'Likes', 'Replies'],
            datasets: [{
                label: 'Activity',
                data: [featureData.retweets || 0, featureData.likes || 0, featureData.replies || 0], // Fallback to 0 if data is missing
                backgroundColor: ['#36a2eb', '#ff6384', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Network Activity',
                    font: { size: 16 }
                }
            }
        }
    });

    // Additional Chart: Follower Growth Over Time (Line Chart)
    new Chart(document.getElementById('followerGrowthChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Follower Growth',
                data: [100, 200, 300, 400, 500, 600], // Example data (replace with actual growth data)
                borderColor: '#ff9f43',
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Follower Growth Over Time',
                    font: { size: 16 }
                }
            }
        }
    });

    // Additional Chart: Activity Heatmap (Bar Chart)
    new Chart(document.getElementById('activityHeatmapChart'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Activity',
                data: [10, 20, 30, 40, 50, 60, 70], // Example data (replace with actual activity data)
                backgroundColor: '#4bc0c0'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Weekly Activity Heatmap',
                    font: { size: 16 }
                }
            }
        }
    });
});
