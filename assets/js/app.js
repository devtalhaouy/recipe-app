//declaration

const meals = _('meals');
const favoriteContainer = _('fav-meals');
const searchMeal = _('search-meal');
const searchBtn = _('search');

// Function
async function  getRandomMeal() {
   const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
   const data = await response.json();
   const randMeal = data.meals[0];
//    console.log(randMeal);
   addMeal(randMeal,true);

}
// getMeal by Id
async function getMealById(id) {
    const response = fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);
    const data = await (await response).json();
    const mymeal = data.meals[0];
    return mymeal;
}
// get MealBy Id
async function getMealsBySearch(name) {
    const response = fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+name);
    const data = await (await response).json();
    const meals = data.meals;
    // console.log(meals);
    return meals;
}

function _(id){
    return document.getElementById(id);
}

function addMeal(data,random = true){
    const meal = document.createElement('div');
    meal.classList.add('meal');
    meal.innerHTML = `
        <div class="meal-header">
           ${random ? ` <div class="random">
              Random Recipe
            </div>`:''}
          <img src="${data.strMealThumb}" alt="${data.strMeal}">
        </div>
        <div class="meal-body">
          <h4>${data.strMeal}</h4>
          <button class="fav-btn">
            <i class="fa fa-heart" aria-hidden="true"></i>

          </button>
        </div>
    `;
    const btn =  meal.querySelector('.meal-body .fav-btn');
   
    btn.addEventListener("click",()=>{
        if(btn.classList.contains("active")){
            removeMealFromLs(data.idMeal);
             btn.classList.remove("active");
        }else{
            addMealToSt(data.idMeal);
             btn.classList.add("active");

            
        }
        fetchFavMeals();
      
    });
    
    meals.appendChild(meal);
}
function addMealToSt(mealId){
     const mealIds = getMealFromSt();
     localStorage.setItem('mealIds',JSON.stringify([...mealIds,mealId]));
}
function removeMealFromLs(mealId){
      const mealIds = getMealFromSt();
       localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id => id !== mealId)));
}
function getMealFromSt() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));
    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    //clean container
      favoriteContainer.innerHTML = "";
    const mealIds = getMealFromSt();
    for(let i=0;i<mealIds.length;i++){
        const mealId = mealIds[i];
         meal = await getMealById(mealId);
        addMealToFav(meal);
    }
}
function addMealToFav(data){
  
     const favMeal = document.createElement('li');
    favMeal.innerHTML = `
        <img src="${data.strMealThumb}" alt="${data.strMeal}">
         <span>${data.strMeal}</span>
         <button class="clear">
         <i class="fas fa-window-close"></i>
         </button>
    `;
    const btn = favMeal.querySelector('.clear');
    btn.addEventListener("click",()=>{
        removeMealFromLs(data.idMeal);
        fetchFavMeals();
    });
    favoriteContainer.appendChild(favMeal);
}
searchBtn.addEventListener('click', async ()=>{
    const search = searchMeal.value;
   const meals = await getMealsBySearch(search);
    if(meals){
         meals.forEach(meal =>{
            addMeal(meal);
        });
    }
});







// run function
getRandomMeal();
fetchFavMeals();