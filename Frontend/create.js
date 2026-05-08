const postMedia = document.getElementById('postMedia');
const addPostMedia = document.getElementById('addPostMedia');
const file = document.getElementById('file')


addPostMedia.addEventListener('click', () => {
    file.click()
    
});

file.addEventListener('change', (e) => {

    const url = URL.createObjectURL(e.target.files[0])
    console.log(url)
    postMedia.src = url
    postMedia.style.display = 'block'
    console.log(e.target.files[0])
})