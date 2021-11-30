'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const displayMovements=function(movements)
{
  containerMovements.innerHTML='';
  movements.forEach(function(mov,i){
    const type= mov>0? 'deposit':'withdrawal';
    const html=`
            <div class="movements__row">
              <div class="movements__type movements__type--${type}">${i+1}${type}</div>
              <div class="movements__value">${mov}€</div>
            </div>`;
           containerMovements.insertAdjacentHTML('afterbegin',html);
   });
}

displayMovements(account1.movements)


const createUserNames=function(accs)
{

   accs.forEach(function(acc){

    acc.username=acc.owner.toLowerCase().split(' ').map( (e) => e[0]).join('')
   })

}
createUserNames(accounts)








const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

//////////////////////////////ForEach/////////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// movements.forEach(function(element,index,array){
//   if(element>0)
//   {
//    console.log(`${index} you deposited: ${element}`)
//   }
//   else
//   {
//    console.log(`${index} you Withdrawn: ${Math.abs(element)}`)
//   }
//   console.log(array)
// })

/////////////////////////MAP///////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const temp=movements.map(function(e){
//      return e*1.1;
// })

// const euroToUsd=1.1;
// const movementsUSD=movements.map( (mov) => mov*euroToUsd);
//console.log(movementsUSD)


// const movementsDescription=movements.map( (mov,index) =>{
//  return  `Movement:${index+1} you ${mov>0? 'Deposited ':'Withdrew'}: ${Math.abs(mov)}`
// })

// console.log(movementsDescription)

/////////////////////FILTER//////////////////////////

// const movements=[200, 450, -400, 3000, -650, -130, 70, 1300];

// const filteredDeposits=movements.filter((e)=> e>0)
// console.log(filteredDeposits)

// const filteredWithdrawl=movements.filter( e=> e<0)
// console.log(filteredWithdrawl)