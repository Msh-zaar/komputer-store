// Buttons
const workButtonElement = document.querySelector("#workButton");
const depositButtonElement = document.querySelector("#depositButton");
const loanButtonElement = document.querySelector("#loanButton");
const repayLoanButtonElement = document.querySelector("#repayButton");
const buyLaptopButtonElement = document.querySelector("#buyLaptopButton");
// Balances
const bankBalanceElement = document.querySelector("#bankBalance");
const loanBalanceElement = document.querySelector("#loanBalance");
const payCheckElement = document.querySelector("#payCheck");
// Various
const laptopNameElement = document.querySelector("#laptopName");
const laptopDescriptionElement = document.querySelector("#laptopDescription");
const laptopPriceElement = document.querySelector("#laptopPrice");
const laptopImageElement = document.querySelector("#laptopImage");
const laptopSpecificElement = document.querySelector("#specificLaptops");
const selectElement = document.querySelector("#laptopDropdown");

let laptops;
let boughtLaptops = [];

const parse = Number.parseInt;

(async () => {
    const URL = "https://noroff-komputer-store-api.herokuapp.com";
    const temp = await getLaptops(`${URL}/computers`);

    laptops = temp.map(computer => ({
        ...computer,
        image: `${URL}/${computer.image}`
    }));

    addDropdown(laptops);

    displayLaptop(laptops[0]);
    displaySpecificLaptop(laptops[0]);
});

async function getLaptops(url){
    const result = await fetch(url);
    const laptopJson = await result.json();

    return [...laptopJson];
};

function displayLaptop(laptop){
    laptopNameElement.innerText  = laptop.title;
    laptopDescriptionElement.innerText  = laptop.description;
    laptopPriceElement.innerText  = laptop.price;
    laptopImageElement.src = laptop.image;

};

function displaySpecificLaptop(){
    laptopSpecificElement.innerHTML = ""

    for (const item of laptop.specs){
        const listItem = document.createElement("li");
        const desc = document.createElement(item);

        listItem.appendChild(desc);
        laptopDescriptionElement.append(listItem);
    };
};

function addDropdown(laptops){
    for (const laptop of laptops){
        const option = document.createElement("option")

        option.innerHTML = laptop.title
        selectElement.append(option)
    }
}

function hasLoan() {
	return parse(loanBalanceElement.innerHTML) > 0
}

// Buttons
// Work
workButtonElement.addEventListener("click", e => {
	const payCheck = parse(payCheckElement.innerHTML)

	payCheckElement.innerHTML = payCheck + 100
})
// Deposit
depositButtonElement.addEventListener("click", e => {
	const bankBalance = parse(bankBalanceElement.innerHTML)
	const payCheck = parse(payCheckElement.innerHTML)

	if (hasLoan()) {
		const tenPercentOfpayCheck = payCheck * 0.1
		const depositPayCheck = payCheck - tenPercentOfpayCheck

		bankBalanceElement.innerHTML = bankBalance + depositPayCheck
		loanBalanceElement.innerHTML = parse(loanBalanceElement.innerHTML) - tenPercentOfpayCheck
		payCheckElement.innerHTML = 0

		return
	}

	bankBalanceElement.innerHTML = bankBalance + payCheck
	payCheckElement.innerHTML = 0
})
// Loan
loanButtonElement.addEventListener("click", () => {
	if (hasLoan()) return console.error("You can't take up another loan!");

	const bankBalance = parse(bankBalanceElement.innerText);
	const loanAmount = window.prompt("How much do you want to lend?");

	if (loanAmount === null) return console.error("Please enter a value");
	if (parse(loanAmount) > bankBalance) return console.error("Loan denied");

	loanBalanceElement.innerText = loanAmount;
	bankBalanceElement.innerText = parse(bankBalance) + parse(loanAmount);

	repayLoanButtonElement.classList.toggle("hidden");
});


// Repay
repayLoanButtonElement.addEventListener("click", () => {
	const bankBalance = parse(bankBalanceElement.innerText)
	const payCheck = parse(payCheckElement.innerText)
	const loanBalance = parse(loanBalanceElement.innerText)

	if (payCheck > loanBalance) {
		const payToDeposit = payCheck - loanBalance

		bankBalanceElement.innerText = bankBalance + payToDeposit
		payCheckElement.innerText = 0
		loanBalanceElement.innerText = 0

		repayLoanButtonElement.classList.toggle("hidden")

		return
	}

	loanBalanceElement.innerText = loanBalance - payCheck
	payCheckElement.innerText = 0
})
// Purchase
buyLaptopButtonElement.addEventListener("click", e => {
	const laptopPrice = parse(laptopPriceElement.innerText)
	const bankBalance = parse(bankBalanceElement.innerText)

	if (laptopPrice > bankBalance) return console.error("You can't afford this laptop")

	bankBalanceElement.innerText = bankBalance - laptopPrice

	boughtLaptops.push(laptopPriceElement.innerText)
	buyLaptopButtonElement.disabled = true
})
// Select
selectElement.addEventListener("change", e => {
	const laptopName = e.target.value
	const laptop = laptops.find(laptop => laptop.title === laptopName)

	displayLaptop(laptop)
	displaySpecificLaptop(laptop)

	if (boughtLaptops.includes(laptopName)) {
		buyLaptopButtonElement.disabled = true
		return
	}

	buyLaptopButtonElement.disabled = false
})