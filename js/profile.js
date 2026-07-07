let nameElement = document.getElementById("name");
let email = document.getElementById("email");
let country = document.getElementById("country");
let balance = document.getElementById("balance");
let account_number = document.getElementById("account-number");
let account_type = document.getElementById("account-type");
let toastEl = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");
let edit = document.getElementById("edit-btn");

async function loadUserDetails() {
  //check user login or not
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      toastEl.style.borderLeft = "4px solid red";
      toastEl.style.color = "red";
      toastEl.style.background = "white";
      toastMessage.textContent = error.message;
      let t1 = new bootstrap.Toast(toastEl);
      t1.show();
      return;
    }

    const { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id)
      .single();

    if (userError) {
      toastEl.style.borderLeft = "4px solid red";
      toastEl.style.color = "red";
      toastEl.style.background = "white";
      toastMessage.textContent = userError.message;
      let t1 = new bootstrap.Toast(toastEl);
      t1.show();
      return;
    }

    nameElement.textContent = userData.name;
    email.textContent = userData.email;
    country.textContent = userData.country;
    account_type.textContent = userData.account_type;
    account_number.textContent = userData.account_number;
    balance.textContent = userData.opening_balance;
  } catch (error) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = error.message;
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
  }
}
loadUserDetails();

//edit
edit.addEventListener("click", editProfile);

function editProfile() {
  window.location.href = "edit_profil.html";
}
