let mealNameInput = document.getElementById("mealName");
let mealLetterInput = document.getElementById("mealLetter");
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
    return data;
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
}

function displayMealDetails(details) {
  let ingredientsHTML = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = details[0][`strIngredient${i}`];
    let measure = details[0][`strMeasure${i}`];

    if (ingredient && ingredient.trim() !== "") {
      ingredientsHTML += `
        <div>
          <p class="px-2 py-1  m-1 rounded-3 recipe">${measure} ${ingredient}</p>
        </div>
      `;
    }
  }

  let tagsHTML = "";
  if (details[0].strTags) {
    let tagsArray = details[0].strTags.split(",");
    tagsHTML = tagsArray
      .map(
        (tag) => `<p class="px-2 py-1  m-1 rounded-3 tags">${tag.trim()}</p>`
      )
      .join("");
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
      <p>${details[0].strInstructions}</p>
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

function handleMealClick(mealId) {
  fetchDetails(mealId);
}

mealNameInput.addEventListener("input", function () {
  let nameSearch = mealNameInput.value.trim();
  if (nameSearch === "") {
    row.innerHTML = "";
  } else {
    getMealName(nameSearch);
  }
});

mealLetterInput.addEventListener("input", function () {
  let letter = mealLetterInput.value.trim();
  if (letter === "") {
    row.innerHTML = "";
  } else {
    getMealLetter(letter);
  }
});

async function getMealName(nameSearch) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${nameSearch}`
    );
    let data = await res.json();
    let meals = data.meals;
    displayMealNames(meals);
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
}

async function getMealLetter(letter) {
  try {
    let res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
    );
    let data = await res.json();
    let mealLetter = data.meals;
    displayMealLetter(mealLetter);
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
}

function displayMealNames(meals) {
  if (!meals) {
    row.innerHTML = "<p>No meals found</p>";
    return;
  }

  let box = "";
  meals.forEach((meal) => {
    box += `
      <div class="col-lg-3 col-md-6 my-3">
        <div class="card-container">    
          <div class="inner position-relative rounded-3 overflow-hidden" onclick="handleMealClick('${meal.idMeal}')">
            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div id='mealname'>${meal.strMeal}</div>
          </div>
        </div>
      </div>
    `;
  });

  row.innerHTML = box;
}

function displayMealLetter(mealLetter) {
  if (!mealLetter) {
    row.innerHTML = "<p>No meals found</p>";
    return;
  }

  let box = "";
  mealLetter.forEach((meal) => {
    box += `
      <div class="col-lg-3 col-md-6 my-3">
        <div class="card-container">
          <div class="inner position-relative rounded-3 overflow-hidden" onclick="handleMealClick('${meal.idMeal}')">
            <img class="w-100" src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div id='mealname'>${meal.strMeal}</div>
          </div>
        </div>
      </div>
    `;
  });

  row.innerHTML = box;
}
