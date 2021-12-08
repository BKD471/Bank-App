"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2021-12-01T07:42:02.383Z",
    "2021-12-03T09:15:04.904Z",
    "2021-12-04T10:17:24.185Z",
    "2021-11-30T14:11:59.604Z",
    "2021-12-02T17:01:17.194Z",
    "2021-12-05T23:36:17.929Z",
    "2021-12-06T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = (dates, locale) => {
  const calcDaysPassed = (date2, date1) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), dates);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return Intl.DateTimeFormat(locale).format(dates);
};

const formatCurr = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

// Displaying all the credit and debit history
const displayMovements = function (acc, sort = false) {
  const mov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = "";
  mov.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const dates = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(dates, acc.locale);

    const formattedMov = formatCurr(mov, acc.locale, acc.currency);

    const html = `
            <div class="movements__row">
              <div class="movements__type movements__type--${type}">${
      i + 1
    }${type}</div>
              <div class="movements__date">${displayDate}</div>
              <div class="movements__value">${formattedMov}</div>
            </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });

  [...document.querySelectorAll(".movements__row")].forEach((Tray, index) => {
    if (index % 2 !== 0) Tray.style.backgroundColor = "#dee2e6";
  });
};

//Displaying the balance available for that account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCurr(acc.balance, acc.locale, acc.currency);
};

//Displaying the summary  at the below  in footer
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((e) => e > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const expenditure = acc.movements
    .filter((e) => e < 0)
    .reduce((acc, curr) => acc + curr, 0);
  const interest = acc.movements
    .filter((e) => e > 0)
    .map((e) => (e * acc.interestRate) / 100)
    .filter((e) => e >= 1)
    .reduce((acc, intrst) => acc + intrst);

  labelSumIn.textContent = formatCurr(income, acc.locale, acc.currency);
  labelSumOut.textContent = formatCurr(
    Math.abs(expenditure),
    acc.locale,
    acc.currency
  );
  labelSumInterest.textContent = formatCurr(interest, acc.locale, acc.currency);
};

//Add usernames to objects
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((e) => e[0])
      .join("");
  });
};
createUserNames(accounts);

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// Updating the UI
const updateUI = (acc) => {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const startLogOutTimer = () => {
  const tick = () => {
    const min = String(Math.trunc(t / 60)).padStart(2, 0);
    const sec = String(t % 60).padStart(2, 0);

    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    if (t === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }
    //decrease 1s every time
    t--;

    // when 0 seconds stop time and log out user
  };

  // set time to 5 minutes

  let t = 300;

  //call the timer every seconds
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Login Functionality
let currentAccount, timer;
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );
  // due to type coercion anything that starts with + is converted to number, no need of Number()
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "2-digit",
      // weekday: "long",
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear previous timer of other user if any
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});

// Transfer Amount from  one account to another
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  // due to type coercion anything that starts with + is converted to number, no need of Number()
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    receiverAccount &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Giving loan to those who has atleast 10% of requested amount as deposit in account
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  // due to type coercion anything that starts with + is converted to number, no need of Number()
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((curr) => curr >= amount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = "";
});

// Deleting user account
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  // due to type coercion anything that starts with + is converted to number, no need of Number()

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

//Sorting the Movements and showing them in display
let sortStatus = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  sortStatus = !sortStatus;
  displayMovements(currentAccount, sortStatus);
  //reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
});
