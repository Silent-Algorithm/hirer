async function fetchData() {
    try {
        const res = await fetch("http://127.0.0.1:8000/posts")

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`)
        }

        return await res.json()

    } catch (err) {
        console.log(err.message)
        return null
    }
}

// ── Favourites helpers ──────────────────────────────────────────────────────

function getFavourites() {
    return JSON.parse(localStorage.getItem("favourites") || "[]")
}

function saveFavourites(favs) {
    localStorage.setItem("favourites", JSON.stringify(favs))
}

function isFavourited(postId) {
    return getFavourites().some(f => f.id === postId)
}

function toggleFavourite(item) {
    let favs = getFavourites()
    const idx = favs.findIndex(f => f.id === item.id)
    if (idx === -1) {
        favs.push(item)
    } else {
        favs.splice(idx, 1)
    }
    saveFavourites(favs)
    return idx === -1   // true = just added, false = just removed
}

// ── Render ──────────────────────────────────────────────────────────────────

async function loadData() {
    const data = await fetchData()

    if (!data) {
        throw new Error("Data did not load")
    }

    const container = document.getElementById("feetSection")
    container.innerHTML = ""

    const BASE_URL = "http://127.0.0.1:8000"

    for (let item of data) {

        const saved = isFavourited(item.id)

        const card = document.createElement("div")
        card.className = `
            bg-white dark:bg-[#161616]
            border border-[#e5e5e5]
            dark:border-[#2f2f2f]
            rounded-2xl
            overflow-hidden
            shadow-sm
            hover:shadow-xl
            transition-all
            duration-300
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
                            0.8km • ${item.user.skills}
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
            <div class="overflow-hidden">
                <img 
                    class="w-full h-[250px] object-cover hover:scale-105 transition duration-500"
                    src="${BASE_URL + item.image_url}" 
                    alt=""
                >
            </div>

            <!-- Action Icons -->
            <div class="flex justify-between items-center px-4 pt-4">
                <div class="flex gap-5">
                    <!-- favorite/like -->
                    <button class="hover:scale-110 transition">
                        <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                        </svg>
                    </button>

                    <!-- message -->
                    <button class="hover:scale-110 transition">
                        <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                            <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z"/>
                        </svg>
                    </button>

                    <!-- share -->
                    <button class="hover:scale-110 transition">
                        <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                            <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164Z"/>
                        </svg>
                    </button>
                </div>

                <!-- ── Bookmark button ── -->
                <button
                    class="bookmarkBtn hover:scale-110 transition"
                    data-id="${item.id}"
                    aria-label="Save to favourites"
                    title="${saved ? 'Remove from favourites' : 'Save to favourites'}"
                >
                    <svg
                        class="bookmarkIcon transition-colors duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        height="22px"
                        viewBox="0 -960 960 960"
                        width="22px"
                        fill="${saved ? '#2563eb' : 'currentColor'}"
                        style="color: ${saved ? '#2563eb' : 'black'}"
                    >
                        <!-- filled when saved, outlined when not -->
                        ${saved
                            ? `<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>`
                            : `<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>`
                        }
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-4">
                <h2 class="font-bold text-lg dark:text-white">
                    ${item.type}
                </h2>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    ${item.user.name}
                </p>

                <div class="flex justify-between items-center mt-5">
                    <div>
                        <p class="text-sm text-gray-500">Starting from</p>
                        <h3 class="text-2xl font-extrabold text-blue-600">
                            $45/hour
                        </h3>
                    </div>

                    <a href="${item.user.whatsapp_link}">
                        <button class="
                            bg-blue-600 hover:bg-blue-700
                            text-white px-5 py-2.5 rounded-full
                            font-semibold transition shadow-md
                            flex items-center gap-2
                        ">
                            <svg class="fill-[#efecec]" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
                                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98Z"/>
                            </svg>
                            <span>Hire Now</span>
                        </button>
                    </a>
                </div>
            </div>
        `

        // ── Bookmark click handler ───────────────────────────────────────────
        const bookmarkBtn = card.querySelector(".bookmarkBtn")
        const bookmarkIcon = card.querySelector(".bookmarkIcon")

        // Store full item data on the button for easy access
        bookmarkBtn.dataset.item = JSON.stringify(item)

        bookmarkBtn.addEventListener("click", () => {
            const postItem = JSON.parse(bookmarkBtn.dataset.item)
            const nowSaved = toggleFavourite(postItem)

            // Swap icon between filled and outlined
            bookmarkIcon.innerHTML = nowSaved
                ? `<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z"/>`
                : `<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>`

            bookmarkIcon.setAttribute("fill", nowSaved ? "#2563eb" : "currentColor")
            bookmarkIcon.style.color = nowSaved ? "#2563eb" : "black"
            bookmarkBtn.title = nowSaved ? "Remove from favourites" : "Save to favourites"

            // Bounce animation
            bookmarkBtn.classList.add("scale-125")
            setTimeout(() => bookmarkBtn.classList.remove("scale-125"), 150)

            // Toast notification
            showToast(nowSaved ? "Saved to favourites" : "Removed from favourites")
        })

        container.appendChild(card)
    }
}

// ── Toast ────────────────────────────────────────────────────────────────────

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

loadData()