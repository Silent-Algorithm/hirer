const postMedia = document.getElementById('postMedia');
const addPostMedia = document.getElementById('addPostMedia');
const file = document.getElementById('file')


addPostMedia.addEventListener('click', () => {
    file.click()
    
});

file.addEventListener('change', (e) => {

    const url = URL.createObjectURL(e.target.files[0])
    console.log(url)
    postMedia.src = url
    postMedia.style.display = 'block'
    console.log(e.target.files[0])
})
const fileInput = document.getElementById("file");
const postBtn = document.getElementById("postBtn");

const caption = document.getElementById("caption");
const category = document.getElementById("category");
const price = document.getElementById("price");
const availability = document.getElementById("availability");


// ==============================
// OPEN FILE PICKER
// ==============================

addPostMedia.addEventListener("click", () => {
  fileInput.click();
});


// ==============================
// PREVIEW SELECTED MEDIA
// ==============================

fileInput.addEventListener("change", (e) => {

  const selectedFile = e.target.files[0];

  if (!selectedFile) return;

  const mediaURL = URL.createObjectURL(selectedFile);

  postMedia.src = mediaURL;
  postMedia.style.display = "block";

  console.log(selectedFile);
});


// ==============================
// UPLOAD POST TO BACKEND
// ==============================

postBtn.addEventListener("click", async () => {

  const selectedFile = fileInput.files[0];

  // JWT TOKEN
  const token = localStorage.getItem("token");

  if (!token) {

    alert("Login required");

    window.location.href = "./login.html";

    return;
  }

  // FILE VALIDATION
  if (!selectedFile) {

    alert("Select media first");

    return;
  }

  // BACKEND SERVICE DETAILS
  const service_details = {
    category_name: category.value,
    price: price.value ? parseInt(price.value) : 0,
    availability: availability.value
  };

  // FORM DATA
  const formData = new FormData();

  formData.append("file", selectedFile);

  formData.append(
    "content",
    caption.value
  );

  formData.append(
    "service_details",
    JSON.stringify(service_details)
  );

  try {

    // BUTTON LOADING STATE
    postBtn.disabled = true;
    postBtn.innerText = "Posting...";

    // REQUEST
    const response = await fetch(
      "http://127.0.0.1:8000/upload",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`
        },

        body: formData
      }
    );

    const data = await response.json();

    console.log(data);

    // BACKEND ERROR
    if (!response.ok) {

      alert(data.detail || "Upload failed");

      postBtn.disabled = false;
      postBtn.innerText = "Post";

      return;
    }

    // SUCCESS
    alert("Post created successfully");

    window.location.href = "./home.html";

  } catch (error) {

    console.log(error);

    alert("Server error");

    postBtn.disabled = false;
    postBtn.innerText = "Post";
  }

});