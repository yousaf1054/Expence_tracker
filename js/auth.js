// selecting the elements for login and sign up

let signup = document.getElementById("create-acc");
let login = document.getElementById("login");

//creating account function
if (signup) {
  signup.addEventListener("click", adduser);
}
if (login) {
  login.addEventListener("click", enter);
}

//adduser

function adduser() {
  let firstname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById("confirm_password").value;
  let account_type = document.getElementById("account-type").value;
  let account_number = document.getElementById("account-number").value;
  let balance = document.getElementById("account-balance").value;
  let toastEl = document.getElementById('loginToast');
  let toastMessage = document.getElementById('toastMessage');
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = {
    firstname: firstname,
    email: email,
    password: password,
    account_type: account_type,
    account_number: account_number,
    balance: balance,
  };
  if (email.trim() === "" || password.trim() === "") {
    toastEl.style.borderLeft = "4px solid #ff0000";
    toastEl.style.backgroundColor = "transparent";
    toastMessage.textContent = "invalid credential";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
    return;
  }
  if (confirm_password !== password) {
    toastEl.style.borderLeft = "4px solid #ff0000";
    toastEl.style.backgroundColor = "transparent";
    toastMessage.textContent = "confirm password does not match";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
    return;
  }
  if (users.find((el) => el.email === email)) {
    toastEl.style.borderLeft = "4px solid #ff0000";
    toastEl.style.backgroundColor = "transparent";
    toastMessage.textContent = "email already exists";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
    return;
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  toastEl.style.borderLeft = "4px solid #11923e";
  toastEl.style.backgroundColor = "transparent";
  toastMessage.textContent = "User created successfully!";
  let toast = new bootstrap.Toast(toastEl);
  toast.show();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}
//login

function enter() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users")) || [];

  let user = users.find((el) => el.email === email && el.password === password);

  let toastEl = document.getElementById('loginToast');
  let toastMessage = document.getElementById('toastMessage');

  if (user) {
    toastEl.style.borderLeft = "4px solid #11923e";
    toastEl.style.backgroundColor = "transparent";
    toastMessage.textContent = "Login successful!";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();

    // Redirect to dashboard/expense view page after a short delay
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);
  } else {
    toastEl.style.borderLeft = "4px solid #ff0000";
    toastEl.style.backgroundColor = "transparent";
    toastMessage.textContent = "invalid credential";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}
