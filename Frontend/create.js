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

async function sendPost() {
  const postData = {
    type: "service",
    content: "I fix phones"
  }

  const response = await fetch("http://127.0.0.1:8000/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  })

  const data = await response.json()
  console.log(data)
}

sendPost()