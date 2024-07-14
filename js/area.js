let row = document.getElementById("row");
let openNav = document.getElementById("open");
let closeNav = document.getElementById("close");
let width = $("#inner-nav").outerWidth(true);
let outer = $("#outer-nav").outerWidth(true);
let navWidth = width - outer;
let isOpen = false;

$("#nav").css({ left: -navWidth });

$("#open").on("click", function () {
  if (!isOpen) {
    $("#nav").animate({ left: "0px" }, 500);
    openNav.classList.replace("d-block", "d-none");
    closeNav.classList.replace("d-none", "d-block");
    $(".anchorList1").css({ transform: "translateY(0px)" });
    $(".anchorList2").css({ transform: "translateY(0px)" });
    $(".anchorList3").css({ transform: "translateY(0px)" });
    $(".anchorList4").css({ transform: "translateY(0px)" });
    $(".anchorList5").css({ transform: "translateY(0px)" });

    $(".anchorList1").css({ "transition-delay": "0.1s" });
    $(".anchorList2").css({ "transition-delay": "0.2s" });
    $(".anchorList3").css({ "transition-delay": "0.3s" });
    $(".anchorList4").css({ "transition-delay": "0.4s" });
    $(".anchorList5").css({ "transition-delay": "0.5s" });

    isOpen = true;
  }
});

$("#close").on("click", function () {
  if (isOpen) {
    $("#nav").animate({ left: -navWidth }, 500);
    closeNav.classList.replace("d-block", "d-none");
    openNav.classList.replace("d-none", "d-block");
    $(".anchorList1").css({ transform: "translateY(400%)" });
    $(".anchorList2").css({ transform: "translateY(400%)" });
    $(".anchorList3").css({ transform: "translateY(400%)" });
    $(".anchorList4").css({ transform: "translateY(400%)" });
    $(".anchorList5").css({ transform: "translateY(400%)" });

    $(".anchorList1").css({ "transition-delay": "0.1s" });
    $(".anchorList2").css({ "transition-delay": "0.1s" });
    $(".anchorList3").css({ "transition-delay": "0.1s" });
    $(".anchorList4").css({ "transition-delay": "0.1s" });
    $(".anchorList5").css({ "transition-delay": "0.1s" });

    isOpen = false;
  }
});

async function getAreas() {
  try {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let areas = data.meals;
    displayAreas(areas);
  } catch (error) {
    console.error("Error fetching areas:", error);
  }
}

function displayAreas(areas) {
  let box = "";
  areas.forEach((area) => {
    box += `
      <div class="col-lg-3 col-md-6">
        <div class="inner m-2 text-center area-card" data-area="${area.strArea}">
          <div class="img-container">
            <i class="fas fa-home"></i>
          </div>
          <h2>${area.strArea}</h2>
        </div>
      </div>
    `;
  });
  row.innerHTML = box;

  let areaCards = document.querySelectorAll(".area-card");
  areaCards.forEach((card) => {
    card.addEventListener("click", () => {
      let selectedArea = card.dataset.area;
      console.log(selectedArea);
      getMealsByArea(selectedArea);
    });
  });
}

async function getMealsByArea(area) {
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let meals = data.meals;
    displayMeals(meals);
  } catch (error) {
    console.error(`Error fetching meals for ${area}:`, error);
  }
}

function displayMeals(meals) {
  let box = "";
  if (!meals) {
    box = "<p>No meals found</p>";
  } else {
    meals.forEach((meal) => {
      let mealId = meal.idMeal;
      box += `
        <div class="col-lg-3 col-md-6 my-3">
          <div class="card-container">
            <div id="inner${mealId}" class="inner position-relative rounded-3 overflow-hidden">
              <img class="w-100" src="${meal.strMealThumb}" alt="">
              <div id="mealname" class="meal-name">${meal.strMeal}</div>
            </div>
          </div>
        </div>
      `;
    });
  }
  row.innerHTML = box;

 
  let mealCards = document.querySelectorAll(".card-container");
  mealCards.forEach((card) => {
    card.addEventListener("click", () => {
      let mealId = card.querySelector(".inner").id.replace("inner", "");
      fetchMealDetails(mealId);
    });
  });
}

async function fetchMealDetails(mealId) {
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let mealDetails = data.meals;
    displayMealDetails(mealDetails);
  } catch (error) {
    console.error(`Error fetching meal details for ID ${mealId}:`, error);
  }
}

function displayMealDetails(mealDetails) {
  let meal = mealDetails[0];
  let ingredientsHTML = '';
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredientsHTML += `
        <div>
          <p class="px-2 py-1 m-1 rounded-3 recipe">${measure} ${ingredient}</p>
        </div>
      `;
    }
  }

  let tagsHTML = '';
  if (meal.strTags) {
    let tagsArray = meal.strTags.split(',');
    tagsHTML = tagsArray.map(tag => `<p class="px-2 py-1 m-1 rounded-3 tags">${tag.trim()}</p>`).join('');
  }

  let mealDetailsHTML = `
    <div class="col-lg-4">
      <div class="inner p-5">
        <div class="rounded-3 overflow-hidden">
          <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h2 class="text-white py-2">${meal.strMeal}</h2>
        </div>
      </div>
    </div>
    <div class="col-lg-8">
      <h2 class="text-white">Instructions</h2>
      <p class="text-white">${meal.strInstructions}</p>
      <h3 class="text-white">Area : ${meal.strArea}</h3>
      <h3 class="text-white">Category : ${meal.strCategory}</h3>
      <h3 class="text-white">Recipes :</h3>
      <div class="d-flex flex-wrap">
        ${ingredientsHTML}
      </div>
      <h3 class="text-white">Tags :</h3>
      <div class="d-flex flex-wrap">
        ${tagsHTML}
      </div>
      <div class="my-2">
        <a href="${meal.strSource}" class="m-1 btn btn-success" target="_blank">Source</a>
        <a href="${meal.strYoutube}" class="m-1 btn btn-danger" target="_blank">Youtube</a>
      </div>
    </div>
  `;

  row.innerHTML = mealDetailsHTML;
}

getAreas();

