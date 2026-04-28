//Theme mode
const toggleTheme = document.getElementById('toggleTheme');

if (toggleTheme) {
    //toggle dark and ligh theme
    toggleTheme.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark')
        console.log(document.documentElement.classList.value)
        localStorage.setItem("theme",document.documentElement.classList.value)
    })
//render post
    const feet = document.getElementById('feet')
    const feetSection = document.getElementById('feetSection')

    for (let i = 0; i < 6; i++) {
        let div = document.createElement('div')
        div.innerHTML = feet.innerHTML
        feetSection.appendChild(div)
    }
   
}

    
//toggle taskbar during scroll and screen holds
   let lastScrollY = scrollY;
    
const footer = document.querySelector('footer')
const footerSection = document.getElementById('footerSection')

let timer
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


//use the same theme in the home page accross all pages
localStorage.getItem("theme") === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');

//liten to taskbar's icon clicks
//liten to taskbar's icon clicks

const searchIcon = document.getElementById('searchIcon')
const homeIcon = document.getElementById('homeIcon')
const createIcon = document.getElementById('createIcon')

searchIcon.addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = 'search.html'
})

homeIcon.addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = 'index.html'
})

createIcon.addEventListener('click', (event) => {
    event.preventDefault()
    window.location.href = 'create.html'
})




//track clicked taskbar icon

const page = document.querySelector('title')

const styleTaskbarIcon = () => {

    const footerIcon = document.getElementById('footerIcon');
    const footerIconText = document.getElementById('footerIconText');

    footerIconText.style.color = '#155dfc'
    footerIcon.style.fill = '#155dfc'
}

page.id === 'homeIconPage'?styleTaskbarIcon():page.id === 'searchIconPage'?styleTaskbarIcon():page.id === 'createIconPage'?styleTaskbarIcon(): ' '

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