//Theme mode
const toggleTheme = document.getElementById('toggleTheme');

if (toggleTheme) {
    //toggle dark and ligh theme
    toggleTheme.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark')
        localStorage.setItem("theme",document.documentElement.classList.value)
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
    localStorage.getItem("theme") === 'dark' ? document.documentElement.classList.remove('dark') : document.documentElement.classList.add('dark');
 

    console.log(localStorage.getItem('theme'))

    
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
        window.location.href = 'favorite.html'
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

