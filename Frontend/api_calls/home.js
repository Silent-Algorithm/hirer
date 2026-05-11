async function fetchData() {
    try {
        const res = await fetch("http://127.0.0.1:8000/posts")

        if (!res.ok) {
            throw new Error(`HTTP Error: ${res.status}`)
        }

        const data = await res.json()
        return data

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

    for (let item of data) {
        const  BASE_URL = "http://127.0.0.1:8000"
        const div = document.createElement("div")

        div.innerHTML = `
            <section id="feetSection" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-[618px]:mx-[4%]">
                <!-- a feed -->
     
                <div class="dark:border-[#2e2d2d] relative border py-4 border-[#e5e5e5db] min-[618px]:rounded-xl">
                    <!-- name and profession -->
                    <div class="relative flex justify-between pb-2 mx-[4%]">
                        <div class="flex gap-3">
                            <img src="${BASE_URL + item.user.profile_image}" alt="">
                            <div>
                                <p class="font-bold"> ${item.user.name}</p>
                                <p><span>0.8km</span><span>.</span>${item.user.skills}</p>
                            </div>
                        </div>

                        <div class="h-6 w-6">
                            <!-- horizontal dots icon: -->
                            <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black">
                                <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- media post -->
                    <img class="w-full max-h-68" src="${BASE_URL + item.image_url}" alt="">

                    <div class="pt-3 flex justify-between mx-[4%]">
                        <div class="flex gap-4">
                            <!-- favorite icon: -->
                            <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"/>
                            </svg>

                            <!-- message icon: -->
                            <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                                <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Z"/>
                            </svg>

                            <!-- share icon: -->
                            <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                                <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164Z"/>
                            </svg>
                        </div>

                        <!-- bookmark icon: -->
                        <a href="./favourite.html">
                            <svg class="dark:fill-[#cbcbcb]" xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill="black">
                                <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240Z"/>
                            </svg>
                        </a>
                    </div>

                    <div class="px-[4%] pt-2">
                        <h6 class="font-bold">${item.type}</h6>
                        <p>${item.user.name}</p>

                        <div class="flex justify-between items-center pt-2">
                            <p>Starting from<br><span class="font-extrabold text-[#3f7efd]">$45/hour</span></p>
                            <a a href = "${item.user.whatsapp_link}">
                                <button class="bg-blue-600 flex py-1.5 px-2.5 rounded-3xl justify-center items-center">
                                    <!-- call icon: -->
                                    <svg class="dark:fill-[#cbcbcb] fill-[#efecec]" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                                        <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98Z"/>
                                    </svg>

                                    <p class="text-[#dfdddd] dark:text-[#cbcbcb]">Hire Now</p>
                                </button>
                            </a> 
                        </div>
                    </div>
                </div>
            </section>
        `

        container.appendChild(div)
    }
}

loadData()