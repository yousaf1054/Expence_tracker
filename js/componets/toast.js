let toast1 = document.getElementById("toast");

async function loadtoast() {
  try {
    let response = await fetch("componets/toast.html");
    if (!response.ok) {
      throw new Error("can't load the modal");
    }
    let data = await response.text();
    toast1.innerHTML = data;
  } catch (error) {
    console.log(error);
  }
}
loadtoast();
