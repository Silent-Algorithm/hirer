// =====================================
// EDIT PROFILE JS
// =====================================

const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

// =====================================
// GET CURRENT USER
// =====================================

async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

// =====================================
// LOAD USER DATA INTO INPUTS
// (removed backend location usage)
// =====================================

async function loadUserData() {
  try {
    const user = await getCurrentUser();

    document.getElementById("editName").value = user?.name || "";
    document.getElementById("editBio").value = user?.bio || "";
    document.getElementById("editSkills").value = user?.skills || "";
    document.getElementById("editWhatsapp").value = user?.whatsapp_link || "";
  } catch (err) {
    console.error(err);
  }
}

// =====================================
// FRONTEND LOCATION HANDLING
// =====================================

function getUserLocation() {
  if (!navigator.geolocation) {
    console.log("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("Lat:", lat, "Lon:", lon);

      const latInput = document.getElementById("editLatitude");
      const lonInput = document.getElementById("editLongitude");

      if (latInput) latInput.value = lat;
      if (lonInput) lonInput.value = lon;

      // optional reverse geocoding (console only)
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          console.log("Location:", data.display_name);
        }
      } catch (err) {
        console.error("Reverse geocode error:", err.message);
      }
    },
    (error) => {
      console.error("Geolocation error:", error.message);
    }
  );
}

// =====================================
// UPDATE PROFILE
// =====================================

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

    const data = await response.json();

    console.log("Updated:", data);
    alert("Profile updated successfully");

    window.location.href = "./profile.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// =====================================
// IMAGE UPLOAD
// =====================================

const fileInput = document.getElementById("profileImageInput");
const previewImg = document.getElementById("profilePreview");

if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    previewImg.src = objectUrl;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/users/profile-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        console.log(await res.text());
        return;
      }

      const data = await res.json();

      if (data.image_url) {
        previewImg.src = `${API_BASE}${data.image_url}`;
      }
    } catch (err) {
      console.error(err);
    }
  });
}

// =====================================
// SAVE BUTTON
// =====================================

const saveProfileBtn = document.getElementById("saveProfileBtn");

if (saveProfileBtn) {
  saveProfileBtn.addEventListener("click", async () => {
    const updatedData = {
      name: document.getElementById("editName").value,
      bio: document.getElementById("editBio").value,
      skills: document.getElementById("editSkills").value,
      whatsapp_link: document.getElementById("editWhatsapp").value,

      latitude: parseFloat(document.getElementById("editLatitude").value),
      longitude: parseFloat(document.getElementById("editLongitude").value),
    };

    Object.keys(updatedData).forEach((key) => {
      if (
        updatedData[key] === "" ||
        updatedData[key] === null ||
        Number.isNaN(updatedData[key])
      ) {
        delete updatedData[key];
      }
    });

    await updateProfile(updatedData);
  });
}

// =====================================
// INITIAL LOAD
// =====================================

loadUserData();
getUserLocation();