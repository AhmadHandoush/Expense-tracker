let currencyList = document.getElementById("currency");

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
    });
  } catch (error) {
    console.log(error);
  }
};
getCurrencies();
