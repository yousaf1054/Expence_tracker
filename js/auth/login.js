// fetching elements from the html

let form = document.getElementById("login-form");
let loginToast = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");

// event listener

form.addEventListener("submit", loginUser);

// function for login

async function loginUser(e) {
  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  //validation

  if (!email && !password) {
    showToastError("Please enter your email and password !");
    return;
  } else if (!email) {
    showToastError("Please enter your email !");
    return;
  } else if (!password) {
    showToastError("Please enter your password !");
    return;
  }

  // supabse section

  let { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    showToastError(error.message);
    return;
  }
  showToastSuccess("login successfuly");

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1000);
}

//toast for error

function showToastError(msg) {
  loginToast.style.borderLeft = "4px solid red";
  loginToast.style.background = "white";
  loginToast.style.color = "red";
  toastMessage.textContent = msg;
  let toast = new bootstrap.Toast(loginToast);
  toast.show();
}

// toast for success

function showToastSuccess(msg) {
  loginToast.style.borderLeft = "4px solid green";
  loginToast.style.background = "white";
  loginToast.style.color = "green";
  toastMessage.textContent = msg;
  let toast = new bootstrap.Toast(loginToast);
  toast.show();
}
