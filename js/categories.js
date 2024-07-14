let row = document.getElementById("row");

// navbar start
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

//navbar end
async function getCategories() {
  try {
    let res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let categories = data.categories;
    displayCategory(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}
getCategories();

function displayCategory(categories) {
  let box = "";
  categories.forEach((category) => {
    let mainCategory = category.strCategory;
    let description =
      category.strCategoryDescription.length > 120
        ? category.strCategoryDescription.substring(0, 135)
        : category.strCategoryDescription;

    box += `
          <div class="col-lg-3 col-md-6 my-2">
              <div class="card-container position-relative overflow-hidden p-3">
                  <img class="w-100" src="${category.strCategoryThumb}" alt="">
                  <div class="overlay rounded-3 text-center" onclick="handleCategoryClick('${mainCategory}')">
                      <h3>${mainCategory}</h3>
                      <p>${description}</p>
                  </div>
              </div>
          </div>
      `;
  });
  row.innerHTML = box;
}

async function filterCategory(mainCategory) {
  try {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${mainCategory}`);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let meals = data.meals;
    return meals;
  } catch (error) {
    console.error("Error fetching meals:", error);
    return null;
  }
}

async function handleCategoryClick(mainCategory) {
  try {
    let meals = await filterCategory(mainCategory);
    displayMeals(meals);
  } catch (error) {
    console.error("Error handling category click:", error);
  }
}

async function getMeals() {
  try {
    let res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    let data = await res.json();
    let meals = data.meals;

    displayMeals(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
}

function displayMeals(meals) {
  let box = "";

  if (!meals) {
    box = "<p>No meals found</p>";
  } else {
    meals.forEach(meal => {
      let mealId = meal.idMeal;
      box += `
        <div class="col-lg-3 col-md-6 my-3">
          <div class="card-container">
            <div id="inner${mealId}" class="inner position-relative rounded-3 overflow-hidden" onclick="handleMealClick('${mealId}')">
              <img class="w-100" src="${meal.strMealThumb}" alt="">
              <div id="mealname">${meal.strMeal}</div>
            </div>
          </div>
        </div>
      `;
    });
  }

  row.innerHTML = box;
}

function handleMealClick(mealId) {
  console.log("Clicked meal ID:", mealId);
  fetchDetails(mealId);
}

async function fetchDetails(mealId) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    let data = await res.json();
    let details = data.meals;
    displayMealDetails(details);
  } catch (error) {
    console.error("Error fetching meal details:", error);
  }
}

function displayMealDetails(details) {
  let ingredientsHTML = '';

  for (let i = 1; i <= 20; i++) {
    let ingredient = details[0][`strIngredient${i}`];
    let measure = details[0][`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== '') {
      ingredientsHTML += `
        <div>
          <p class="px-2 py-1 m-1 rounded-3 recipe">${measure} ${ingredient}</p>
        </div>
      `;
    }
  }

  let tagsHTML = '';
  if (details[0].strTags) {
    let tagsArray = details[0].strTags.split(',');
    tagsHTML = tagsArray.map(tag => `<p class="px-2 py-1 m-1 rounded-3 tags">${tag.trim()}</p>`).join('');
  }

  let detailsBox = `
    <div class="col-lg-4">
      <div class="inner p-5">
        <div class="rounded-3 overflow-hidden">
          <img class="w-100" src="${details[0].strMealThumb}" alt="${details[0].strMeal}">
          <h2 class="text-white py-2">${details[0].strMeal}</h2>
        </div>
      </div>
    </div>
    <div class="col-lg-8">
      <h2 class="text-white">Instructions</h2>
      <p class="text-white">${details[0].strInstructions}</p>
      <h3 class="text-white">Area : ${details[0].strArea}</h3>
      <h3 class="text-white">Category : ${details[0].strCategory}</h3>
      <h3 class="text-white">Recipes :</h3>
      <div class="d-flex flex-wrap">
        ${ingredientsHTML}
      </div>
      <h3 class="text-white">Tags :</h3>
      <div class="d-flex flex-wrap">
        ${tagsHTML}
      </div>
      <div class="my-2">
        <a href="${details[0].strSource}" class="m-1 btn btn-success" target="_blank">Source</a>
        <a href="${details[0].strYoutube}" class="m-1 btn btn-danger" target="_blank">Youtube</a>
      </div>
    </div>
  `;

  row.innerHTML = detailsBox;
}
