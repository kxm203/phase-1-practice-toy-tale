let addToy = false;
const toyContainer = document.getElementById('toy-collection')


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function updateLikes(toy, likesElement) {
  toy.likes++

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      likes: toy.likes
    })
  })
    .then((resp) => resp.json())
    .then((updatedToy) => likesElement.textContent = `${updatedToy.likes} likes`)
}


function renderToy(toy) {
  console.log(toy)
  const toyCard = document.createElement('div')
  toyCard.className="card"

toyCard.innerHTML = `
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  `
  const button = document.createElement('button')
  button.className = "like-btn"
  button.id = toy.id
  button.textContent = "Like ❤️"

  const likesElement = document.createElement('p')
  likesElement.textContent = `${toy.likes} Likes`
  toyCard.append(likesElement, button)


  button.addEventListener('click', () => updateLikes(toy, likesElement ))

  toyContainer.append(toyCard)
}

function getToys() {
  fetch('http://localhost:3000/toys')
  .then((resp) => resp.json())
  .then((toys) => toys.forEach(renderToy))
}

function handleNewToy(event) {
  event.preventDefault()
  const toyName = event.target.name.value
  const image = event.target.image.value

  const newToyObj = {
    name: toyName,
    image,
    likes: 0
  }

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(newToyObj)
  })
  .then((resp) => resp.json())
  .then((newToy) => {
    renderToy(newToy)
    event.target.reset()
  })
}
function listenForNewToy() {
  const form = document.querySelector('form')
  form.addEventListener('submit', handleNewToy)
}

function init() {
  getToys()
  listenForNewToy()
}

init()