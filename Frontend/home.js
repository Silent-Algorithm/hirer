const bookmarkIcon = document.getElementsByClassName('bookmarkIcon')
console.log(bookmarkIcon)
bookmarkIcon.addEventListener('click', () => {
    bookmarkIcon.style.fill = 'blue'
    console.log('clicked bookmark')
})