// animations.js
document.addEventListener("DOMContentLoaded", function () {
    // Floating animation for the container
    const container = document.querySelector(".container");
    if (container) {
        container.style.animation = "float 4s ease-in-out infinite";
    }

    // Glowing animation for buttons
    const buttons = document.querySelectorAll("button, .btn");
    buttons.forEach((button) => {
        button.style.animation = "glow 2s ease-in-out infinite";
    });

    // Hover animations for cards
    const cards = document.querySelectorAll(".result-card, canvas");
    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.transform = "scale(1.02)";
            card.style.transition = "transform 0.3s ease";
        });
        card.addEventListener("mouseleave", () => {
            card.style.transform = "scale(1)";
        });
    });

    // Background animation
    const background = document.querySelector(".background");
    if (background) {
        background.style.animation = "backgroundAnimation 20s infinite alternate";
    }
});

// Keyframes for animations
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes float {
        0% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
        100% {
            transform: translateY(0);
        }
    }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
    @keyframes glow {
        0% {
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.6);
        }
        50% {
            box-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
        }
        100% {
            box-shadow: 0 0 10px rgba(255, 107, 107, 0.6);
        }
    }
`, styleSheet.cssRules.length);

styleSheet.insertRule(`
    @keyframes backgroundAnimation {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(1.1);
        }
    }
`, styleSheet.cssRules.length);
