const showBar = document.getElementById("showBar");
const inputBar = document.getElementById("inputBar");
const NOT_ALLOWED_CHARS = /^[^0-9+\-/*\.]*$/;
const calculatorButton = document.getElementsByClassName("calculatorButton");
const PLUS_OPERATOR = '+';
const MINUS_OPERATOR = '-';
const DIVIDE_OPERATOR = '/';
const MULTI_OPERATOR = '*';
const OPERATORS = [PLUS_OPERATOR, MINUS_OPERATOR, DIVIDE_OPERATOR, MULTI_OPERATOR];
const MAX_VALUE = Math.pow(2, 53);
const MIN_VALUE = (-1) * Math.pow(2, 53);
const methods = new Map([
  [MINUS_OPERATOR, (a, b) => a - b],
  [PLUS_OPERATOR, (a, b) => a + b],
  [MULTI_OPERATOR, (a, b) => a * b],
  [DIVIDE_OPERATOR, (a, b) => a / b],
]);
const expression = [];
const calculate_assisting = [];
let equalButtonClicked = false;

/*React to the 'Escape' and 'Enter' key presses.
Escape - act like the clear button
Enter - act like the equal cutton
*/
document.addEventListener('keydown', (event) => {
  if(event.key === "Escape") {
    onClearButtonClick();
  }

  if(event.key === "Enter"){
    onEqualButtonClick();
  }
});

//React to clicks on the numbers buttons.
const onNumberButtonClick = (buttenValue) => {
  if(equalButtonClicked){
    onClearButtonClick(); 
  }

  inputBar.value = inputBar.value + buttenValue;
  checkInputBar();
}

//React to clicks on the clear button to reset the calculator.
const onClearButtonClick = () => {
  expression.length = 0;
  showBar.innerHTML = "";
  inputBar.value = "";
  equalButtonClicked = false;
  enableAllButtons();
}

//React to clicks on the delete button.
const onDeleteButtonClick = () => {
  if(equalButtonClicked){
    onClearButtonClick(); 
  }

  inputBar.value = inputBar.value.slice(0, -1);
}

//Add the operator or point that the user clicks on.
const onOperatorOrPointButtonClick = (innerHTML) => {
  inputBar.value += innerHTML;
  checkInputBar();
}

//Check the value in the input bar after adding by the buttons or keyboard.
const checkInputBar = () => {
  if(inputBar.value >= MAX_VALUE){
    disabeleButtonsOnError();
    inputBar.value = "Number too big";
  }else{
    inputBar.value = inputBar.value.replace(NOT_ALLOWED_CHARS,"");
    if(OPERATORS.includes(inputBar.value.at(-1))){
      addOperator(inputBar.value.at(-1));
    }else if(inputBar.value.at(-1) == "."){
      addPoint();
    }else if(inputBar.value.length >= 1 && !inputBar.value.includes(".")){
      inputBar.value = parseFloat(inputBar.value);
    }
  }
}

//React to operators added by buttons or keyboard.
const addOperator = (operator) => {
  if(equalButtonClicked && inputBar.value.length !== 1){//Continue the expression with the result value.
    expression.push(operator);
    showBar.innerHTML = expression[0] + operator;
    inputBar.value = "";
    equalButtonClicked = false;
  }else if(inputBar.value.length === 1){
    if(showBar.innerHTML.length === 0){
      inputBar.value = "";
    }else{//Replace the operator in the display bar with the one that is currently selected for addition.
      expression.pop();
      expression.push(inputBar.value);
      showBar.innerHTML = showBar.innerHTML.slice(0, -1) + operator;
      inputBar.value = "";   
    }
  }else{//Add the expression in the input bar to the display bar.
    expression.push(inputBar.value.slice(0, -1));
    expression.push(operator);
    showBar.innerHTML += inputBar.value;
    inputBar.value = "";
  }
}

//React to point added by button or keyboard.
const addPoint = () => {
  if(equalButtonClicked){
    onClearButtonClick(); 
  }

  if(inputBar.value.slice(0,-1).includes(".")){
    inputBar.value = inputBar.value.slice(0, -1);
  }

  if(inputBar.value.length === 1){
    inputBar.value = '0.';
  }
}

//React to clicks on the equal button or pressing enter.
const onEqualButtonClick = () => {
  if(equalButtonClicked){
    return;
  }

  if(inputBar.value.length === 0){
    expression.pop();
  }else{
    expression.push(inputBar.value)
  }

  showBar.innerHTML = expression.join("");
  inputBar.value = calculateexpression();
  calculate_assisting.length = 0;
  equalButtonClicked = true;
}

//Calculate the mathematical expression.
const calculateexpression = () => {
  if(expression.length === 0){
    return "";
  }

  let skipNext = false;

  expression.forEach((item, index) => {
    if(skipNext){
      skipNext = false;
    }else if(item == DIVIDE_OPERATOR || item == MULTI_OPERATOR){
      calculate_assisting.push(methods.get(item)(+calculate_assisting.pop(), +expression[index+1]));
      skipNext = true;    
    }else{
      calculate_assisting.push(item);
    }
  })

  expression.length = 0;
  
  calculate_assisting.forEach((item, index) => {
    if(skipNext){
      skipNext = false;
    }else if(item == PLUS_OPERATOR || item == MINUS_OPERATOR){
      expression.push(methods.get(item)(+expression.pop(), +calculate_assisting[index+1]));
      skipNext = true; 
    }else{
      expression.push(item);
    }
  })

  if(expression[0] === Infinity || isNaN(expression[0])){
    disabeleButtonsOnError();
    return "Cannot divide by zero";
  }

  if(expression[0] >= MAX_VALUE || expression[0] <= (MIN_VALUE)){
    disabeleButtonsOnError();
    return "Number out of range";
  }

  expression[0] = parseFloat(Math.round(Number(expression[0])*100)/100);
  return expression[0];
}

//Disable all buttons and the input bar except the clear button.
const disabeleButtonsOnError = () => {
  [...calculatorButton].forEach(button => {
    button.disabled = true;
  });
    
  inputBar.readOnly = true;
  document.getElementById("clearbutton").disabled = false;
}

//Enable all buttons and the input bar.
const enableAllButtons = () => {
  [...calculatorButton].forEach(button => {
    button.disabled = false;
  });

  inputBar.readOnly = false;
}



