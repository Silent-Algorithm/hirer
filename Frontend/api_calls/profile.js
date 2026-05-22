const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

// ===============================
// ELEMENTS
// ===============================
const ratingStarsEl = document.getElementById("ratingStars");
const ratingValueEl = document.getElementById("ratingValue");

// ===============================
// GET CURRENT USER
// ===============================
async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to load user");
  return await res.json();
}

// ===============================
// GET USER RATINGS
// ===============================
async function getUserRatings(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/ratings`);

  if (!res.ok) throw new Error("Failed to load ratings");
  return await res.json();
}

// ===============================
// AVERAGE RATING
// ===============================
function calculateAverage(ratings) {
  if (!ratings.length) return 0;

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
// LOCATION
// ===============================
async function loadLocation(userId) {
  const locationEl = document.querySelector(".text-gray-700");

  if (!locationEl) return;

  try {
    const res = await fetch(`${API_BASE}/users/${userId}/location`);

    if (!res.ok) {
      const err = await res.json();
      console.log(err);
      throw new Error(err.detail || "Failed to load location");
    }

    const data = await res.json();
    const raw = data.location;

    if (!raw) {
      locationEl.textContent =
        `${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`;
      return;
    }

    const parts = raw.split(",").map((p) => p.trim());

    locationEl.textContent =
      parts.length >= 2
        ? `${parts[0]}, ${parts[parts.length - 1]}`
        : raw;

  } catch (err) {
    console.warn(err.message);
    locationEl.textContent = "Location not available";
  }
}

// ===============================
// USER POSTS
// ===============================
async function getUserPosts(userId) {
  try {
    const res = await fetch(`${API_BASE}/users/${userId}/posts`);

    if (!res.ok) {
      throw new Error(`Failed to load posts (${res.status})`);
    }

    return await res.json();

  } catch (err) {
    console.error("Posts error:", err);
    return [];
  }
}

// ===============================
// RENDER POSTS GRID (Instagram Style)
// ===============================
async function renderUserPosts(userId) {
  const grid = document.getElementById("userPostsGrid");

  if (!grid) return;

  grid.innerHTML = "";

  const posts = await getUserPosts(userId);

  if (!posts.length) {
    grid.innerHTML = `
      <div class="col-span-3 text-center py-8 text-gray-500">
        No posts yet
      </div>
    `;
    return;
  }

  posts.forEach((post) => {
    const item = document.createElement("div");

    item.className =
      "aspect-square overflow-hidden bg-gray-200 cursor-pointer rounded";

    const imageUrl = post.image_url
      ? `${API_BASE}${post.image_url}`
      : "https://placehold.co/300x300?text=No+Image";

    item.innerHTML = `
      <img
        src="${imageUrl}"
        alt="Post"
        class="w-full h-full object-cover hover:scale-105 transition duration-300 "
      >
    `;

item.addEventListener("click", () => {
  localStorage.setItem("post_id", post.id);
  window.location.href = "./user_posts.html";
});

    grid.appendChild(item);
  });
}

// ===============================
// LOAD PROFILE
// ===============================
async function loadProfile() {
  try {
    const user = await getCurrentUser();

    console.log(user);

    // IMAGE
    const profileImg = document.querySelector("#accountProfile img");

    if (profileImg && user.profile_image) {
      profileImg.src = `${API_BASE}${user.profile_image}`;
    }

    // NAME
    const nameEl = document.querySelector(
      ".flex.flex-col.items-center.gap-y-2 h1"
    );

    if (nameEl) {
      nameEl.textContent = user.name || "No Name";
    }

    // BIO
    const aboutText = document.querySelector(
      "section:nth-of-type(2) div div p"
    );

    if (aboutText) {
      aboutText.textContent = user.bio || "No bio added yet";
    }

    // SKILLS
    const skillsContainer = document.querySelector(
      "section:nth-of-type(2) div div:nth-child(2) p"
    );

    if (skillsContainer) {
      skillsContainer.innerHTML = "";

      if (user.skills) {
        user.skills.split(",").forEach((skill) => {
          const span = document.createElement("span");
          span.textContent = skill.trim();
          skillsContainer.appendChild(span);
        });
      } else {
        skillsContainer.innerHTML = "<span>No skills added</span>";
      }
    }

    // LOCATION
    await loadLocation(user.id);

    // POSTS GRID
    await renderUserPosts(user.id);

    // RATINGS
    const ratings = await getUserRatings(user.id);
    const avg = calculateAverage(ratings);

    renderStars(avg);

  } catch (err) {
    console.error(err);
  }
}

// ===============================
// UPDATE PROFILE
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

    loadProfile();

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// ===============================
// SAVE BUTTON
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

    Object.keys(updatedData).forEach((key) => {
      if (updatedData[key] === "" || updatedData[key] === null) {
        delete updatedData[key];
      }
    });

    await updateProfile(updatedData);
  });
}

// ===============================
// INIT
// ===============================
loadProfile();