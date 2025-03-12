document.addEventListener('DOMContentLoaded', function () {
    const analyzeForm = document.getElementById('analyzeForm');
    const staticUserSelect = document.getElementById('staticUserSelect');
    const analyzeStaticButton = document.getElementById('analyzeStatic');

    // Validate username input
    if (analyzeForm) {
        analyzeForm.addEventListener('submit', function (event) {
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value.trim();

            if (!username) {
                alert('Please enter a Twitter username.');
                event.preventDefault();
            } else if (!username.startsWith('@')) {
                alert('Username must start with "@".');
                event.preventDefault();
            }
        });
    }

    // Handle static dataset selection
    if (staticUserSelect && analyzeStaticButton) {
        analyzeStaticButton.addEventListener('click', function () {
            const selectedUser = staticUserSelect.value;
            if (!selectedUser) {
                alert('Please select a username from the dataset.');
                return;
            }

            // Submit the selected username for analysis
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/analyze';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'username';
            input.value = selectedUser;

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        });
    }

    // Add any additional client-side logic here
});
