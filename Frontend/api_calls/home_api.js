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

async function loadData() {
    const data = await fetchData()

    if (!data) {
        throw new Error("Data did not load")
    }

    const container = document.getElementById("feetSection")

    container.innerHTML = ""

    const BASE_URL = "http://127.0.0.1:8000"

    for (let item of data) {

        const card = document.createElement("div")

        card.className = `
            bg-white dark:bg-dark
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

                    <!-- favorite -->
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

                <!-- bookmark -->
                <a href="./favourite.html" class="hover:scale-110 transition">
                    <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240Z"/>
                    </svg>
                </a>

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
                        <p class="text-sm text-gray-500">
                            Starting from
                        </p>

                        <h3 class="text-2xl font-extrabold text-blue-600">
                            $45/hour
                        </h3>
                    </div>

                    <a href="${item.user.whatsapp_link}">
                        <button class="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-5
                            py-2.5
                            rounded-full
                            font-semibold
                            transition
                            shadow-md
                            flex
                            items-center
                            gap-2
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

        container.appendChild(card)
    }
}

loadData()