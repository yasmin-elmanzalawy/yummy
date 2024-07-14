$(document).ready(function () {
  let isOpen = false;
  let navWidth;

  let width = $("#inner-nav").outerWidth(true);
  let outer = $("#outer-nav").outerWidth(true);
  navWidth = width - outer;

  $("#nav").css({ left: -navWidth });

  $("#open").on("click", function () {
    if (!isOpen) {
      openNav();
    }
  });

  $("#close").on("click", function () {
    if (isOpen) {
      closeNav();
    }
  });

  function openNav() {
    $("#nav").animate({ left: "0px" }, 500);
    $("#open").addClass("d-none");
    $("#close").removeClass("d-none");

    $(
      ".anchorList1, .anchorList2, .anchorList3, .anchorList4, .anchorList5"
    ).css({ transform: "translateY(0px)", "transition-delay": "0.1s" });

    isOpen = true;
  }

  function closeNav() {
    $("#nav").animate({ left: -navWidth }, 500);
    $("#close").addClass("d-none");
    $("#open").removeClass("d-none");

    $(
      ".anchorList1, .anchorList2, .anchorList3, .anchorList4, .anchorList5"
    ).css({ transform: "translateY(400%)", "transition-delay": "0.1s" });

    isOpen = false;
  }

  getIngredients();

  async function getIngredients() {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
      );
      let data = await res.json();
      let meals = data.meals.slice(0, 20);

      displayIngredients(meals);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  }

  function displayIngredients(meals) {
    let box = "";
    meals.forEach((meal) => {
      let shortdesc = meal.strDescription
        ? meal.strDescription.slice(0, 110)
        : "";
      box += `
        <div class="col-lg-3 col-md-6 text-center">
          <div class="inner ingredients-card" data-area="${meal.strIngredient}">
            <div>
              <i class="fas fa-drumstick-bite"></i>
            </div>
            <h2>${meal.strIngredient}</h2>
            <p>${shortdesc}</p>
          </div>
        </div>
      `;
    });
    $("#row").html(box);
  }

  $("#row").on("click", ".ingredients-card", function () {
    let selectedIngredient = $(this).data("area");
    getMealIngredients(selectedIngredient);
  });

  async function getMealIngredients(ingredient) {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      let data = await res.json();
      let meals = data.meals;

      displayMeals(meals);
    } catch (error) {
      console.error("Error fetching meals for ingredient:", error);
    }
  }

  function displayMeals(meals) {
    let box = "";
    if (!meals) {
      box = "<p>No meals found</p>";
    } else {
      meals.forEach((meal) => {
        box += `
          <div class="col-lg-3 col-md-6 my-3">
            <div class="card-container">
              <div id="inner${meal.idMeal}" class="inner position-relative rounded-3 overflow-hidden">
                <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div id="mealname" class="meal-name">${meal.strMeal}</div>
              </div>
            </div>
          </div>
        `;
      });
    }
    $("#row").html(box);
  }

  $("#row").on("click", ".card-container", function () {
    let mealId = $(this).find(".inner").attr("id").replace("inner", "");
    fetchMealDetails(mealId);
  });

  async function fetchMealDetails(mealId) {
    try {
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
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
    let ingredientsHTML = "";
    for (let i = 1; i <= 20; i++) {
      let ingredient = meal[`strIngredient${i}`];
      let measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredientsHTML += `
          <div>
            <p class="px-2 py-1 m-1 rounded-3 recipe">${measure} ${ingredient}</p>
          </div>
        `;
      }
    }

    let tagsHTML = "";
    if (meal.strTags) {
      let tagsArray = meal.strTags.split(",");
      tagsHTML = tagsArray
        .map(
          (tag) => `<p class="px-2 py-1 m-1 rounded-3 tags">${tag.trim()}</p>`
        )
        .join("");
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

    $("#row").html(mealDetailsHTML);
  }
});
