//Work Buttons
const workButtonElement = document.querySelector("#workButton");
const bankButtonElement = document.querySelector("#depositButton");
//Bank Buttons
const loanButtonElement = document.querySelector("#loanButton");
const repayButtonElement = document.querySelector("#repayButton");
//Laptop Button
const buylaptopButtonElement = document.querySelector("#buyLaptopButton");
//Work Elements
const payCheckElement = document.querySelector("#payCheck");
//Bank Elements
const bankBalanceElement = document.querySelector("#bankBalance");
const loanBalanceElement = document.querySelector("#loanBalance");
//Dropdown Elements
const selectElement = document.querySelector("#laptopDropdown");
const laptopFeaturesElement = document.querySelector("#laptopFeatures");
//Laptop Elements
const laptopTitleElement = document.querySelector("#laptopName");
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
	laptopTitleElement.innerText = laptop.title;
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
		selectElement.append(option);
	}
}

function hasLoan() {
	return parse(loanBalanceElement.innerText) > 0;
}

workButtonElement.addEventListener("click", e => {
	const payBalance = parse(payCheckElement.innerText);

	payCheckElement.innerText = payBalance + 100;
});

bankButtonElement.addEventListener("click", e => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payBalance = parse(payCheckElement.innerText);

	if (hasLoan()) {
		const tenPercentOfPay = payBalance * 0.1;
		const payToDeposit = payBalance - tenPercentOfPay;

		bankBalanceElement.innerText = bankBalance + payToDeposit;
		loanBalanceElement.innerText = parse(loanBalanceElement.innerText) - tenPercentOfPay;
		payCheckElement.innerText = 0;

		return;
	}

	bankBalanceElement.innerText = bankBalance + payBalance;
	payCheckElement.innerText = 0;
});

loanButtonElement.addEventListener("click", () => {
	if (hasLoan()) return console.error("You cannot take another loan!");

	const bankBalance = parse(bankBalanceElement.innerText);
	const loanAmount = window.prompt("Choose your loan amount:");

	if (loanAmount === null || loanAmount === "") return console.error("Please enter a value!");
	if (parse(loanAmount) > bankBalance) return console.error("Loan amount too high!");

	loanBalanceElement.innerText = loanAmount;
	bankBalanceElement.innerText = parse(bankBalance) + parse(loanAmount);

	repayButtonElement.classList.toggle("hidden");
});

repayButtonElement.addEventListener("click", () => {
	const bankBalance = parse(bankBalanceElement.innerText);
	const payBalance = parse(payCheckElement.innerText);
	const loanBalance = parse(loanBalanceElement.innerText);

	if (payBalance > loanBalance) {
		const payToDeposit = payBalance - loanBalance;

		bankBalanceElement.innerText = bankBalance + payToDeposit;
		payCheckElement.innerText = 0;
		loanBalanceElement.innerText = 0;

		repayButtonElement.classList.toggle("hidden");

		return;
	}

	loanBalanceElement.innerText = loanBalance - payBalance;
	payCheckElement.innerText = 0;
});

buylaptopButtonElement.addEventListener("click", e => {
	const laptopPrice = parse(laptopPriceElement.innerText);
	const bankBalance = parse(bankBalanceElement.innerText);

	if (laptopPrice > bankBalance) return console.error("Not enough funds to buy this laptop!");

	bankBalanceElement.innerText = bankBalance - laptopPrice;

	boughtlaptops.push(laptopTitleElement.innerText);
	buylaptopButtonElement.disabled = true;
});

selectElement.addEventListener("change", e => {
	const laptopTitle = e.target.value;
	const laptop = laptops.find(laptop => laptop.title === laptopTitle);

	displayLaptop(laptop);
	displayLaptopFeatures(laptop);

	if (boughtlaptops.includes(laptopTitle)) {
		buylaptopButtonElement.disabled = true;
		return;
	}

	buylaptopButtonElement.disabled = false;
});
