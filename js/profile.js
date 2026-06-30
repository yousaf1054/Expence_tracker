function loaduserdetails() {
  let Name = document.getElementById("name");
  let email = document.getElementById("email");
  let country = document.getElementById("country");
  let balance = document.getElementById("balance");
  let account_number = document.getElementById("account-number");
  let account_type = document.getElementById("account-type");
  let toastEl = document.getElementById("loginToast");
  let toastMessage = document.getElementById("toastMessage");

  let currentuser = JSON.parse(localStorage.getItem("currentuser"));
  if (currentuser) {
    toastEl.style.borderLeft = "4px solid #11923e";
    toastEl.style.backgroundColor = "white";
    toastMessage.textContent = "Here is your profile";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
  } else {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.backgroundColor = "white";
    toastMessage.textContent = "Something went wrong";
    let toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
  Name.textContent = currentuser.firstname;
  email.textContent = currentuser.email;
  country.textContent = currentuser.country;
  account_number.textContent = currentuser.account_number;
  account_type.textContent = currentuser.account_type;
  balance.textContent = currentuser.balance;
}
loaduserdetails();
