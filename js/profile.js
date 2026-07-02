async function loaduserdetails() {
  
  //fetching the elements from the profile.html

  let Name = document.getElementById("name");
  let email = document.getElementById("email");
  let country = document.getElementById("country");
  let balance = document.getElementById("balance");
  let account_number = document.getElementById("account-number");
  let account_type = document.getElementById("account-type");
  let toastEl = document.getElementById("loginToast");
  let toastMessage = document.getElementById("toastMessage");
  
  //check user login or not

  const { data, error } = await supabaseClient.auth.getUser();
  console.log(data)
  console.log(error)
}
loaduserdetails();
