$(document).ready(function () {

// DOM PARAMS
const mealResults = document.getElementById('meal-results');
const mealDetails = document.querySelector('.meal-details-content');
const clRecBtn = document.getElementById('close-recipe');


// EVENT LISTENERS
mealResults.addEventListener('click', getMealRecipe);
clRecBtn.addEventListener('click', () => {
    mealDetails.parentElement.classList.remove('showRecipe');
});


// INGREDIENT SEARCH BAR
$("#ingr-search").on("click", function() {
    var searchInputTxt = $("#search-input").val();
    $("#search-input").val("");
    getMealList(searchInputTxt);
});

// CREATE NEW ROW
var history = JSON.parse(localStorage.getItem("history")) || [];

function newRow(text) {
var list = $("<li>").addClass("list-group-item ml-3").text(text);
    $(".history").append(list);
}

// persist through refresh
if (history.length > 0) {
    getMealList(history[history.length - 1]);
}
 
// add new row list item if not already parsed
for (var i = 0; i < history.length; i++) {
    newRow(history[i]);
}
 
// jQuery event listener to create new Row List Item
$(".history").on("click", "li", function() {
    getMealList($(this).text());
});

// FUNCTION to fetch recipes that contain user defined ingredients
function getMealList(searchInputTxt){
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // SAVED SEARCH HISTORY
        if (history.indexOf(searchInputTxt) === -1) {
            history.push(searchInputTxt);
            localStorage.setItem("history", JSON.stringify(history));
            newRow(searchInputTxt);
        } 

        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div data-id="${meal.idMeal}" class="justify-content-center">
                        <div>
                            <img src="${meal.strMealThumb}" class="rounded mx-auto d-block" alt="picture of food">
                        </div>
                        <div class="form-inline justify-content-center">
                            <a href="#" class="recipe-button">${meal.strMeal}</a>
                        </div>
                    </div>
                    <br>
                `;
            });
            mealResults.classList.remove("noMeal");
        } else {
            html="No meal found :( <br> Please try again.";
            mealResults.classList.add("noMeal");
        }
        mealResults.innerHTML = html;
    })
}

// fetch recipe details
function getMealRecipe(i){
    i.preventDefault();
    if(i.target.classList.contains("recipe-button")){
        let mealItem = i.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

// MODAL JS
function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class="text-center">${meal.strMeal}</h2>

        <div class="container mt-5">
        <div class="row">
        <div class="col-md-3">
            <h3>Ingredients Required:</h3>
            <ul>
                <li>${meal.strIngredient1 + "   " + meal.strMeasure1}</li>
                <li>${meal.strIngredient2 + "   " + meal.strMeasure2}</li>
                <li>${meal.strIngredient3 + "   " + meal.strMeasure3}</li>
                <li>${meal.strIngredient4 + "   " + meal.strMeasure4}</li>
                <li>${meal.strIngredient5 + "   " + meal.strMeasure5}</li>
                <li>${meal.strIngredient6 + "   " + meal.strMeasure6}</li>
                <li>${meal.strIngredient7 + "   " + meal.strMeasure7}</li>
                <li>${meal.strIngredient8 + "   " + meal.strMeasure8}</li>
                <li>${meal.strIngredient9 + "   " + meal.strMeasure9}</li>
                <li>${meal.strIngredient10 + "   " + meal.strMeasure10}</li>
                <li>${meal.strIngredient11 + "   " + meal.strMeasure11}</li>
                <li>${meal.strIngredient12 + "   " + meal.strMeasure12}</li>
                <li>${meal.strIngredient13 + "   " + meal.strMeasure13}</li>
                <li>${meal.strIngredient14 + "   " + meal.strMeasure14}</li>
                <li>${meal.strIngredient15 + "   " + meal.strMeasure15}</li>
                <li>${meal.strIngredient16 + "   " + meal.strMeasure16}</li>
                <li>${meal.strIngredient17 + "   " + meal.strMeasure17}</li>
                <li>${meal.strIngredient18 + "   " + meal.strMeasure18}</li>
                <li>${meal.strIngredient19 + "   " + meal.strMeasure19}</li>
                <li>${meal.strIngredient20 + "   " + meal.strMeasure20}</li>
            </ul>
        </div>

        <div class="col-md-7">
            <!-- <div>
                <img src="${meal.strMealThumb}">
            </div> -->
            <h3 class="mt-3">Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        </div>
        </div>
        `;

    mealDetails.innerHTML = html;
    mealDetails.parentElement.classList.add("showRecipe");
}
})

//////////////////////////////////////////////

// DOM PARAMS & EVENT LISTENER FOR NUTRITIONIX
const nutritionSearchButton = document.getElementById('search-nutrition-button');
const nutriResults = document.getElementById('nutrition-info');
nutritionSearchButton.addEventListener('click', getNutritionList);

// fetch nutrition of searched ingredient
function getNutritionList(e){
    e.preventDefault();
    let searchInputText = document.getElementById('search-nutrition').value.trim();
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Host': 'nutritionix-api.p.rapidapi.com',
			'X-RapidAPI-Key': 'aca63d80bemsha49be9e7cbaf574p19b807jsnf26167055f5a'
		}
	};
	
	fetch(`https://nutritionix-api.p.rapidapi.com/v1_1/search/${searchInputText}?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat`, options)
		.then(response => response.json())
   		.then(data => {
		console.log(data);
        let html = "";
        if(data.hits){
            data.hits.forEach(item => {
                html += `

                    <div class="col-auto"
                    <div data-id="${item.fields.item_id}">
                        <div class="justify-content-center">
                            <span class="ingredient-button">${item.fields.item_name} <br> <b>Calories: ${item.fields.nf_calories}</b> </span>
                        </div>
                    </div>
                `;
            });
            nutriResults.classList.remove('noNutr');
        } else {
            html="No nutritional info found :( <br> Please try again.";
            nutriResults.classList.add('noNutr');
        }
        nutriResults.innerHTML = html;
    });
}