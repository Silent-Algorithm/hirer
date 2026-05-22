const API_BASE = "http://localhost:8000";
const token = localStorage.getItem("token");

// ===============================
// GET CURRENT USER
// ===============================
async function getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch current user");
    }

    return await res.json();
}

// ===============================
// GET CURRENT USER POSTS
// ===============================
async function getCurrentUserPosts() {
    try {
        const user = await getCurrentUser();

        const res = await fetch(
            `${API_BASE}/users/${user.id}/posts`
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch posts (${res.status})`);
        }

        return await res.json();

    } catch (err) {
        console.error(err);
        return [];
    }
}

// ===============================
// RENDER POSTS
// ===============================
async function renderCurrentUserPosts() {
    const container = document.getElementById("userPostsContainer");

    if (!container) return;

    // Center all cards
    container.className = "flex flex-col items-center gap-6";

    container.innerHTML = `
        <p class="text-center py-6">Loading posts...</p>
    `;

    const posts = await getCurrentUserPosts();

    container.innerHTML = "";

    if (!posts.length) {
        container.innerHTML = `
            <p class="text-center py-10 text-gray-500">
                No posts yet
            </p>
        `;
        return;
    }

    posts.forEach((item) => {

        const card = document.createElement("div");

        card.className = `
            w-full max-w-[500px]
            bg-gray-100 dark:bg-dark-theme-fg
            border border-[#e5e5e5] dark:border-[#2f2f2f]
            rounded-2xl overflow-hidden
            shadow-sm hover:shadow-xl
            transition-all duration-300
        `;

        card.innerHTML = `
            <!-- Header -->
            <div class="flex justify-between items-center p-4 relative">

                <div class="flex items-center gap-3">

                    <img
                        class="w-12 h-12 rounded-full object-cover border border-gray-300"
                        src="${API_BASE + item.user.profile_image}"
                        alt=""
                    >

                    <div>
                        <h3 class="font-bold text-[15px] dark:text-white">
                            ${item.user.name}
                        </h3>

                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${
                                item.user.location_name
                                    ? (() => {
                                        const parts = item.user.location_name
                                            .split(",")
                                            .map(p => p.trim());

                                        return parts.length >= 2
                                            ? `${parts[0]}, ${parts[parts.length - 1]}`
                                            : item.user.location_name;
                                    })()
                                    : "Location unavailable"
                            }
                        </p>
                    </div>

                </div>

                <!-- 3 dots menu -->
                <div class="relative">

                    <button
                        class="post-menu-btn text-xl px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        data-post-id="${item.id}"
                    >
                        ⋮
                    </button>

                    <div
                        class="post-dropdown hidden absolute right-0 top-10 bg-white dark:bg-dark-theme-fg border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[140px]"
                    >
                        <button
                            class="delete-post-btn w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                            data-post-id="${item.id}"
                        >
                            Delete Post
                        </button>
                    </div>

                </div>

            </div>

            <!-- Image -->
            <div class="w-full h-[250px] overflow-hidden bg-gray-200">

                <img
                    src="${API_BASE + item.image_url}"
                    class="w-full h-full object-cover hover:scale-105 transition duration-500"
                    alt=""
                >

            </div>

            <!-- Actions -->
            <div class="flex justify-between items-center px-4 pt-4">

                <div class="flex gap-5">

                    <button class="hover:scale-110 transition">
                        ❤️
                    </button>

                    <button class="hover:scale-110 transition">
                        💬
                    </button>

                    <button class="hover:scale-110 transition">
                        ↗
                    </button>

                </div>

            </div>

            <!-- Content -->
            <div class="p-4">

                <h3 class="font-bold text-lg dark:text-white">
                    ${item.service?.category?.name || "Service"}
                </h3>

                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    ${item.content || ""}
                </p>

                <div class="flex justify-between items-center mt-5">

                    <div>

                        <p class="text-sm text-gray-500">
                            Starting from
                        </p>

                        <h3 class="text-2xl font-extrabold text-blue-600">
                            ${
                                item.service?.price
                                    ? `${item.service.price} CFA`
                                    : "Price unavailable"
                            }
                        </h3>

                    </div>

                    ${
                        item.user.whatsapp_link
                            ? `
                            <a
                                href="${item.user.whatsapp_link}"
                                target="_blank"
                            >
                                <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-md">
                                    Hire Now
                                </button>
                            </a>
                            `
                            : `
                            <button disabled class="bg-gray-400 opacity-50 cursor-not-allowed text-white px-5 py-2.5 rounded-full font-semibold shadow-md">
                                No WhatsApp Link
                            </button>
                            `
                    }

                </div>

            </div>
        `;

        container.appendChild(card);

        // ===============================
        // DROPDOWN LOGIC
        // ===============================
        const menuBtn = card.querySelector(".post-menu-btn");
        const dropdown = card.querySelector(".post-dropdown");
        const deleteBtn = card.querySelector(".delete-post-btn");

        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", () => {
            dropdown.classList.add("hidden");
        });

        deleteBtn.addEventListener("click", async () => {
            const confirmed = confirm("Delete this post?");
            if (!confirmed) return;

            try {
                const res = await fetch(`${API_BASE}/posts/${item.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to delete post");
                }

                card.remove();

            } catch (err) {
                console.error(err);
                alert("Could not delete post.");
            }
        });
    });
}

// ===============================
// INIT
// ===============================
renderCurrentUserPosts();