//endpoint for search by ingredient name
const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
//endpoint for random recipe
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchBox");
const resultsGrid = document.getElementById("resultGrid");
const infoArea = document.getElementById("information");
const randomButton = document.getElementById("randomBtn");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  console.log(`search value = ${searchTerm}`)

  if (searchTerm) {
    searchRecipes(searchTerm);
  } else {
    showMessage("Please enter a search term", true);
  }
});

async function searchRecipes(query) {
  //Calling the function showMessage which takes 3 arguments
  showMessage(`Searching for "${query}"...`, false, true);
  //clearing the result from previous search 
  resultsGrid.innerHTML = "";
  try {
    //getting the value for URL from assigned variable
    //url end's with = and after that adding the user entered value
    // (value from parameter)

    const response = await fetch(`${SEARCH_API_URL}${query}`)
    //if fetch request was not not succesfull throw new error.
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    clearMessage();
    console.log("data: ", data);

    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      showMessage(`No recipes found for "${query}"`)
    }

  } catch (error) {
    showMessage("Something went wrong, Please try again.", true);
  }

}

function showMessage(msg, isError = false, isLoading = false) {
  infoArea.textContent = msg;
  if (isError) infoArea.classList.add("error");
  if (isLoading) infoArea.classList.add("loading");
}

//this function is used to clear the messages
function clearMessage() {
  infoArea.textContent = "";
  infoArea.className = "message";
}

function displayRecipes(recipes) {
  //response data is the value for the parameter (recipes)
  //check if there is recipe available
  if (!recipes || recipes.length === 0) {
    showMessage("No recipes to display");
    return;
  }

  //if there is recipe then list all of them in seperate container(div)
  recipes.forEach(item => {
    const recipeDiv = document.createElement("div");
    recipeDiv.classList.add("recipeItem");
    // * loading as lazy, will load the img in lazy way
    // * strMeal is the key which holds value for recipe title
    // * To newly created div - adding all the
    //   data required from response.data()
    recipeDiv.innerHTML = `
    <img src = "${item.strMealThumb}" alt="${item.strMeal}" loading="lazy">
    <h3>${item.strMeal}</h3>`;
    // * append the new div to 
    // the result grid(area created to display search result)
    resultsGrid.appendChild(recipeDiv);
  });
}

randomButton.addEventListener("click", getRandomRecipe);


async function getRandomRecipe() {
  showMessage("Getting random recipe...", false, true);

  //Clear the result generated (from previous click)
  resultsGrid.innerHTML = "";
  try {
    const response = await fetch(RANDOM_API_URL);
    //Check the status of response(value is ok) in response data(Json)
    if (!response.ok) throw new Error("Something went wrong");
    const data = await response.json();
    console.log("data: ", data);
    clearMessage();
    //Check if there is any result retrieved for user input and also result is not 
    if(data.meals && data.meals.length > 0){
      displayRecipes(data.meals);
    }
  } catch(error) {
    showMessage("Failed to generate random recipe", true);
  }

}