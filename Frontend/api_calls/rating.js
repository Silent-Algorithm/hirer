async function submitRating(rating, comment = "") {
    const userId = localStorage.getItem("profile_user_id");
    const token = localStorage.getItem("access_token");

    if (!userId) {
        console.error("No worker selected");
        return;
    }

    try {
        const res = await fetch(
            `http://127.0.0.1:8000/users/${userId}/ratings`,
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

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}