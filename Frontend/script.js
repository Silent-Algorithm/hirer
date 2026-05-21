//Theme mode
const toggleTheme = document.getElementById('toggleTheme');

if (toggleTheme) {
    //toggle dark and ligh theme
    toggleTheme.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark')
        const isDark = document.documentElement.classList.contains('dark')
        localStorage.setItem("theme", isDark ? "dark" : "light")
    })
}
//render post
const feet = document.getElementById('feet')
if (feet) {
    const feetSection = document.getElementById('feetSection')

    for (let i = 0; i < 6; i++) {
        let div = document.createElement('div')
        div.innerHTML = feet.innerHTML
        feetSection.appendChild(div)
    }
}

//use the same theme in the home page accross all pages
    localStorage.getItem("theme") === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');

//toggle taskbar during scroll and screen holds
   let lastScrollY = scrollY;
    
const footer = document.querySelector('footer')
const footerSection = document.getElementById('footerSection')

let timer
if(footer){
const startHold = () => {
    timer = setTimeout(() => {
        footer.style.display = 'none'
    },400)
}

const endHold = () => {
    footer.style.display = 'flex'
    clearTimeout(timer)
}
window.document.addEventListener('pointerdown',startHold);
window.document.addEventListener('pointerup',endHold)

window.document.addEventListener('pointerleave', endHold)


//liten to taskbar's icon clicks
//liten to taskbar's icon clicks

const searchIcon = document.getElementById('searchIcon')
const homeIcon = document.getElementById('homeIcon')
const createIcon = document.getElementById('createIcon')
const profileIcon = document.getElementById('profileIcon');
const favoriteIcon = document.getElementById('favoriteIcon')

    searchIcon.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = 'search.html'
    })

    homeIcon.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = 'home.html'
    })

    createIcon.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = 'create.html'
    })

    profileIcon.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = 'profile.html'
    })

        favoriteIcon.addEventListener('click', (event) => {
        event.preventDefault()
        window.location.href = 'favourite.html'
    })



//track clicked taskbar icon

const page = document.querySelector('title')

const styleTaskbarIcon = () => {

    const footerIcon = document.getElementById('footerIcon');
    const footerIconText = document.getElementById('footerIconText');

    footerIconText.style.color = '#155dfc'
    footerIcon.style.fill = '#155dfc'
}

page.id === 'homeIconPage'?styleTaskbarIcon():page.id === 'searchIconPage'?styleTaskbarIcon():page.id === 'createIconPage'?styleTaskbarIcon():page.id === 'profileIconPage'?styleTaskbarIcon():page.id = 'favoriteIconPage'?styleTaskbarIcon():' '
}
//render Search page category and recommendation cards

const recommendationCard = document.getElementById('recommendationCard')
const recommendationSection = document.getElementById('recommendationSection')
const categoryCard = document.getElementById('categoryCard')
const categorySection = document.getElementById('categorySection')

if (recommendationCard || categoryCard) {
    for (let i = 0; i < 4; i++){
        let newRecommendationCard = document.createElement('div');
        newRecommendationCard.innerHTML = recommendationCard.innerHTML;
        recommendationSection.append(newRecommendationCard);

         let newCategoryCard = document.createElement('div');
        newCategoryCard.innerHTML = categoryCard.innerHTML;
        categorySection.append(newCategoryCard);

    }
}

const locationPermission = document.getElementById('locationPermission')

if (locationPermission) {
    locationPermission.addEventListener('change', (event) => {
        if (event.target.checked) {
            console.log('location access granted')  
            
            let mypromise = new Promise((resolve, rejected) => {
    navigator.geolocation.getCurrentPosition(resolve, rejected)
})

mypromise.then(status => {
    const usersLastitude = status.coords.latitude
    const usersLongitude = status.coords.longitude
}).catch(error=>{
    console.warn(error.message)
})
        }
        else {
            console.log('location access denied')
        }
        
    })
}
document.body.style = "git reset --hard"


// expand profile picture onclick and aslo close

const accountProfile = document.getElementById('accountProfile')
   
if (accountProfile) {
 const header = document.querySelector('header')
        const main = document.querySelector('main')
        const fullAccountProfile = document.getElementById('fullAccountProfile')
    accountProfile.addEventListener('click', () => {
       
        main.style.display = 'none'
        header.style.display = 'none'
        fullAccountProfile.style.display = 'block'
               
        console.log('clicked profile')
    })

    const closeAccountProfile = document.getElementById('closeAccountProfile')

    closeAccountProfile.addEventListener('click', () => {
               main.style.display = 'block'
        header.style.display = 'block'
        fullAccountProfile.style.display = 'none'
    })
}
// Language Translation Logic
const translations = {
    "en": {
        "Home": "Home",
        "Search": "Search",
        "Favorite": "Favorite",
        "Profile": "Profile",
        "Login": "Login",
        "Sign Up": "Sign Up",
        "Contact Us": "Contact Us",
        "New post": "New post",
        "Share": "Share",
        "Caption": "Caption",
        "Service Category": "Service Category",
        "Price Estimate": "Price Estimate",
        "Availability": "Availability",
        "Post": "Post",
        "Edit Profile": "Edit Profile"
    },
    "fr": {
        "Home": "Accueil",
        "Search": "Recherche",
        "Favorite": "Favoris",
        "Profile": "Profil",
        "Login": "Connexion",
        "Sign Up": "S'inscrire",
        "Contact Us": "Nous contacter",
        "New post": "Nouveau post",
        "Share": "Partager",
        "Caption": "Légende",
        "Service Category": "Catégorie de service",
        "Price Estimate": "Estimation de prix",
        "Availability": "Disponibilité",
        "Post": "Publier",
        "Edit Profile": "Modifier le profil"
    }
};

function translatePage(lang) {
    const dict = translations[lang] || translations["en"];
    
    // Helper to replace text for elements that match common nav/button terms
    const elementsToTranslate = document.querySelectorAll('p, h1, button, a, label, span');
    
    elementsToTranslate.forEach(el => {
        // Only translate if it has no children (just text) or is specifically targeted
        if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
            const originalText = el.textContent.trim();
            
            // Reverse lookup: if current text is in either EN or FR dictionary, we map it to the target lang
            let key = null;
            for (const [k, v] of Object.entries(translations["en"])) {
                if (v === originalText) { key = k; break; }
            }
            if (!key) {
                for (const [k, v] of Object.entries(translations["fr"])) {
                    if (v === originalText) { key = k; break; }
                }
            }
            
            if (key && dict[key]) {
                el.textContent = dict[key];
            }
        }
    });
}

const languageSelects = document.querySelectorAll('select[name="language"], select#language');

languageSelects.forEach(select => {
    // Set initial value
    const savedLang = localStorage.getItem("language") || "en";
    select.value = savedLang;
    
    select.addEventListener('change', (e) => {
        const lang = e.target.value;
        localStorage.setItem("language", lang);
        translatePage(lang);
        
        // Sync all other language dropdowns if there are multiple
        languageSelects.forEach(s => { s.value = lang; });
    });
});

// Run once on load
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("language") || "en";
    if (savedLang !== "en") {
        translatePage(savedLang);
    }
});
