let logout = document.getElementById("logout-modal");

async function loadmodal() {
  try {
    let response = await fetch("componets/load-modal.html");
    if (!response.ok) {
      throw new Error("can't load the modal");
    }
    let data = await response.text();
    logout.innerHTML = data;
    initLogout();
  } catch (error) {
    console.log(error);
  }
}
loadmodal();
