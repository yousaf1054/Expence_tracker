let confirme = document.getElementById("edit-btn2");
let nameElement = document.getElementById("nameElement");
let country = document.getElementById("country");
let account_number = document.getElementById("account-number");
let account_type = document.getElementById("account-type");
let toastEl = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");

async function load(params) {
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
      .select("name,account_type,account_number,country")
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
    nameElement.value = userData.name;
    country.value = userData.country;
    account_number.value = userData.account_number;
    account_type.value = userData.account_type;
  } catch (error) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = error.message;
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
  }
}
load();
confirme.addEventListener("click", conformationEdit);
async function conformationEdit(e) {
  e.preventDefault();
  if (
    !nameElement.value ||
    !country.value ||
    !account_number.value ||
    !account_type.value
  ) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = "Fill all details to update";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
  if (!nameElement.value) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = "Enter your name";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
  if (!account_type.value) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = "Select the account type";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
  if (!country.value) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = "Select your country";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
  if (!account_number.value) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = "enter the account number";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
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
    const { error: updateError } = await supabaseClient
      .from("users")
      .update({
        name: nameElement.value,
        country: country.value,
        account_type: account_type.value,
        account_number: account_number.value,
      })
      .eq("auth_id", data.user.id);
    if (updateError) {
      toastEl.style.borderLeft = "4px solid red";
      toastEl.style.color = "red";
      toastEl.style.background = "white";
      toastMessage.textContent = updateError.message;
      let t1 = new bootstrap.Toast(toastEl);
      t1.show();
      return;
    }
    toastEl.style.borderLeft = "4px solid green";
    toastEl.style.color = "green";
    toastEl.style.background = "white";
    toastMessage.textContent = "successfully update profile";
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1500);

  } catch (error) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
    toastMessage.textContent = error.message;
    let t1 = new bootstrap.Toast(toastEl);
    t1.show();
    return;
  }
}
