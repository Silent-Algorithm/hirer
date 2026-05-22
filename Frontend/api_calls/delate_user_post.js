const API_BASE = "http://localhost:8000";

async function deletePost(postId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You must be logged in");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Failed to delete post");
    }

    console.log(data.message);
    alert("Post deleted successfully");

    // Optional: remove post from page
    document.getElementById(`post-${postId}`)?.remove();

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}