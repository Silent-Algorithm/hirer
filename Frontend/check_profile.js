const userId = localStorage.getItem("profile_user_id");

if (!userId) {
    console.error("No user id found");
}

const BASE_URL = "http://localhost:8000";

async function loadUserProfile() {
    try {
        const res = await fetch(`${BASE_URL}/users/${userId}`);

        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }

        const data = await res.json();

        console.log(data);

        // Profile image
        const profileImage = document.getElementById("accountProfile");

        if (profileImage) {
            if (data.profile_image) {
                profileImage.src = BASE_URL + data.profile_image;
            }
        }

        // Name
        const nameEl = document.getElementById("workerName");
        if (nameEl) {
            nameEl.textContent = data.name || "Unknown User";
        }

        // Location
        let locationText = "Location unavailable";

        if (data.location_name) {
            const parts = data.location_name
                .split(",")
                .map(part => part.trim());

            if (parts.length >= 3) {
                locationText = `${parts[0]}, ${parts[parts.length - 1]}`;
            } else {
                locationText = data.location_name;
            }
        }

        const locationEl = document.getElementById("workerLocation");
        if (locationEl) {
            locationEl.textContent = locationText;
        }

        // About / Bio
        const aboutEl = document.getElementById("workerAbout");
        if (aboutEl) {
            aboutEl.textContent = data.bio || "No bio available";
        }

        // Skills
        const skillsContainer = document.getElementById("workerSkills");

        if (skillsContainer) {
            skillsContainer.innerHTML = "";

            if (data.skills && data.skills.trim() !== "") {

                const skills = data.skills
                    .split(",")
                    .map(skill => skill.trim());

                skills.forEach(skill => {
                    const badge = document.createElement("span");

                    badge.className =
                        "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm";

                    badge.textContent = skill;

                    skillsContainer.appendChild(badge);
                });

            } else {
                skillsContainer.innerHTML = `
                    <span class="text-gray-500">
                        No skills listed
                    </span>
                `;
            }
        }

        // Contact button
        const contactBtn = document.getElementById("workerContactBtn");
        const contactText = document.getElementById("workerContactText");

        if (contactBtn && contactText) {

            if (data.whatsapp_link) {

                contactBtn.onclick = () => {
                    window.open(data.whatsapp_link, "_blank");
                };

                contactText.textContent = "Contact";

            } else {

                contactBtn.disabled = true;
                contactBtn.classList.add("opacity-50");

                contactText.textContent = "No Contact";
            }
        }
        //  GET THE POST OF A USER 
                const posts = await getUserPosts(userId);

                console.log(posts);




        // ── RATING SECTION (FIXED) ─────────────────────────────

        const ratingStars = document.getElementById("ratingStars");
        const ratingValue = document.getElementById("ratingValue");


        try {
            const ratingsRes = await fetch(
                `${BASE_URL}/users/${userId}/ratings`
            );

            if (!ratingsRes.ok) {
                throw new Error(`Failed to load ratings (${ratingsRes.status})`);
            }

            const ratings = await ratingsRes.json();

            let averageRating = 0;

            if (ratings.length > 0) {
                const total = ratings.reduce(
                    (sum, item) => sum + Number(item.rating || 0),
                    0
                );

                averageRating = total / ratings.length;
            }

            if (ratingStars) {
                ratingStars.innerHTML = "";

                const maxStars = 5;
                const fullStars = Math.round(averageRating);

                for (let i = 1; i <= maxStars; i++) {
                    const star = document.createElement("span");

                    star.textContent =
                        i <= fullStars ? "★" : "☆";

                    star.className =
                        "text-yellow-400";

                    ratingStars.appendChild(star);
                }
            }

            if (ratingValue) {
                ratingValue.textContent =
                    `${averageRating.toFixed(1)} / 5`;
            }

        } catch (err) {
            console.error("Rating error:", err);

            if (ratingStars) {
                ratingStars.innerHTML = "☆☆☆☆☆";
            }

            if (ratingValue) {
                ratingValue.textContent = "0.0 / 5";
            }
        }

    } catch (err) {
        console.error(err);
    }
}

loadUserProfile();

async function getUserPosts(userId) {
    try {
        const res = await fetch(
            `${BASE_URL}/users/${userId}/posts`
        );

        if (!res.ok) {
            throw new Error(`Failed to load posts (${res.status})`);
        }

        return await res.json();

    } catch (err) {
        console.error("Posts error:", err);
        return [];
    }
}
async function loadUserPosts() {
    const grid = document.getElementById("userPostsGrid");

    if (!grid) return;

    try {
        const res = await fetch(
            `${BASE_URL}/users/${userId}/posts`
        );

        if (!res.ok) {
            throw new Error(`HTTP Error ${res.status}`);
        }

        const posts = await res.json();

        grid.innerHTML = "";

        const imagePosts = posts.filter(
            post => post.image_url
        );

        if (!imagePosts.length) {
            grid.innerHTML = `
                <p class="col-span-3 text-center text-gray-500 py-8">
                    No posts yet
                </p>
            `;
            return;
        }

        imagePosts.forEach(post => {
            const img = document.createElement("img");

            img.src = `${BASE_URL}${post.image_url}`;
            img.alt = "Post";
            img.loading = "lazy";

            img.className = `
                w-full
                aspect-square
                object-cover
                cursor-pointer
                hover:opacity-90
                transition
                rounded
            `;

            grid.appendChild(img);
        });

    } catch (err) {
        console.error("Failed to load posts:", err);
    }
}

loadUserPosts();