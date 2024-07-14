let user = document.getElementById("name");
let mail = document.getElementById("mail");
let phone = document.getElementById("phone");
let age = document.getElementById("age");
let password = document.getElementById("password");
let repassword = document.getElementById("repassword");
let submitButton = document.getElementById("submitButton");
let phoneAlert = document.getElementById("phoneAlert");
let ageAlert = document.getElementById("ageAlert");
let passwordAlert = document.getElementById("passwordAlert");
let repasswordAlert = document.getElementById("repasswordAlert");
let mailAlert = document.getElementById("mailAlert");

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

function validateUser() {
  user.classList.remove("is-valid", "is-invalid");

  if (user.value.trim() !== "") {
    user.classList.add("is-valid");
  } else {
    user.classList.add("is-invalid");
  }
}


user.addEventListener("input", validateUser);
validateUser();


let validations = {
  user: {
    regex: /.+/,
    element: user,
  },
  mail: {
    regex: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    element: mail,
    alertElement: mailAlert,
  },
  phone: {
    regex: /^(?:\+?(20)?2)?(010|011|012|015)\s?\d{8}$/,
    element: phone,
    alertElement: phoneAlert,
  },
  age: {
    regex: /^(?:[1-9]|[1-9]\d|99)$/,
    element: age,
    alertElement: ageAlert,
  },
  password: {
    regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    element: password,
    alertElement: passwordAlert,
  },
};


Object.keys(validations).forEach((field) => {
  if (validations[field].alertElement) {
    validations[field].alertElement.classList.add("d-none");
  }
});


Object.keys(validations).forEach((field) => {
  validations[field].element.addEventListener("input", function () {
    validateField(field);
    activeSubmit();
  });
});

function validateField(field) {
  let isValid = validations[field].regex.test(validations[field].element.value);
  validations[field].element.classList.remove("is-valid", "is-invalid");

  if (isValid) {
    validations[field].element.classList.add("is-valid");
    if (validations[field].alertElement) {
      validations[field].alertElement.classList.replace("d-block", "d-none");
    }
  } else {
    validations[field].element.classList.add("is-invalid");
    if (validations[field].alertElement) {
      validations[field].alertElement.classList.replace("d-none", "d-block");
    }
  }
}


function validRepassword() {
  repassword.classList.remove("is-valid", "is-invalid");

  if (repassword.value === password.value) {
    repassword.classList.add("is-valid");
    repasswordAlert.classList.replace("d-block", "d-none");
    return true;
  } else {
    repassword.classList.add("is-invalid");
    repasswordAlert.classList.replace("d-none", "d-block");
    return false;
  }
}

$("#repassword").on("input", function () {
  activeSubmit();
});
function activeSubmit() {
  let allValid = true;
  Object.keys(validations).forEach((field) => {
    if (!validations[field].element.classList.contains("is-valid")) {
      allValid = false;
    }
  });

  if (allValid && validRepassword()) {
    if (repasswordAlert) {
      repasswordAlert.classList.replace("d-block", "d-none");
    }
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
}

activeSubmit();
