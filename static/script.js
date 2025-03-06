document.addEventListener("DOMContentLoaded", function () {
    const analyzeBtn = document.getElementById("analyzeBtn");
    const usernameInput = document.getElementById("username");
    const loading = document.getElementById("loading");
    const errorMessage = document.getElementById("errorMessage");
    const recentUsersList = document.getElementById("recentUsers");

    // Load recent searches from local storage
    loadRecentSearches();

    analyzeBtn.addEventListener("click", async () => {
        const username = usernameInput.value.trim();

        if (!username) {
            showError("Please enter a username.");
            return;
        }

        startLoading();

        try {
            const response = await fetch(`/analyze?username=${username}`);
            if (!response.ok) {
                throw new Error("User not found or API error.");
            }
            
            saveRecentSearch(username);
            window.location.href = `/result?username=${username}`;
        } catch (error) {
            showError("Invalid username. Try again.");
        } finally {
            stopLoading();
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }

    function startLoading() {
        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    }

    function stopLoading() {
        loading.classList.add("hidden");
    }

    function saveRecentSearch(username) {
        let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
        
        if (!searches.includes(username)) {
            searches.unshift(username);
            if (searches.length > 5) searches.pop(); // Keep only last 5 searches
            localStorage.setItem("recentSearches", JSON.stringify(searches));
        }

        loadRecentSearches();
    }

    function loadRecentSearches() {
        recentUsersList.innerHTML = "";
        let searches = JSON.parse(localStorage.getItem("recentSearches")) || [];

        searches.forEach(user => {
            let li = document.createElement("li");
            li.textContent = user;
            li.addEventListener("click", () => {
                usernameInput.value = user;
            });
            recentUsersList.appendChild(li);
        });
    }
});
