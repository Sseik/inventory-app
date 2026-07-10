const closeButton = document.querySelector("form button");
const addButton = document.querySelector(".book button");
const form = document.querySelector(".form-container");

function toggleFormVisibility() {
  form.classList.toggle("invisible");
}

addButton.addEventListener("click", toggleFormVisibility);
closeButton.addEventListener("click", toggleFormVisibility);
