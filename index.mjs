const SEARCH_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const RANDOM_API_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchBox");
const resultsGrid = document.getElementById("resultsGrid");
const infoArea = document.getElementById("information");
const randomButton = document.getElementById("randomBtn");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm) {
    searchRecipes(searchTerm);
  } else {
    showMessage("Please enter a search term", true);
  }
});

async function searchRecipes(query) {
  showMessage(`Searching for "${query}"...`, false, true);
  resultsGrid.innerHTML = "";

  try {
    const response = await fetch(`${SEARCH_API_URL}${query}`);
    if (!response.ok) throw new Error("Network error");

    const data = await response.json();
    clearMessage();
    console.log("data: ", data);

    if (data.meals) {
      displayRecipes(data.meals);
    } else {
      showMessage(`No recipes found for "${query}",`);
    }
  } catch (error) {
    showMessage("Something went wrong, Please try again.", true);
  }
}
