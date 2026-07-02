function getToastElements() {
  const toastEl = document.getElementById("loginToast");
  const toastMessage = document.getElementById("toastMessage");

  if (!toastEl || !toastMessage) {
    console.error(
      "Logout toast elements not found. Ensure toast HTML is present or loaded before logout."
    );
  }

  return { toastEl, toastMessage };
}

function initLogout() {
  const logoutConfirm = document.getElementById("confirm");

  if (!logoutConfirm) {
    console.error("Logout button not found");
    return;
  }

  logoutConfirm.addEventListener("click", logoutUser);
}

async function logoutUser() {
  const { toastEl, toastMessage } = getToastElements();
  if (!toastEl || !toastMessage) return;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.background = "white";
    toastEl.style.color = "red";
    toastMessage.textContent = error.message;

    const status = new bootstrap.Toast(toastEl);
    status.show();
    return;
  }

  toastEl.style.borderLeft = "4px solid green";
  toastEl.style.background = "white";
  toastEl.style.color = "green";
  toastMessage.textContent = "Logout successful";

  const status = new bootstrap.Toast(toastEl);
  status.show();

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}
