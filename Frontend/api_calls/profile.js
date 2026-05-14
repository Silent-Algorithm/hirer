const API_BASE = "http://localhost:8000"; // change if deployed

const token = localStorage.getItem("token");

const ratingStarsEl = document.getElementById("ratingStars");
const ratingValueEl = document.getElementById("ratingValue");

async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load user");
  return await res.json();
}

async function getUserRatings(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/ratings`);

  if (!res.ok) throw new Error("Failed to load ratings");
  return await res.json();
}

function calculateAverage(ratings) {
  if (!ratings.length) return 0;

  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
}

function renderStars(avg) {
  ratingStarsEl.innerHTML = "";

  const fullStars = Math.floor(avg);
  const hasHalf = avg % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");

    if (i <= fullStars) {
      star.textContent = "★";
      star.style.color = "#fbbf24"; // yellow
    } else if (i === fullStars + 1 && hasHalf) {
      star.textContent = "★";
      star.style.color = "#fbbf24";
      star.style.opacity = "0.5";
    } else {
      star.textContent = "★";
      star.style.color = "#d1d5db"; // gray
    }

    star.style.fontSize = "18px";
    ratingStarsEl.appendChild(star);
  }

  ratingValueEl.textContent = avg.toFixed(1);
}

async function loadRating() {
  try {
    const user = await getCurrentUser();
    const ratings = await getUserRatings(user.id);

    const avg = calculateAverage(ratings);

    renderStars(avg);
  } catch (err) {
    console.error(err);
    ratingValueEl.textContent = "No rating";
  }
}

loadRating();


















