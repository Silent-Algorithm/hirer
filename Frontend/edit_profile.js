// =====================================
// EDIT PROFILE JS (CLEAN VERSION)
// =====================================

const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

// =====================================
// STATE
// =====================================

let currentLatitude = null;
let currentLongitude = null;

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
// LOAD USER DATA
// =====================================

async function loadUserData() {
  try {
    const user = await getCurrentUser();

    document.getElementById("editName").value = user?.name || "";
    document.getElementById("editBio").value = user?.bio || "";
    document.getElementById("editSkills").value = user?.skills || "";
    document.getElementById("editWhatsapp").value = user?.whatsapp_link || "";

    const locationSearch = document.getElementById("locationSearch");
    if (locationSearch) {
      locationSearch.value = user?.location_name || "";
    }
  } catch (err) {
    console.error(err);
  }
}

// =====================================
// LOCATION HANDLING
// =====================================

async function getCurrentLocation(locationInput) {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      currentLatitude = position.coords.latitude;
      currentLongitude = position.coords.longitude;

      console.log("Lat:", currentLatitude);
      console.log("Lon:", currentLongitude);

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${currentLatitude}&lon=${currentLongitude}&format=json`;

        const res = await fetch(url);

        if (!res.ok) throw new Error("Reverse geocoding failed");

        const data = await res.json();

        if (locationInput) {
          locationInput.value = data.display_name;
        }

        console.log("Location:", data.display_name);
      } catch (err) {
        console.error(err);
      }
    },
    (error) => {
      console.error("Geolocation error:", error.message);
    }
  );
}

// =====================================
// INIT AFTER DOM LOAD
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const useCurrentLocation = document.getElementById("useCurrentLocation");
  const locationSearch = document.getElementById("locationSearch");

  if (!useCurrentLocation || !locationSearch) return;

  useCurrentLocation.addEventListener("change", () => {
    if (useCurrentLocation.checked) {
      locationSearch.disabled = true;
      getCurrentLocation(locationSearch);
    } else {
      currentLatitude = null;
      currentLongitude = null;

      locationSearch.disabled = false;
      locationSearch.value = "";
    }
  });
});

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
    const locationSearch = document.getElementById("locationSearch");
    const useCurrentLocation = document.getElementById("useCurrentLocation");

    const updatedData = {
      name: document.getElementById("editName").value,
      bio: document.getElementById("editBio").value,
      skills: document.getElementById("editSkills").value,
      whatsapp_link: document.getElementById("editWhatsapp").value,
    };

    if (useCurrentLocation?.checked) {
      updatedData.latitude = currentLatitude;
      updatedData.longitude = currentLongitude;
      updatedData.location_name = locationSearch?.value;
    } else if (locationSearch?.value?.trim()) {
      updatedData.location_name = locationSearch.value.trim();
    }

    await updateProfile(updatedData);
  });
}

// =====================================
// INITIAL LOAD
// =====================================

loadUserData();