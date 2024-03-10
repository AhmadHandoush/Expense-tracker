let currencyList = document.getElementById("currency");
let make = document.getElementById("make");
let form = document.getElementById("form");
let description = document.getElementById("description");
let amount = document.getElementById("amount");
let type = document.getElementById("type");
let filterCurrency = document.getElementById("filter-currency");
let histories = document.getElementById("histories");
let totalBalance = document.getElementById("total-amount");
let totalExpense = document.getElementById("esxpense-amount");
let totalIncomes = document.getElementById("income-amount");
let incomesFilter = document.getElementById("incomes-filter");
let expensesFilter = document.getElementById("expenses-filter");
let sum = 0;
let expenses = 0;
let incomes = 0;
let existingTrans =
  JSON.parse(localStorage.getItem("transactions-lists")) || [];

// get currencies from api
const getCurrencies = async () => {
  try {
    const result = await fetch(
      "https://crowded-cyan-wildebeest.cyclic.app/students/available",
      { method: "GET" }
    );
    const response = await result.json();
    response.map((currency) => {
      const { name, symbol, code } = currency;
      currencyList.innerHTML += `<option value=${currency.code}>${currency.code}</option>`;
      filterCurrency.innerHTML += `<option value=${currency.code}>${currency.code}</option>`;
    });
  } catch (error) {
    console.log(error);
  }
};
getCurrencies();

// handle submit
const handleSubmit = (e) => {
  e.preventDefault();

  let description = document.getElementById("description").value;
  let amountt = document.getElementById("amount").value;
  let type = document.getElementById("type").value;
  let currency = document.getElementById("currency").value;

  let formData = {
    description: description,
    amountt: amountt,
    type: type,
    currency: currency,
  };

  existingTrans.push(formData);

  localStorage.setItem("transactions-lists", JSON.stringify(existingTrans));

  window.location.reload();
};

form.addEventListener("submit", handleSubmit);

let transaction = localStorage.getItem("transactions-lists");
let data = JSON.parse(transaction);

const getData = (data) => {
  if (transaction) {
    data.map((trans, index) => {
      const { description, amountt, type, currency } = trans;
      histories.innerHTML += ` <li class="history rounded flex">
        <button class="delete" onclick="deleteItem(${index})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="edit">Edit</button>
        <div class="info flex-between flex-items">
          <p>${description}</p>
          <span>${currency}${amountt}</span>
        </div>
      </li>`;

      if (type == "Incomes") {
        sum += Number(amountt);
        incomes += Number(amountt);
      } else {
        sum -= Number(amountt);
        expenses += Number(amountt);
      }
      totalBalance.textContent = sum;
      totalExpense.textContent = expenses;
      totalIncomes.textContent = incomes;
    });
  }
};

getData(data);

const deleteItem = (index) => {
  if (confirm("Are you sure you want to delete this user?")) {
    existingTrans.splice(index, 1);
    localStorage.setItem("transactions-lists", JSON.stringify(existingTrans));
    window.location.reload();
    getData();
  }
};

const filterData = (n) => {
  let filteredItems = existingTrans.filter((item) => item.type == n);
  getData(filteredItems);
};
