let toastEl = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");
let total_spend = document.getElementById("spent-amount");
let current_amount = document.getElementById("current-amount");
let earnings_amount = document.getElementById("earnings-amount");
let category = document.getElementById("item-category");
const ctx = document.getElementById("weeklyChart").getContext("2d");
const ctx1 = document.getElementById("monthlyChart").getContext("2d");
const ctx2 = document.getElementById("yearlyChart").getContext("2d");
const ctx3 = document.getElementById("categoryChart").getContext("2d");
async function loadAll() {
  try {
    let { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      showToast(error.message, false);
      return;
    }

    let { data: expenseData, error: expenseError } = await supabaseClient
      .from("expenses")
      .select("*")
      .eq("auth_id", data.user.id);
    if (expenseError) {
      showToast(expenseError.message, false);
      return;
    }
    console.log(expenseData);

    let { data: userData, error: userError } = await supabaseClient
      .from("users")
      .select("*")
      .eq("auth_id", data.user.id);
    if (userError) {
      showToast(userError.message, false);
      return;
    }

    let debit = 0;
    let credit = 0;
    expenseData.forEach((el) => {
      if (el.transaction_type === "Debit") {
        debit = debit + el.amount;
      } else {
        credit = credit + el.amount;
      }
    });
    let balance = 0;
    balance = userData[0].opening_balance + (credit - debit);

    if (balance < 0) {
      balance = 0;
    }
    let html = `<h3>${debit}</h3>`;
    total_spend.innerHTML = html;
    total_spend.style = "color: #e63946; font-weight:bold;";

    html = `<h3>${balance}</h3>`;
    current_amount.innerHTML = html;
    current_amount.style.color = "#108927";

    html = `<h3>${credit}</h3>`;
    earnings_amount.innerHTML = html;
    earnings_amount.style = "color: #c98a2c; font-weight:bold;";

    let categoryTotal = {};

    expenseData.forEach((expense) => {
      if (expense.transaction_type !== "Debit") return;
      if (categoryTotal[expense.category]) {
        categoryTotal[expense.category] += expense.amount;
      } else {
        categoryTotal[expense.category] = expense.amount;
      }
    });
    let topCategory = "";
    let highestAmount = 0;

    for (let category in categoryTotal) {
      if (categoryTotal[category] > highestAmount) {
        highestAmount = categoryTotal[category];
        topCategory = category;
      }
    }
    if (topCategory === "") {
      topCategory = "Nill";
    }
    html = `<h3>${topCategory}</h3>`;
    category.innerHTML = html;
    category.style = "color:#1b2430;; font-weight:bold;";
    createWeeklyChart(expenseData);
    createMonthlyChart(expenseData);
    createYearlyChart(expenseData);
    createCategoryChart(expenseData);
    showToast("Data loaded successfully!", true);
  } catch (error) {
    showToast(error.message, false);
  }
}
loadAll();
function showToast(message, type) {
  if (type === false) {
    toastEl.style.borderLeft = "4px solid red";
    toastEl.style.color = "red";
    toastEl.style.background = "white";
  } else {
    toastEl.style.borderLeft = "4px solid green";
    toastEl.style.color = "green";
    toastEl.style.background = "white";
  }

  toastMessage.textContent = message;

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function createWeeklyChart(data) {
  if (data.length === 0) {
    let html = `
      <i class="fa-solid fa-box-open text-muted fs-1"></i>
      <h4 class="text-muted">No Records Found</h4>`;
    ctx.innerHTML = html;
    return;
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Today's date
  let today = new Date();

  // Start of this week (Sunday)
  let firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay());

  // End of this week (Saturday)
  let lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6);

  // Convert to YYYY-MM-DD
  const first = firstDay.toISOString().split("T")[0];
  const last = lastDay.toISOString().split("T")[0];

  let weeklyDataExpense = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  let weeklyDataEarn = {
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  };

  data.forEach((el) => {
    if (el.expense_date < first || el.expense_date > last) {
      return;
    }

    let dayName = days[new Date(el.expense_date).getDay()];

    if (el.transaction_type === "Debit") {
      weeklyDataExpense[dayName] += Number(el.amount);
    } else {
      weeklyDataEarn[dayName] += Number(el.amount);
    }
  });

  const labels = Object.keys(weeklyDataExpense);

  const expenseValues = Object.values(weeklyDataExpense);
  const earnValues = Object.values(weeklyDataEarn);

  new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Expense",
          data: expenseValues,
          backgroundColor: "#e63946",
          borderColor: "#e63946",
          borderRadius: 1,
        },
        {
          label: "Earnings",
          data: earnValues,
          backgroundColor: "#108927",
          borderColor: "#108927",
          borderRadius: 1,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
          position: "top",
        },

        title: {
          display: true,
          text: "Weekly Income vs Expense",
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

let monthlyChart = null;

function createMonthlyChart(data) {
  const today = new Date();

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let monthlyExpense = {};
  let monthlyEarn = {};

  // Initialize every day with 0
  for (let i = 1; i <= daysInMonth; i++) {
    monthlyExpense[i] = 0;
    monthlyEarn[i] = 0;
  }

  // Fill the data
  data.forEach((el) => {
    const date = new Date(el.expense_date);

    if (
      date.getMonth() !== currentMonth ||
      date.getFullYear() !== currentYear
    ) {
      return;
    }

    const day = date.getDate();

    if (el.transaction_type === "Debit") {
      monthlyExpense[day] += Number(el.amount);
    } else {
      monthlyEarn[day] += Number(el.amount);
    }
  });

  const labels = Object.keys(monthlyExpense);
  const expenseValues = Object.values(monthlyExpense);
  const earnValues = Object.values(monthlyEarn);

  const ctx = document.getElementById("monthlyChart").getContext("2d");

  if (monthlyChart) {
    monthlyChart.destroy();
  }

  monthlyChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Expense",
          data: expenseValues,
          backgroundColor: "#e63946",
          
        },
        {
          label: "Earnings",
          data: earnValues,
          backgroundColor: "#108927",
          
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true,
        },

        title: {
          display: true,
          text: "Monthly Income vs Expense",
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
let yearlyChart = null;

function createYearlyChart(data) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();

  let yearlyExpense = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  let yearlyIncome = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  data.forEach((el) => {
    let date = new Date(el.expense_date);

    // Only current year's data
    if (date.getFullYear() !== currentYear) return;

    let month = months[date.getMonth()];

    if (el.transaction_type === "Debit") {
      yearlyExpense[month] += el.amount;
    } else {
      yearlyIncome[month] += el.amount;
    }
  });

  const labels = Object.keys(yearlyExpense);
  const expenseValues = Object.values(yearlyExpense);
  const incomeValues = Object.values(yearlyIncome);

  const ctx = document.getElementById("yearlyChart");

  if (yearlyChart) {
    yearlyChart.destroy();
  }

  yearlyChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Expense",
          data: expenseValues,
          borderColor: "#e63946",
          backgroundColor: "#e63946",
          tension: 0.4,
          fill: false,
        },
        {
          label: "Income",
          data: incomeValues,
          borderColor: "#108927",
          backgroundColor: "#108927",
          tension: 0.4,
          fill: false,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        title: {
          display: true,
          text: "Yearly Income vs Expense",
        },

        legend: {
          position: "top",
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

let categoryChart = null;

function createCategoryChart(data) {
  let categoryTotal = {};

  data.forEach((el) => {
    // Only count expenses
    

    if (categoryTotal[el.category]) {
      categoryTotal[el.category] += el.amount;
    } else {
      categoryTotal[el.category] = el.amount;
    }
  });

  const labels = Object.keys(categoryTotal);
  const values = Object.values(categoryTotal);

  const ctx = document.getElementById("categoryChart");

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: labels,

      datasets: [
        {
          data: values,
          label: labels,

          backgroundColor: [
            "#e63946",
            "#457b9d",
            "#2a9d8f",
            "#f4a261",
            "#6a4c93",
            "#ffb703",
            "#43aa8b",
            "#f94144",
            "#577590",
            "#90be6d",
          ],

          
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        title: {
          display: true,
          text: "Expense by Category",
        },
        legend: {
          display: false,
          position: "right",
        },
      },
    },
  });
}
