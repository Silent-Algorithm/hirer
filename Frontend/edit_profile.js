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
// =====================================

async function loadUserData() {

  try {

    const user = await getCurrentUser();

    // NAME
    document.getElementById("editName").value =
      user.name || "";

    // BIO
    document.getElementById("editBio").value =
      user.bio || "";

    // SKILLS
    document.getElementById("editSkills").value =
      user.skills || "";

    // WHATSAPP
    document.getElementById("editWhatsapp").value =
      user.whatsapp_link || "";

    // LATITUDE
    document.getElementById("editLatitude").value =
      user.latitude || "";

    // LONGITUDE
    document.getElementById("editLongitude").value =
      user.longitude || "";

  } catch (err) {
    console.error(err);
  }
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

    // GO BACK TO PROFILE PAGE
    window.location.href = "./profile.html";

  } catch (err) {

    console.error(err);

    alert(err.message);
  }
}

const fileInput = document.getElementById("profileImageInput");
const previewImg = document.getElementById("profilePreview");

if (fileInput) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. instant preview (local)
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

      // 2. replace with server URL after upload
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

const saveProfileBtn =
  document.getElementById("saveProfileBtn");

saveProfileBtn.addEventListener("click", async () => {

  const updatedData = {

    name:
      document.getElementById("editName").value,

    bio:
      document.getElementById("editBio").value,

    skills:
      document.getElementById("editSkills").value,

    whatsapp_link:
      document.getElementById("editWhatsapp").value,

    latitude:
      parseFloat(
        document.getElementById("editLatitude").value
      ),

    longitude:
      parseFloat(
        document.getElementById("editLongitude").value
      ),
  };

  // REMOVE EMPTY VALUES
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

// =====================================
// INITIAL LOAD
// =====================================

loadUserData();