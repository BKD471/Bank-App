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



// Displaying all the credit and debit history
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



//Displaying the balance available for that account
const calcDisplayBalance=function(acc)
{
   acc.balance=acc.movements.reduce( (acc,curr) => acc+curr ,0)
   labelBalance.textContent=`${acc.balance} €`;
}



//Displaying the summary  at the below  in footer
const calcDisplaySummary=function(acc)
{
   const income=acc.movements.filter(e => e>0).reduce( (acc,curr) => acc+curr,0);
   const expenditure=acc.movements.filter(e=> e<0).reduce( (acc,curr)=> acc+curr,0);
   const interest=acc.movements.filter(e => e>0).map( e => (e*acc.interestRate)/100).filter(e=> e>=1).reduce( (acc,intrst) => acc+intrst);
   labelSumIn.textContent=`${income} €`;
   labelSumOut.textContent=`${Math.abs(expenditure)} €`;
   labelSumInterest.textContent=`${interest}  €`
}


//Add usernames to objects
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

// Updating the UI
const updateUI=(acc)=>
{
    displayMovements(acc.movements);
         calcDisplayBalance(acc);
        calcDisplaySummary(acc);
}

// Login Functionality 
let currentAccount;
btnLogin.addEventListener('click', e => {
   e.preventDefault();
    currentAccount=accounts.find( account => account.username===inputLoginUsername.value); 
    if(currentAccount?.pin===Number(inputLoginPin.value))
    {    
         labelWelcome.textContent=`Welcome back, ${currentAccount.owner.split(' ')[0]}`
         containerApp.style.opacity=100;
         
         inputLoginUsername.value=inputLoginPin.value='';
          inputLoginPin.blur();

         updateUI(currentAccount);
    }
  })



  // Transfer Amount from  one account to another
  btnTransfer.addEventListener('click', (e)=> {
    e.preventDefault();
    const amount=Number(inputTransferAmount.value);
    const receiverAccount=accounts.find( acc => acc.username===inputTransferTo.value);

    inputTransferAmount.value=inputTransferTo.value='';

    if(receiverAccount && amount >0 &&  amount<=currentAccount.balance && receiverAccount?.username!==currentAccount.username)
    {
      currentAccount.movements.push(-amount);
      receiverAccount.movements.push(amount);
      updateUI(currentAccount);
    }

  });

//whose deposit is more tha 10%



// Giving loan to those who has atleast 10% of requested amount as deposit in account
btnLoan.addEventListener('click', e => {

        e.preventDefault();
        const amount=Number(inputLoanAmount.value);
        if(amount>0 && currentAccount.movements.some( curr => curr>= amount*0.1))
        {
             currentAccount.movements.push(amount);
             updateUI(currentAccount);
        }
         inputLoanAmount.value=''
})


// Deleting user account
  btnClose.addEventListener( 'click',(e)=>{
          e.preventDefault();
          
          if(inputCloseUsername.value===currentAccount.username && Number(inputClosePin.value)===currentAccount.pin)
          {
            const index=accounts.findIndex( acc=> acc.username===currentAccount.username);
            accounts.splice(index,1);

            containerApp.style.opacity=0;
          }
          inputCloseUsername.value=inputClosePin.value='';

  });



 