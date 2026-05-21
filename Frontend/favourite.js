const BASE_URL = "http://127.0.0.1:8000"

// ── Favourites helpers (mirrors home.js) ─────────────────────────────────────

function getFavourites() {
    return JSON.parse(localStorage.getItem("favourites") || "[]")
}

function saveFavourites(favs) {
    localStorage.setItem("favourites", JSON.stringify(favs))
}

function removeFromFavourites(postId) {
    const favs = getFavourites().filter(f => f.id !== postId)
    saveFavourites(favs)
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(message) {
    let toast = document.getElementById("bookmarkToast")
    if (!toast) {
        toast = document.createElement("div")
        toast.id = "bookmarkToast"
        toast.className = `
            fixed bottom-24 left-1/2 -translate-x-1/2
            bg-gray-900 text-white text-sm
            px-4 py-2 rounded-full shadow-lg
            opacity-0 transition-opacity duration-300
            z-50 pointer-events-none
        `
        document.body.appendChild(toast)
    }
    toast.textContent = message
    toast.style.opacity = "1"
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => { toast.style.opacity = "0" }, 2000)
}

// ── Build a single card ───────────────────────────────────────────────────────

function buildCard(item) {
    const card = document.createElement("div")
    card.id = `fav-card-${item.id}`
    card.className = `
        w-full max-w-[500px]
        bg-gray-100 dark:bg-[#161616]
        border border-[#e5e5e5] dark:border-[#2f2f2f]
        rounded-2xl overflow-hidden
        shadow-sm hover:shadow-xl
        transition-all duration-300
    `

    card.innerHTML = `
        <!-- Header -->
        <div class="flex justify-between items-center p-4">
            <div class="flex items-center gap-3">
                <img 
                    class="w-12 h-12 rounded-full object-cover border border-gray-300"
                    src="${BASE_URL + item.user.profile_image}" 
                    alt=""
                >
                <div>
                    <h3 class="font-bold text-[15px] dark:text-white">
                        ${item.user.name}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                        ${item.user.location_name
? (() => {
    const parts = item.user.location_name.split(",").map(p => p.trim())

    if (parts.length >= 2) {
        return `${parts[0]}, ${parts[parts.length - 1]}`
    }

    return item.user.location_name
})()
: "Location unavailable"
} 
                    </p>
                </div>
            </div>

            <button class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#252525] transition">
                <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                    <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/>
                </svg>
            </button>
        </div>

        <!-- Post Image -->
        <div class="w-full h-[250px] overflow-hidden bg-gray-200">
            <img 
                class="w-full h-full object-cover hover:scale-105 transition duration-500"
                src="${BASE_URL + item.image_url}" 
                alt="profile_image"
            >
        </div>

        <!-- Action Icons -->
        <div class="flex justify-between items-center px-4 pt-4">
            <div class="flex gap-5">
                <button class="hover:scale-110 transition">
                    <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                        <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                    </svg>
                </button>

                <button class="hover:scale-110 transition">
                    <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                        <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z"/>
                    </svg>
                </button>

                <button class="hover:scale-110 transition">
                    <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                        <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164Z"/>
                    </svg>
                </button>
            </div>

            <button
                class="removeBtn hover:scale-110 transition"
                data-id="${item.id}"
                aria-label="Remove from favourites"
                title="Remove from favourites"
            >
                <svg class="transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="#2563eb" style="color: #2563eb">
                    <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="p-4">
          <a href="/profile.html"> 
            <a class="font-bold text-lg dark:text-white">
                ${item.service.category.name}
            </a>
          </a>

            <p class="text-gray-600 dark:text-gray-400 mt-1">
                ${item.content}
            </p>

            <div class="flex justify-between items-center mt-5">
                <div>
                    <p class="text-sm text-gray-500">Starting from</p>
                    <h3 class="text-2xl font-extrabold text-blue-600">
                        ${item.service.price} CFA
                    </h3>
                </div>

                ${
    item.user.whatsapp_link
        ? `
            <a href="https://chat.whatsapp.com/...${item.user.whatsapp_link}" target="_blank">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-md flex items-center gap-2">
                    Hire Now
                </button>
            </a>
        `
        : `
            <button disabled class="bg-gray-400 opacity-50 cursor-not-allowed text-white px-5 py-2.5 rounded-full font-semibold shadow-md flex items-center gap-2">
                No WhatsApp Link
            </button>
        `
}
            </div>
        </div>
    `

    // Remove button handler
    const removeBtn = card.querySelector(".removeBtn")
    if (removeBtn) {
        removeBtn.addEventListener("click", () => {
            removeFromFavourites(item.id)
            showToast("Removed from favourites")

            // Animate card out then remove from DOM
            card.style.transition = "opacity 0.3s, transform 0.3s"
            card.style.opacity = "0"
            card.style.transform = "scale(0.95)"
            setTimeout(() => {
                card.remove()
                if (getFavourites().length === 0) {
                    document.getElementById("emptyState").style.display = "flex"
                    document.getElementById("favouritesSection").style.display = "none"
                }
            }, 300)
        })
    }

    return card
}

// ── Init ──────────────────────────────────────────────────────────────────────

function loadFavourites() {
    const favs = getFavourites()

    console.log("favourites from localStorage:", favs)

    const section = document.getElementById("favouritesSection")
    const emptyState = document.getElementById("emptyState")

    if (!section || !emptyState) {
        console.error("Could not find #favouritesSection or #emptyState in the DOM")
        return
    }

    if (favs.length === 0) {
        emptyState.style.display = "flex"
        section.style.display = "none"
        return
    }

    // Has favourites — hide empty state, show section
    emptyState.style.display = "none"
    section.style.display = "flex"
    section.style.paddingLeft = "4%"
    section.style.paddingRight = "4%"
    section.innerHTML = ""

    for (const item of favs) {
        section.appendChild(buildCard(item))
    }
}

// Wait for DOM to be fully ready before running
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadFavourites)
} else {
    loadFavourites()
}