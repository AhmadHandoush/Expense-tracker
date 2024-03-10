let currencyList = document.getElementById("currency");
let make = document.getElementById("make");
let form = document.getElementById("form");
let description = document.getElementById("description");
let amount = document.getElementById("amount");
let type = document.getElementById("type");
let filterCurrency = document.getElementById("filter-currency");
let histories = document.getElementById("histories");

// get currencies from api
const getCurrencies = async () => {
  try {
    const result = await fetch(
      "https://ivory-ostrich-yoke.cyclic.app/students/available ",
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

  let existingTrans =
    JSON.parse(localStorage.getItem("transactions-lists")) || [];

  existingTrans.push(formData);

  localStorage.setItem("transactions-lists", JSON.stringify(existingTrans));

  window.location.reload();
};

form.addEventListener("submit", handleSubmit);

const getData = () => {
  let transaction = localStorage.getItem("transactions-lists");
  if (transaction) {
    let data = JSON.parse(transaction);
    data.map((trans) => {
      const { description, amountt, type, currency } = trans;
      histories.innerHTML += ` <li class="history rounded flex">
        <button class="delete">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button class="edit">Edit</button>
        <div class="info flex-between flex-items">
          <p>${description}</p>
          <span>${currency}${amountt}</span>
        </div>
      </li>`;
      console.log(trans);
    });
  }
};

getData();
