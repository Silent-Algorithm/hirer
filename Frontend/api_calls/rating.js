const API_BASE = "http://localhost:8000";

// ===============================
// GLOBALS
// ===============================
const userId = localStorage.getItem("profile_user_id");

const ratingStarsEl = document.getElementById("ratingStars");
const ratingValueEl = document.getElementById("ratingValue");

// ===============================
// SUBMIT RATING
// ===============================
async function submitRating(rating, comment = "") {
    const token = localStorage.getItem("token");

    if (!userId) {
        console.error("No worker selected");
        return;
    }

    if (!rating || rating < 1 || rating > 5) {
        alert("Invalid rating");
        return;
    }

    try {
        const res = await fetch(
            `${API_BASE}/users/${userId}/ratings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    rating,
                    comment
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.detail || "Failed to submit rating");
        }

        console.log("Rating submitted:", data);
        alert("Rating submitted successfully!");

        // refresh ratings after submit
        initRatings();

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

// button handler
document.getElementById("submitRatingBtn").addEventListener("click", () => {
    const rating = parseInt(document.getElementById("ratingInput").value);
    const comment = document.getElementById("commentInput").value;

    submitRating(rating, comment);
});

// ===============================
// GET RATINGS
// ===============================
async function getUserRatings(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}/ratings`);

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Failed to load ratings");
    }

    return data;
}

// ===============================
// AVERAGE RATING
// ===============================
function calculateAverage(ratings) {
    if (!ratings || !ratings.length) return 0;

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
}

// ===============================
// RENDER STARS
// ===============================
function renderStars(avg) {
    if (!ratingStarsEl || !ratingValueEl) return;

    ratingStarsEl.innerHTML = "";

    const fullStars = Math.floor(avg);
    const hasHalf = avg % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "★";
        star.style.fontSize = "18px";

        if (i <= fullStars) {
            star.style.color = "#fbbf24";
        } else if (i === fullStars + 1 && hasHalf) {
            star.style.color = "#fbbf24";
            star.style.opacity = "0.5";
        } else {
            star.style.color = "#d1d5db";
        }

        ratingStarsEl.appendChild(star);
    }

    ratingValueEl.textContent = avg.toFixed(1);
}

// ===============================
// INIT
// ===============================
async function initRatings() {
    if (!userId) {
        console.error("No profile user id found");
        return;
    }

    try {
        const ratings = await getUserRatings(userId);
        const avg = calculateAverage(ratings);
        renderStars(avg);
    } catch (err) {
        console.error(err);
        renderStars(0);
    }
}

initRatings();