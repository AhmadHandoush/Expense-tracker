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
let allFilter = document.getElementById("all-filter");
let from = document.getElementById("from");
let to = document.getElementById("to");
let filterAmount = document.getElementById("filter-amount");
let sum = 0;
let expenses = 0;
let incomes = 0;
let existingTrans = JSON.parse(localStorage.getItem("t-lists")) || [];

// get currencies from api
const getCurrencies = async () => {
  try {
    const result = await fetch(
      "https://rich-erin-angler-hem.cyclic.app/students/available",
      { method: "GET" }
    );
    const response = await result.json();
    response.map((currency) => {
      const { code } = currency;
      currencyList.innerHTML += `<option value=${code}>${code}</option>`;
      filterCurrency.innerHTML += `<option value=${code}>${code}</option>`;
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

  localStorage.setItem("t-lists", JSON.stringify(existingTrans));

  window.location.reload();
};

form.addEventListener("submit", handleSubmit);

let transaction = localStorage.getItem("t-lists");
let transData = JSON.parse(transaction);

const displayData = (data) => {
  if (transaction) {
    data.map((trans, index) => {
      const { description, amountt, type, currency } = trans;

      histories.innerHTML += ` <li class="history rounded flex" id="history">
        <button class="delete" onclick="deleteItem(${index})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="edit" onclick="editData(${index})">Edit</button>
        <div class="info flex-between flex-items">
          <p>${description}</p>
          <span>${currency} ${amountt}</span>
        </div>
      </li>`;

      convertCurrency(currency, "USD", type, amountt);
    });
  }
};

displayData(transData);

const deleteItem = (index) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    existingTrans.splice(index, 1);
    localStorage.setItem("t-lists", JSON.stringify(existingTrans));
    window.location.reload();
  }
};

// filtered by type
const filterData = (n) => {
  let filtered = transData.filter((item) => item.type == n);
  histories.innerHTML = "";
  displayData(filtered);
};

// filtered by currency
const filterByCurrency = () => {
  let filtered = transData.filter(
    (item) => item.currency === filterCurrency.value
  );
  histories.innerHTML = "";
  displayData(filtered);
};
filterCurrency.addEventListener("change", filterByCurrency);

// filtered by amount
const filterByAmount = () => {
  let filtered = transData.filter(
    (item) => item.amountt >= from.value && item.amountt <= to.value
  );
  histories.innerHTML = "";
  displayData(filtered);
};

filterAmount.addEventListener("click", filterByAmount);

// get all
allFilter.addEventListener("click", function () {
  histories.innerHTML = "";
  displayData(transData);
});

// convert to USD
function convertCurrency(fromCurrency, toCurrency, type, amount) {
  const data = {
    from: fromCurrency,
    to: toCurrency,
    amount: amount,
  };

  fetch("https://rich-erin-angler-hem.cyclic.app/students/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (type == "Incomes") {
        sum += parseInt(Number(data));
        incomes += parseInt(Number(data));
      } else {
        sum -= parseInt(Number(data));
        expenses += parseInt(Number(data));
      }
      totalBalance.textContent = ` $${sum}`;
      totalExpense.textContent = ` $${expenses}`;
      totalIncomes.textContent = ` $${incomes}`;
    });
}

function editData(index) {
  const newData = prompt(
    "Enter new data (e.g., type, amount, currency)",
    "descption, type, amount,currency"
  );

  // Update data
  if (newData) {
    const [description, type, amount, currency] = newData
      .split(",")
      .map((item) => item.trim());
    if (description && type && amount && currency) {
      transData[index] = {
        description,
        type,
        amountt: Number(amount),
        currency,
      };
      localStorage.setItem("t-lists", JSON.stringify(transData));
      histories.innerHTML = "";
      displayData(transData);
    } else {
      alert(
        "Invalid input! Please providedescription, type, amount, and currency separated by commas."
      );
    }
  }
}
