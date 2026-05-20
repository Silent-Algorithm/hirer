document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('input[name="search"]');
    const searchPrompt = document.getElementById('searchPrompt');
    const searchResultsSection = document.getElementById('searchResultsSection');
    
    let debounceTimer;
    const BASE_URL = "http://127.0.0.1:8000";
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            // Show prompt, hide results
            searchPrompt.style.display = 'block';
            searchResultsSection.style.display = 'none';
            searchResultsSection.classList.add('hidden');
            return;
        }
        
        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300); // 300ms delay for debouncing
    });
    
    async function performSearch(query) {
        try {
            // Hide prompt, show loading in results section
            searchPrompt.style.display = 'none';
            searchResultsSection.style.display = 'grid'; // it's a grid container
            searchResultsSection.classList.remove('hidden');
            
            searchResultsSection.innerHTML = '<p class="col-span-full text-center text-gray-500">Searching...</p>';
            
            const response = await fetch(`${BASE_URL}/users/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error("Search failed");
            }
            
            const users = await response.json();
            renderResults(users);
        } catch (error) {
            console.error("Error during search:", error);
            searchResultsSection.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to fetch search results. Please try again.</p>';
        }
    }
    
    function renderResults(users) {
        if (users.length === 0) {
            searchResultsSection.innerHTML = '<p class="col-span-full text-center text-gray-500">No results found for your search.</p>';
            return;
        }
        
        searchResultsSection.innerHTML = '';
        
        users.forEach(user => {
            const profileImg = user.profile_image ? (BASE_URL + user.profile_image) : 'src/assets/person.png';
            const skills = user.skills || 'No skills listed';
            
            const userCard = document.createElement('div');
            userCard.className = "bg-gray-50 border border-[#e5e5e5db] p-4 flex justify-between w-full rounded-2xl dark:bg-dark-theme-bg dark:border-[#2e2d2d]";
            
            userCard.innerHTML = `
                <div class="gap-4 flex">
                    <img class="h-16 w-16 min-[460px]:h-20 min-[460px]:w-20 rounded-2xl object-cover" src="${profileImg}" alt="${user.name}">
                    <div class="flex flex-col justify-center">
                        <h5 class="font-bold text-lg">${user.name}</h5>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${skills}</p>
                        <p class="pt-2 text-xs">
                            <span class="text-[#05d17cfe] font-bold">AVAILABLE</span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center justify-center">
                    <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-xl text-sm transition-colors duration-200" onclick="window.location.href='profile.html?id=${user.id}'">
                        View Profile
                    </button>
                </div>
            `;
            
            // Add click listener to navigate to the user's profile if needed, or do nothing for now
            // userCard.addEventListener('click', () => { window.location.href = \`profile.html?id=\${user.id}\`; });
            
            searchResultsSection.appendChild(userCard);
        });
    }
});
