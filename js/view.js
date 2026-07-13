let toastEl = document.getElementById("loginToast");
let toastMessage = document.getElementById("toastMessage");
let search = document.getElementById("search");
let flag = 0;
search.addEventListener("input", searchExpense);
let oneid = null;

let currentPageNo = 1;
let itemPerPage = 5;
let totalPage = 0;
let visiblePages = 3;
let page = [];
let expenseData = [];

async function loadExpenseHistory() {
  try {
    let { data, error } = await supabaseClient.auth.getUser();
    if (error) {
      showToast(error.message, false);
      return;
    }
    let { data: userData, error: userError } = await supabaseClient
      .from("expenses")
      .select("*")
      .eq("auth_id", data.user.id);
    if (userError) {
      showToast(userError.message, false);
      return;
    }
    tableCreation(userData);
  } catch (error) {
    showToast(error.message, false);
  }
}
loadExpenseHistory();

function tableCreation(data) {
  if (data.length === 0) {
    showToast("No record found", false);
  } else {
    totalPage = Math.ceil(data.length / itemPerPage);
    let sortedData = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    expenseData = sortedData;
    let pageData = pagination(sortedData);

    let body = document.getElementById("body");
    let html = `
<table class="table table-bordered" style="border: 1px solid #dee2e6; border-radius: 5px; overflow: hidden; border-collapse: collapse; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
    <thead>
        <tr>
            <th style="width:5%; text-align:center;">SI</th>
            <th style="width:20%; text-align:center;">Date</th>
            <th style="width:40%; text-align:left;">Title</th>
            <th style="width:20%; text-align:right;">Amount</th>
            <th style="width:15%; text-align:center;">Action</th>
        </tr>
    </thead>
    <tbody id="expense-body">
    </tbody>
</table>
`;
    body.innerHTML = html;
    let tbody = document.getElementById("expense-body");
    let count = (currentPageNo - 1) * itemPerPage + 1;
    pageData.forEach((el) => {
      let tr = document.createElement("tr");
      let set = el.transaction_type === "Credit" ? "green" : "red";
      let html = `<td style="text-align:center; color:${set}">${count}</td>
      <td style="text-align:center; color:${set}">${el.expense_date.split("-").reverse().join("-")}</td>
      <td style="color:${set}">${el.title.charAt(0).toUpperCase() + el.title.slice(1)}</td>
      <td style="text-align:right; color:${set}">₹${el.amount}</td>
      <td style="text-align:center; gap: 5px;">
        <button class="btn btn-outline-primary btn-sm" onclick="viewExpense('${el.id}')"><span><i class="fa fa-eye"></i></span></button> <button class="btn btn-outline-danger btn-sm" onclick="deleteExpense('${el.id}', '${el.title}')"><span><i class="fa fa-trash"></i></span></button>
      </td>
    `;
      tr.innerHTML = html;
      tbody.appendChild(tr);
      count++;
    });

    if (flag === 0) {
      showToast("Expense history loaded successfully", true);
      flag = 1;
    }
  }
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

function viewExpense(id) {
  localStorage.setItem("expenseId", id);
  window.location.href = "document.html";
}
function deleteExpense(id, title) {
  oneid = id;
  let div = document.getElementById("modal");
  let html = `<div class="modal fade" id="modal-down1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="text-danger text-center">Confirm Delete</h5>
        <button class="btn btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>
          Are you sure you want to delete the expense titled <strong class="text-danger">${title}</strong> ?.
        </p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Close
        </button>
        <button type="button" class="btn btn-danger" id="confirm" onclick="confirmDelete('${id}')">Delete</button>
      </div>
    </div>
  </div>
</div>`;
  div.innerHTML = html;
  const modal = new bootstrap.Modal(document.getElementById("modal-down1"));
  modal.show();
}

async function confirmDelete(id) {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modal-down1"),
  );

  modal.hide();
  try {
    let { data: deleteData, error: deleteError } = await supabaseClient
      .from("expenses")
      .delete()
      .eq("id", id);
    if (deleteError) {
      showToast(deleteError.message, false);
    }
    showToast("Successfully deleted the transaction", true);
    loadExpenseHistory();
  } catch (error) {
    showToast(error.message, false);
  }
}

function pagination(data) {
  let start = (currentPageNo - 1) * itemPerPage;
  let end = start + itemPerPage;
  let page = data.slice(start, end);
  console.log("page", page);
  renderPagination();
  return page;
}
function renderPagination() {
  let pageIcon = document.getElementById("pagination");
  pageIcon.innerHTML = "";

  let startPage = currentPageNo;
  let endPage = startPage + visiblePages - 1;

  // Prevent exceeding total pages
  if (endPage > totalPage) {
    endPage = totalPage;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  // Previous Button
  let previousLi = document.createElement("li");
  previousLi.classList.add("page-item");

  if (currentPageNo === 1) {
    previousLi.classList.add("disabled");
  }

  let previousButton = document.createElement("button");
  previousButton.classList.add("page-link");
  previousButton.textContent = "<<";

  previousButton.addEventListener("click", function () {
    if (currentPageNo > 1) {
      currentPageNo--;
      tableCreation(expenseData);
    }
  });

  previousLi.appendChild(previousButton);
  pageIcon.appendChild(previousLi);

  // Page Numbers
  for (let i = startPage; i <= endPage; i++) {
    let li = document.createElement("li");
    li.classList.add("page-item");

    if (i === currentPageNo) {
      li.classList.add("active");
    }

    let button = document.createElement("button");
    button.classList.add("page-link");
    button.textContent = i;

    button.addEventListener("click", function () {
      currentPageNo = i;
      tableCreation(expenseData);
    });

    li.appendChild(button);
    pageIcon.appendChild(li);
  }

  // Next Button
  let nextLi = document.createElement("li");
  nextLi.classList.add("page-item");

  if (currentPageNo === totalPage) {
    nextLi.classList.add("disabled");
  }

  let nextButton = document.createElement("button");
  nextButton.classList.add("page-link");
  nextButton.textContent = ">>";

  nextButton.addEventListener("click", function () {
    if (currentPageNo < totalPage) {
      currentPageNo++;
      tableCreation(expenseData);
    }
  });

  nextLi.appendChild(nextButton);
  pageIcon.appendChild(nextLi);
}

function searchExpense() {
  let keyword = search.value.trim().toLowerCase();

  currentPageNo = 1;

  if (keyword === "") {
    tableCreation(expenseData);
    return;
  }

  let filteredData = expenseData.filter((expense) => {
    return (
      expense.title.toLowerCase().includes(keyword) ||
      expense.transaction_type.toLowerCase().includes(keyword) ||
      expense.amount.toString().includes(keyword) ||
      expense.expense_date.includes(keyword) ||
      expense.category.includes(keyword)
    );
  });

  tableCreation(filteredData);
}
