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




// ===============================
// GET TOKEN
// ===============================
function getToken() {
  return localStorage.getItem("token");
}

// ===============================
// GET CURRENT USER
// ===============================
async function getCurrentUser() {
  const token = getToken();

  const response = await fetch(`${API_BASE}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return await response.json();
}

// ===============================
// GET USER RATINGS
// ===============================
async function getUserRatings(userId) {
  const response = await fetch(`${API_BASE}/users/${userId}/ratings`);

  if (!response.ok) {
    throw new Error("Failed to fetch ratings");
  }

  return await response.json();
}

// ===============================
// CALCULATE AVERAGE RATING
// ===============================
function calculateAverage(ratings) {
  if (!ratings.length) return 0;

  const total = ratings.reduce((sum, item) => sum + item.rating, 0);

  return (total / ratings.length).toFixed(1);
}

// ===============================
// RENDER STARS
// ===============================
function renderStars(avg) {
  const ratingValueEl = document.getElementById("ratingValue");

  ratingValueEl.innerHTML = "";

  const rounded = Math.round(avg);

  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      ratingValueEl.innerHTML += "⭐";
    } else {
      ratingValueEl.innerHTML += "☆";
    }
  }

  ratingValueEl.innerHTML += ` <span>${avg}</span>`;
}

// ===============================
// LOAD PROFILE DATA
// ===============================
async function loadProfile() {
  try {
    const user = await getCurrentUser();

    console.log(user);

    // =========================
    // PROFILE IMAGE
    // =========================
    const profileImg = document.querySelector("#accountProfile img");

    if (user.profile_image) {
      profileImg.src = `${API_BASE}${user.profile_image}`;
    }

    // =========================
    // USER NAME
    // =========================
    const nameEl = document.querySelector(
      ".flex.flex-col.items-center.gap-y-2 h1"
    );

    nameEl.textContent = user.name || "No Name";

    // =========================
    // BIO
    // =========================
    const aboutText = document.querySelector(
      "section:nth-of-type(2) div div p"
    );

    aboutText.textContent =
      user.bio || "No bio added yet";

    // =========================
    // SKILLS
    // =========================
    const skillsContainer = document.querySelector(
      "section:nth-of-type(2) div div:nth-child(2) p"
    );

    skillsContainer.innerHTML = "";

    if (user.skills) {
      const skillsArray = user.skills.split(",");

      skillsArray.forEach((skill) => {
        const span = document.createElement("span");
        span.textContent = skill.trim();
        skillsContainer.appendChild(span);
      });
    } else {
      skillsContainer.innerHTML = "<span>No skills added</span>";
    }

    // =========================
    // LOCATION
    // =========================
    const locationEl = document.querySelector(
      ".text-gray-700"
    );

    if (user.latitude && user.longitude) {
      locationEl.textContent = `Lat: ${user.latitude}, Lon: ${user.longitude}`;
    } else {
      locationEl.textContent = "Location not available";
    }

    // =========================
    // VERIFIED BADGE
    // =========================
    if (user.is_verified) {
      nameEl.innerHTML += ` ✅`;
    }

    // =========================
    // CONTACT BUTTON
    // =========================
    const contactBtn = document.querySelector("button");

    if (user.whatsapp_link) {
      contactBtn.addEventListener("click", () => {
        window.open(user.whatsapp_link, "_blank");
      });
    } else {
      contactBtn.disabled = true;
      contactBtn.classList.add("opacity-50");
    }

    // =========================
    // LOAD RATINGS
    // =========================
    const ratings = await getUserRatings(user.id);

    const avg = calculateAverage(ratings);

    renderStars(avg);

  } catch (err) {
    console.error(err);
  }
}

loadProfile();

// ===============================
// EDIT PROFILE
// ===============================

async function updateProfile(updatedData) {
  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error);
      throw new Error("Failed to update profile");
    }

    const updatedUser = await response.json();

    console.log("Updated User:", updatedUser);

    alert("Profile updated successfully");

    // reload profile after update
    loadProfile();

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// ===============================
// EDIT BUTTON EVENT
// ===============================

const saveProfileBtn = document.getElementById("saveProfileBtn");

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", async () => {

    const updatedData = {
      name: document.getElementById("editName").value,

      bio: document.getElementById("editBio").value,

      skills: document.getElementById("editSkills").value,

      whatsapp_link: document.getElementById("editWhatsapp").value,

      latitude: document.getElementById("editLatitude").value,

      longitude: document.getElementById("editLongitude").value,
    };

    // remove empty fields
    Object.keys(updatedData).forEach((key) => {
      if (
        updatedData[key] === "" ||
        updatedData[key] === null
      ) {
        delete updatedData[key];
      }
    });

    await updateProfile(updatedData);
  });
}

























