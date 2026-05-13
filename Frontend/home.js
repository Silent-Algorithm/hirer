const bookmarkIcon = document.querySelectorAll('.bookmarkIcon')

//listen to clicked bookmark icons

bookmarkIcon.forEach((feed,index) => {
    bookmarkIcon[index].addEventListener('click', () => {
    bookmarkIcon[index].style.fill = 'orange'
    console.log('clicked bookmark')
    })

})

