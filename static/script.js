document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("analyze-form");
    const input = document.getElementById("username");
    const button = document.getElementById("analyze-btn");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");
    const suggestions = document.querySelectorAll(".suggested-username");

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = input.value.trim();
        if (username === "") {
            showError("Please enter a username.");
            return;
        }
        startLoading();
        this.submit();
    });

    // Handle username suggestions
    suggestions.forEach(suggestion => {
        suggestion.addEventListener("click", function () {
            input.value = this.textContent;
        });
    });

    // Show loading animation
    function startLoading() {
        button.disabled = true;
        button.style.background = "#999";
        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }
});
