document.addEventListener('DOMContentLoaded', () => {
    // Form submission with loader
    const form = document.getElementById('analyzeForm');
    const loader = document.getElementById('loader');
    if (form) {
        form.addEventListener('submit', () => {
            loader.classList.remove('hidden');
        });
    }

    // Static dataset analysis
    const analyzeStaticBtn = document.getElementById('analyzeStatic');
    if (analyzeStaticBtn) {
        analyzeStaticBtn.addEventListener('click', () => {
            const select = document.getElementById('staticUserSelect');
            const username = select.value;
            if (username) {
                loader.classList.remove('hidden');
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = '/analyze';
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'username';
                input.value = username;
                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
            }
        });
    }

    // Theme switcher
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeSwitch.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
    });

    // Tilt effect
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.5
    });
});
