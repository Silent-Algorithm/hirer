const toggleTheme = document.getElementById('toggleTheme');

toggleTheme.addEventListener('click',() => {
    document.documentElement.classList.toggle('dark')
})

const feet = document.getElementById('feet')
const feetSection = document.getElementById('feetSection')

for (let i = 0; i < 6; i++){
    let div = document.createElement('div')
div.innerHTML = feet.innerHTML
    feetSection.appendChild(div)
}
    
//scroll
   let lastScrollY = scrollY;
console.log(lastScrollY)
    
const footer = document.querySelector('footer')
const footerSection = document.getElementById('footerSection')

window.document.addEventListener('scroll', () => {
    console.log('scrolling')
 
    console.log( typeof scrollY)

    console.log(`S:${lastScrollY}, N:${scrollY}  =${scrollY - lastScrollY}`)

    if (scrollY - lastScrollY >150 || lastScrollY - scrollY >150) {
            
       footer.style.display = 'none'
    footerSection.display= 'none' 
        lastScrollY = scrollY;
    }
    
})

window.document.addEventListener('scrollend', () => {
    console.log('scrolling')
    footer.style.display = 'flex'
    footerSection.style.display = 'flex'
})

