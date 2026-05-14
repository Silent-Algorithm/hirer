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
const postMedia = document.getElementById("postMedia");
const postBtn = document.getElementById("postBtn");

const caption = document.getElementById("caption");
const category = document.getElementById("category");
const price = document.getElementById("price");
const availability = document.getElementById("availability");

let selectedFile = null;
let imageUrl = null;

// preview file
fileInput.addEventListener("change", (e) => {
    selectedFile = e.target.files[0];

    if (!selectedFile) return;

    imageUrl = URL.createObjectURL(selectedFile);
    postMedia.src = imageUrl;
});

// click upload area
document.getElementById("addPostMedia").addEventListener("click", () => {
    fileInput.click();
});

// POST to backend
postBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token"); // adjust if you store differently

    if (!token) {
        alert("No auth token found");
        return;
    }

    const payload = {
        content: caption.value,
        image_url: imageUrl || null,
        service_details: {
            category_name: category.value,
            price: parseFloat(price.value) || 0,
            availability: availability.value
        }
    };

    try {
        const res = await fetch("http://localhost:8000/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            console.log(err);
            alert("Post failed");
            return;
        }

        const data = await res.json();
        console.log("Created post:", data);

        alert("Post created successfully");

        // optional reset
        caption.value = "";
        price.value = "";
        postMedia.src = "src/assets/person.png";

    } catch (err) {
        console.error(err);
        alert("Network error");
    }
});