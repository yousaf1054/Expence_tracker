let add = document.getElementById("add");
let toastEl = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");
let transactionType = document.querySelector(
  'input[name="transactionType"]:checked',
)?.value;
credit.classList.remove("credit-active");
debit.classList.remove("debit-active");
function changeRadioColor() {
  // Remove previous colors
  credit.classList.remove("credit-active");
  debit.classList.remove("debit-active");

  if (credit.checked) {
    credit.classList.add("credit-active");
  }

  if (debit.checked) {
    debit.classList.add("debit-active");
  }
}

// Change color only after user clicks
credit.addEventListener("change", changeRadioColor);
debit.addEventListener("change", changeRadioColor);
add.addEventListener("submit", addExpenses);

async function addExpenses(e) {
  e.preventDefault();
  let transactionType = document.querySelector(
    'input[name="transactionType"]:checked',
  )?.value;
  let title = document.getElementById("title").value.trim();
  let category = document.getElementById("select-category").value.trim();
  let date = document.getElementById("date").value;
  let amount = document.getElementById("amount").value;
  let notes = document.getElementById("notes").value.trim();
  let method = document.getElementById("method").value;

  //validation
  if (!transactionType && !title && !category && !date && !amount && !method) {
    showToast("Fill the detailes", false);
    return;
  }
  if (!transactionType) {
    showToast("Choose credit or debit", false);
    return;
  }
  if (!title) {
    showToast("Enter the title for the transaction", false);
    return;
  }
  if (!category) {
    showToast("Choose category", false);
    return;
  }
  if (!amount) {
    showToast("Enter the amount", false);
    return;
  }
  if (amount <= 0) {
    showToast("Enter the valid amount", false);
    return;
  }
  if (!date) {
    showToast("Enter the date", false);
    return;
  }
  if (new Date(date) > new Date()) {
    showToast("Future dates are not allowed", false);
    return;
  }
  if (!method) {
    showToast("Choose the payment methode", false);
    return;
  }

  let { error } = await supabaseClient.from("expenses").insert([
    {
      title: title,
      expense_date: date,
      category: category,
      amount: amount,
      transaction_type: transactionType,
      notes: notes,
      payment_methode: method,
    },
  ]);
  if (error) {
    showToast(error.message, false);
    return;
  }
  showToast("Successfully add your transaction", true);
}
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
