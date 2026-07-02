let form = document.getElementById("signup-form");

// create eventlistener for the subimt button for the create account button
form.addEventListener("submit", adduser);

let loginToast = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");
//add user function for creating new user

async function adduser(e) {
  e.preventDefault();
  //fetching values from the form

  let fullname = document.getElementById("fullname").value;
  let email = document.getElementById("email").value;
  let opening_balance = document.getElementById("account-balance").value;
  let password = document.getElementById("password").value;
  let conform = document.getElementById("confirm_password").value;
  let country = document.getElementById("country").value;
  let account_number = document.getElementById("account-number").value;
  let account_type = document.getElementById("account-type").value;

  //form validation

  if (
    !fullname &&
    !email &&
    !opening_balance &&
    !password &&
    !conform &&
    !account_number &&
    !account_type &&
    !country
  ) {
    showtoastError("Please enter your details");
    return;
  } else if (!fullname) {
    showtoastError("Please enter your name !");
    return;
  } else if (!email) {
    showtoastError("Please enter your email !");
    return;
  } else if (!password) {
    showtoastError("Please enter your password !");
    return;
  } else if (!conform) {
    showtoastError("Please enter password again for conform");
    return;
  } else if (!(password === conform)) {
    showtoastError("The password not match !");
    return;
  } else if (!account_type) {
    showtoastError("Please select your account type !");
    return;
  } else if (!country) {
    showtoastError("Please select you country !");
    return;
  } else if (!account_number) {
    showtoastError("Please enter your account number !");
    return;
  } else if (!opening_balance) {
    showtoastError("Please enter your bank balance !");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    showtoastError(error.message);
    return;
  }

  //insert the user data into the database
  const { data: userData, error: insertError } = await supabaseClient
    .from("users")
    .insert([
      {
        auth_id: data.user.id,
        name: fullname,
        email: email,
        opening_balance: Number(opening_balance),
        account_number: account_number,
        account_type: account_type,
        country: country,
      },
    ]);

  if (insertError) {
    console.log(insertError);
    showtoastError(insertError.message);
    return;
  }
  //callinin the function for success toast message
  showtoastSuccess("Account created successfully!");

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1000);
}

// function for the toast

function showtoastError(message) {
  loginToast.style.borderLeft = "4px solid red";
  loginToast.style.background = "white";
  loginToast.style.color = "red";
  toastMessage.textContent = message;
  let toast = new bootstrap.Toast(loginToast);
  toast.show();
}
function showtoastSuccess(message) {
  loginToast.style.borderLeft = "4px solid green";
  loginToast.style.background = "white";
  loginToast.style.color = "green";
  toastMessage.textContent = message;
  let toast = new bootstrap.Toast(loginToast);
  toast.show();
}
