let navbar = document.getElementById("navbar-container");

async function loadNavbar() {
  try {
    let response = await fetch("componets/navbar.html");

    if (!response.ok) {
      throw new Error("Failed to load navbar.");
    }

    let data = await response.text();
    navbar.innerHTML = data;

    setActivePage();
  } catch (error) {
    console.error(error);
  }
}

function setActivePage() {
  let currentPage = window.location.pathname.split("/").pop();

  if (currentPage === "home.html") {
    document.getElementById("nav-home").classList.add("active");
  } else if (currentPage === "add-expense.html") {
    document.getElementById("nav-add-expense").classList.add("active");
  } else if (currentPage === "view-expense.html") {
    document.getElementById("nav-view-expense").classList.add("active");
  } else if (currentPage === "profile.html") {
    document.getElementById("nav-profile").classList.add("active");
  }
}

loadNavbar();
