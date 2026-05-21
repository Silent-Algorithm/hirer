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

        if (data.profile_image) {
            profileImage.src = BASE_URL + data.profile_image;
        }

        // Name
        document.getElementById("workerName").textContent =
            data.name || "Unknown User";

        // Location
        let locationText = "Location unavailable";

        if (data.location_name) {
            const parts = data.location_name
                .split(",")
                .map(part => part.trim());

            if (parts.length >= 3) {
                locationText = `${parts[2]}, ${parts[parts.length - 1]}`;
            } else {
                locationText = data.location_name;
            }
        }

        document.getElementById("workerLocation").textContent = locationText;

        // About / Bio
        document.getElementById("workerAbout").textContent =
            data.bio || "No bio available";

        // Skills
        const skillsContainer = document.getElementById("workerSkills");
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

        // Contact button
        const contactBtn = document.getElementById("workerContactBtn");
        const contactText = document.getElementById("workerContactText");

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

    } catch (err) {
        console.error(err);
    }
}

loadUserProfile();