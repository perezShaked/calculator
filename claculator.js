const SHOW_BAR = document.getElementById("showBar");
const INPUT_BAR = document.getElementById("inputBar");
const NOT_ALLOWED_CHARS = /^[^0-9+\-/*\.]*$/;
const CALCULATOR_BUTTONS = document.getElementsByClassName("calculatorButton");
const PLUS_OPERATOR = '+';
const MINUS_OPERATOR = '-';
const DIVIDE_OPERATOR = '/';
const MULTI_OPERATOR = '*';
const OPERATORS = [PLUS_OPERATOR, MINUS_OPERATOR, DIVIDE_OPERATOR, MULTI_OPERATOR];
const MAX_VALUE = Math.pow(2, 53);
const MIN_VALUE = (-1) * Math.pow(2, 53);
const METHODS = {
  [MINUS_OPERATOR]: (a, b) => a - b,
  [PLUS_OPERATOR]: (a, b) => a + b,
  [MULTI_OPERATOR]: (a, b) => a * b,
  [DIVIDE_OPERATOR]: (a, b) => a / b,
};
const EXPRESSION = [];
const CALCULATE_ASSISTING = [];
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

  INPUT_BAR.value = INPUT_BAR.value + buttenValue;
  checkInputBar();
}

//React to clicks on the clear button to reset the calculator.
const onClearButtonClick = () => {
  EXPRESSION.length = 0;
  SHOW_BAR.innerHTML = "";
  INPUT_BAR.value = "";
  equalButtonClicked = false;
  enableAllButtons();
}

//React to clicks on the delete button.
const onDeleteButtonClick = () => {
  if(equalButtonClicked){
    onClearButtonClick(); 
  }

  INPUT_BAR.value = INPUT_BAR.value.slice(0, -1);
}

//Add the operator or point that the user clicks on.
const onOperatorOrPointButtonClick = (innerHTML) => {
  INPUT_BAR.value += innerHTML;
  checkInputBar();
}

//Check the value in the input bar after adding by the buttons or keyboard.
const checkInputBar = () => {
  if(INPUT_BAR.value >= MAX_VALUE){
    disabeleButtonsOnError();
    INPUT_BAR.value = "Number too big";
  }else{
    INPUT_BAR.value = INPUT_BAR.value.replace(NOT_ALLOWED_CHARS,"");
    if(OPERATORS.includes(INPUT_BAR.value.at(-1))){
      addOperator(INPUT_BAR.value.at(-1));
    }else if(INPUT_BAR.value.at(-1) == "."){
      addPoint();
    }else if(INPUT_BAR.value.length >= 1 && !INPUT_BAR.value.includes(".")){
      INPUT_BAR.value = parseFloat(INPUT_BAR.value);
    }
  }
}

//React to operators added by buttons or keyboard.
const addOperator = (operator) => {
  if(equalButtonClicked && INPUT_BAR.value.length !== 1){//Continue the expression with the result value.
    EXPRESSION.push(operator);
    SHOW_BAR.innerHTML = EXPRESSION[0] + operator;
    INPUT_BAR.value = "";
    equalButtonClicked = false;
  }else if(INPUT_BAR.value.length === 1){
    if(SHOW_BAR.innerHTML.length === 0){
      INPUT_BAR.value = "";
    }else{//Replace the operator in the display bar with the one that is currently selected for addition.
      EXPRESSION.pop();
      EXPRESSION.push(INPUT_BAR.value);
      SHOW_BAR.innerHTML = SHOW_BAR.innerHTML.slice(0, -1) + operator;
      INPUT_BAR.value = "";   
    }
  }else{//Add the expression in the input bar to the display bar.
    EXPRESSION.push(INPUT_BAR.value.slice(0, -1));
    EXPRESSION.push(operator);
    SHOW_BAR.innerHTML += INPUT_BAR.value;
    INPUT_BAR.value = "";
  }
}

//React to point added by button or keyboard.
const addPoint = () => {
  if(equalButtonClicked){
    onClearButtonClick(); 
  }

  if(INPUT_BAR.value.slice(0,-1).includes(".")){
    INPUT_BAR.value = INPUT_BAR.value.slice(0, -1);
  }

  if(INPUT_BAR.value.length === 1){
    INPUT_BAR.value = '0.';
  }
}

//React to clicks on the equal button or pressing enter.
const onEqualButtonClick = () => {
  if(equalButtonClicked){
    return;
  }

  if(INPUT_BAR.value.length === 0){
    EXPRESSION.pop();
  }else{
    EXPRESSION.push(INPUT_BAR.value)
  }

  SHOW_BAR.innerHTML = EXPRESSION.join("");
  INPUT_BAR.value = calculateExpression();
  CALCULATE_ASSISTING.length = 0;
  equalButtonClicked = true;
}

//Calculate the mathematical expression.
const calculateExpression = () => {
  if(EXPRESSION.length === 0){
    return "";
  }

  let skipNext = false;

  EXPRESSION.forEach((item, index) => {
    if(skipNext){
      skipNext = false;
    }else if(item == DIVIDE_OPERATOR || item == MULTI_OPERATOR){
      CALCULATE_ASSISTING.push(METHODS[item](+CALCULATE_ASSISTING.pop(), +EXPRESSION[index+1]));
      skipNext = true;    
    }else{
      CALCULATE_ASSISTING.push(item);
    }
  })

  EXPRESSION.length = 0;
  
  CALCULATE_ASSISTING.forEach((item, index) => {
    if(skipNext){
      skipNext = false;
    }else if(item == PLUS_OPERATOR || item == MINUS_OPERATOR){
      EXPRESSION.push(METHODS[item](+EXPRESSION.pop(), +CALCULATE_ASSISTING[index+1]));
      skipNext = true; 
    }else{
      EXPRESSION.push(item);
    }
  })

  if(EXPRESSION[0] === Infinity || isNaN(EXPRESSION[0])){
    disabeleButtonsOnError();
    return "Cannot divide by zero";
  }

  if(EXPRESSION[0] >= MAX_VALUE || EXPRESSION[0] <= (MIN_VALUE)){
    disabeleButtonsOnError();
    return "Number out of range";
  }

  EXPRESSION[0] = parseFloat(Math.round(Number(EXPRESSION[0])*100)/100);
  return EXPRESSION[0];
}

//Disable all buttons and the input bar except the clear button.
const disabeleButtonsOnError = () => {
  [...CALCULATOR_BUTTONS].forEach(button => {
    button.disabled = true;
  });
    
  INPUT_BAR.readOnly = true;
  document.getElementById("clearbutton").disabled = false;
}

//Enable all buttons and the input bar.
const enableAllButtons = () => {
  [...CALCULATOR_BUTTONS].forEach(button => {
    button.disabled = false;
  });

  INPUT_BAR.readOnly = false;
}



