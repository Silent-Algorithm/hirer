const toggleTheme = document.getElementById('toggleTheme');

toggleTheme.addEventListener('click',() => {
    document.documentElement.classList.toggle('dark')
})