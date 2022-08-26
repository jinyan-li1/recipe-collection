const baseURL = "http://localhost:8000";

const recipeForm = document.querySelector(".recipe-form");

const createRecipeAPI = async (body) => {
    return fetch(`${baseURL}/recipes`, {headers: {'Content-Type': 'application/json'}, method: 'POST', body: JSON.stringify(body)});
}

const createRecipe = async (e) => {
  e.preventDefault();
  const title = document.getElementById("recipe-name").value, 
  content = document.getElementById("recipe-content").value;
  const body = {title, content};
  const res = await createRecipeAPI(body);
  const item = await res.json();
  recipeForm.reset();
  recipeAddtion(item);
}

const recipeAddtion = (item) => {
 const listElement = document.getElementById("recipe-list-id");
  const htmlElement = `<li class="recipe-list-item">
      <p>${item.title}</p> 
      <button onclick="deleteRecipe(${item.id})">Delete</button>
      <button onclick="toggleUpdate(${item.id})">Edit</button>
      <div class="recipe-edit-form hide" id="edit-form-${item.id}" autocomplete="off">
        <div>
          <textarea type="text" id="edit-content-${item.id}" rows="5" required minlength="1" maxlength="500"></textarea>
        </div>
        <button onclick="updateRecipe(${item.id})" id="${item.id}">Update</button>
      </div>
      <button onclick="toggleDisplay(${item.id})">Details</button>
      <span id="toggle-btn-${item.id}" class="hide">${item.content}</span>
    </li>`;
    listElement.innerHTML += htmlElement;  
}

const updateRecipeAPI = async (body) => {
    return fetch(`${baseURL}/recipes`, {headers: {'Content-Type': 'application/json'}, method: 'PUT', body: JSON.stringify(body)});
}

const updateRecipe = async (id) => {
   const content = document.getElementById(`edit-content-${id}`).value;
   const body = {id, content};
  const res = await updateRecipeAPI(body);
  recipeForm.reset();
  const newDetail = await res.json();
  document.getElementById(`toggle-btn-${id}`).innerText = newDetail.content;
  toggleUpdate(id);
}

const toggleUpdate = (id) => {
    document.getElementById(`edit-form-${id}`).classList.toggle("hide");
   }

const deleteRecipe = async (id) => {
  const res = await fetch(`${baseURL}/recipes`, {
    method: "DELETE", 
    body: JSON.stringify({id}), 
    headers: {'Content-Type': 'application/json'}
  })
  const newList = await res.json();
  const listElement = document.getElementById("recipe-list-id");
    listElement.innerHTML = "";
  newList.map(item => {
    recipeAddtion(item);
  })
}

const toggleDisplay = (id) => {
      document.getElementById(`toggle-btn-${id}`).classList.toggle("hide");
   }

const getAllRecipes = () => {
  fetch(`${baseURL}/recipes`)
  .then((res) => 
    res.json()
  )
  .then ((res) => {
    const listElement = document.getElementById("recipe-list-id");
    listElement.innerHTML = "";
    for (const item of res) {
     recipeAddtion(item);
    }
  });
}

// call this function to display all recipes in database at initialization
getAllRecipes();