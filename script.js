"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

// INJECTING AN ARRAY INTO THE HTML TO BE DISPLAYED (line 76)
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ``;

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

// SHOWS OVERARCHING BALANCE
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

//DISPLAY TOTAL SUMMARY
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//CREATING A USERNAME
const createUsernames = function (acc) {
  acc.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(` `)
      .map((name) => name[0])
      .join(``);
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovements(acc.movements);
  //dispay balance
  calcPrintBalance(acc);
  //display sumary
  calcDisplaySummary(acc);
};

//EVENT HANDLERS
//LOGGING IN A USER
//FIND A USER AND GET ALL THE RELATED INFO
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  //PREVENTS FORM FROM SUBMITTING
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;

    // clear fields
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();

    //UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = ``;

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //UPDATES UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    //DELETE ACCOUNT
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});

let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = [`a`, `b`, `c`, `d`, `e`];

// SLICE METHOD
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -1));

//SHALLOW COPY
console.log(arr.slice());
console.log([...arr]);

//SPLICE METHOD
//console.log(arr.splice(2));
console.log(arr.splice(-1));
console.log(arr.splice(1, 2));
console.log(arr);

// REVERSE
arr = [`a`, `b`, `c`, `d`, `e`];
const arr2 = [`j`, `i`, `h`, `g`, `f`];
console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(`-`));


const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

//GETTING LAST ELEMENT
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

console.log(`jonas`.at(0));


// FOR EACH LOOP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

// FOR EACH METHOD
console.log(`------ FOR EACH ------`);
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}:You withdrew ${Math.abs(mov)}`);
  }
});

// FOR EACH WITH MAPS
const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}:  ${value}`);
});

// FOR EACH WITH SET
const currenciesUnique = new Set([`USD`, `GBP`, `USD`, `EUR`, `EUR`]);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${_}:  ${value}`);
});



// CODING CHALLNEGE # 1
const checkDogs = function (dogsJulia, dogsKate) {
  const juliaDogs = dogsJulia.slice(1, 3);
  const newArr = [...juliaDogs, ...dogsKate];
  // console.log(newArr);
  newArr.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult and is ${dog} years old!`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy.`);
    }
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);



const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

const movementsUSD = movements.map((mov) => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);

const movementsUSDFor = [];
for (const mov of movements) movementsUSDFor.push(mov * eurToUsd);
console.log(movementsUSDFor);

const movementsDesc = movements.map((mov, i) => {
  if (mov > 0) {
    return `Movement ${i + 1}: You deposited ${mov}`;
  } else {
    return `Movement ${i + 1}:You withdrew ${Math.abs(mov)}`;
  }
});

console.log(movementsDesc);


//FILTERING
const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

//FILTERING WITH FPOR LOOP
const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

// FILTERING WITHDRAWALS
const withdrawals = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawals);

// REDUCE
console.log(movements);
// accumulator is lik a snowball
const balance = movements.reduce(function (acc, cur, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + cur;
}, 0);

console.log(balance);

// FOR OF LOOP SAME AS REDUCE
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// MAXIMUM VALUE
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);

////////////  CODING CHALLENGE # 2 //////////////////////////////
const calcAverageHumanAge = function (ages) {
  const humanAges = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adults = humanAges.filter((age) => age >= 18);
  console.log(adults, humanAges);

  const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1);

const eurToUsd = 1.1;

// PIPELINE
const totalDepositsInUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsInUSD);

////////////////////  CODING CHALLENGE # 3 //////////////////////////////
const calcAverageHumanAge = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);


// THE FIND METHOD
const firstWithdrawal = movements.find((mov) => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find((acc) => acc.owner === `Jessica Davis`);
console.log(account);


////////////////////////////// SOME AND EVERY
console.log(movements);

// EQUALITY
console.log(movements.includes(-130));

// SOME: CONDITION
console.log(movements.some((mov) => mov === -130));

const anyDeposits = movements.some((mov) => mov > 0);
console.log(anyDeposits);

//EVERY
console.log(movements.every((mov) => mov > 0));
console.log(account4.movements.every((mov) => mov > 0));

// Separate callbak
const deposit = (mov) => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));


///////////////////////////////////// FLAT AND FLATMAP
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// const accountMovements = accounts.map((acc) => acc.movements);
// console.log(accountMovements);

// const allMovements = accountMovements.flat();
// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// flat
const allBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(allBalance);

// flatMap
const allBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(allBalance2);

/////////////////////////////////// SORTING
//STRINGS
const owners = [`Jonas`, `Zach`, `Adam`, `Martha`];
console.log(owners.sort());
console.log(owners);

//NUMBERS
console.log(movements);

// RETURN < 0, A, B (keep order)
// RETURN > 0, B, A (switch order)

// Ascending
movements.sort(
  (a, b) => a - b
  // {
  // if (a > b) return 1;
  // if (b > a) return -1;
  // }
);
console.log(movements);

// Descending - verbos version
movements.sort((a, b) => {
  if (a < b) return 1;
  if (b < a) return -1;
});
console.log(movements);


////////////////////////////////// OTHER ARRAY METHODS
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// EMPTY ARRAY plus Fill method
const x = new Array(7);
console.log(x);
console.log(x.fill(1, 3, 5));
console.log(arr.fill(23, 2, 6));

//Array.from()
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// 100 random dice rolls
const randoDice = Array.from({ length: 100 }, (_, i) => Math.random() * 6);
console.log(randoDice);

labelBalance.addEventListener(`click`, function () {
  const movementsUI = Array.from(
    document.querySelectorAll(`.movements__value`),
    (el) => Number(el.textContent.replace(`€`, ``))
  );
  console.log(movementsUI);
});
*/
