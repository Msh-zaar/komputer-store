//Work Buttons
const workButtonElement = document.querySelector("#workButton");
const depositButtonElement = document.querySelector("#depositButton");
//Bank Buttons
const loanButtonElement = document.querySelector("#loanButton");
const repayButtonElement = document.querySelector("#repayButton");
//Laptop Button
const buyButtonElement = document.querySelector("#buyButton");
//Work Elements
const payCheckElement = document.querySelector("#payCheck");
//Bank Elements
const bankBalanceElement = document.querySelector("#bankBalance");
const loanBalanceElement = document.querySelector("#loanBalance");
//Dropdown Elements
const laptopDropdownElement = document.querySelector("#laptopDropdown");
const laptopFeaturesElement = document.querySelector("#laptopFeatures");
//Laptop Elements
const laptopNameElement = document.querySelector("#laptopName");
const laptopDesciptionElement = document.querySelector("#laptopDescription");
const laptopPriceElement = document.querySelector("#laptopPrice");
const laptopImageElement = document.querySelector("#laptopImage");

let laptops;
let boughtlaptops = [];
const parse = Number.parseInt;

(async () => {
	const URL = "https://noroff-komputer-store-api.herokuapp.com";
	const temp = await getLaptops(`${URL}/computers`);

	laptops = temp.map(laptop => ({
		...laptop,
		image: `${URL}/${laptop.image}`
	}));

	addDropdown(laptops);

	displayLaptop(laptops[0]);
	displayLaptopFeatures(laptops[0]);
})();

async function getLaptops(url) {
	const res = await fetch(url);
	const laptopsJson = await res.json();

	return [...laptopsJson];
}

function displayLaptop(laptop) {
	laptopNameElement.innerText = laptop.title;
	laptopDesciptionElement.innerText = laptop.description;
	laptopPriceElement.innerText = laptop.price;
	laptopImageElement.src = laptop.image;
}

function displayLaptopFeatures(laptop) {
	laptopFeaturesElement.innerHTML = "";

	for (const feature of laptop.specs) {
		const listItem = document.createElement("li");
		const text = document.createTextNode(feature);

		listItem.appendChild(text);
		laptopFeaturesElement.append(listItem);
	}
}

function addDropdown(laptops) {
	for (const laptop of laptops) {
		const option = document.createElement("option");

		option.innerText = laptop.title;
		laptopDropdownElement.append(option);
	}
}

function hasLoan() {
	return parse(loanBalanceElement.innerText) > 0;
}

//EventListeners
workButtonElement.addEventListener("click", e => {
	const payCheck = parse(payCheckElement.innerText);

	payCheckElement.innerText = payCheck + 100;
});

depositButtonElement.addEventListener("click", e => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payCheck = parse(payCheckElement.innerText);

	if (hasLoan()) {
		const tenPercentOfPay = payCheck * 0.1;
		const depositPay = payCheck - tenPercentOfPay;

		bankBalanceElement.innerText = bankBalance + depositPay;
		loanBalanceElement.innerText = parse(loanBalanceElement.innerText) - tenPercentOfPay;
		payCheckElement.innerText = 0;

		return;
	}

	bankBalanceElement.innerText = bankBalance + payCheck;
	payCheckElement.innerText = 0;
});

loanButtonElement.addEventListener("click", () => {
	if (hasLoan()) return window.alert("You can't apply for another loan at this time.");

	const bankBalance = parse(bankBalanceElement.innerText);
	const currentLoan = window.prompt("Please fill in the amount you wish to lend: ");

	if (currentLoan === null || currentLoan === "" ) return window.alert("Please enter a value.");
    if (isNaN(parse(currentLoan))) return window.alert("Please enter a numeric value.");
	if (parse(currentLoan) > bankBalance) return window.alert("Amount is too high, please select a lower value.");

	loanBalanceElement.innerText = currentLoan;
	bankBalanceElement.innerText = parse(bankBalance) + parse(currentLoan);

	repayButtonElement.classList.toggle("hidden");
});

repayButtonElement.addEventListener("click", () => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payCheck = parse(payCheckElement.innerText);
	const loanBalance = parse(loanBalanceElement.innerText);

	if (payCheck > loanBalance) {
		const depositPay = payCheck - loanBalance;

		bankBalanceElement.innerText = bankBalance + depositPay;
		payCheckElement.innerText = 0;
		loanBalanceElement.innerText = 0;

		repayButtonElement.classList.toggle("hidden");

		return;
	}

	loanBalanceElement.innerText = loanBalance - payCheck;
	payCheckElement.innerText = 0;
});

buyButtonElement.addEventListener("click", e => {
	const laptopPrice = parse(laptopPriceElement.innerText);
	const bankBalance = parse(bankBalanceElement.innerText);

	if (laptopPrice > bankBalance) return window.alert("You can't afford this model.");

	bankBalanceElement.innerText = bankBalance - laptopPrice;

	boughtlaptops.push(laptopNameElement.innerText);
	buyButtonElement.disabled = true;
    window.alert(`You purchased a ${laptopNameElement.innerText}`);
});

laptopDropdownElement.addEventListener("change", e => {
	const laptopTitle = e.target.value;
	const laptop = laptops.find(laptop => laptop.title === laptopTitle);

	displayLaptop(laptop);
	displayLaptopFeatures(laptop);

	if (boughtlaptops.includes(laptopTitle)) {
		buyButtonElement.disabled = true;
		return;
	}

	buyButtonElement.disabled = false;
});
