document.addEventListener("DOMContentLoaded", function () {
    const analyzeBtn = document.getElementById("analyzeBtn");
    const usernameInput = document.getElementById("username");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");

    analyzeBtn.addEventListener("click", async () => {
        const username = usernameInput.value.trim();
        if (!username) {
            errorMessage.textContent = "Please enter a username.";
            errorMessage.classList.remove("hidden");
            return;
        }

        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        try {
            const response = await fetch(`/analyze?username=${username}`);
            if (!response.ok) {
                throw new Error("User not found or API error.");
            }
            window.location.href = `/result?username=${username}`;
        } catch (error) {
            errorMessage.textContent = error.message;
            errorMessage.classList.remove("hidden");
        } finally {
            loading.classList.add("hidden");
        }
    });

    document.querySelectorAll(".suggested-username").forEach((element) => {
        element.addEventListener("click", () => {
            usernameInput.value = element.textContent;
        });
    });
});
