const showBar = document.getElementById("showBar");
const inputBar = document.getElementById("inputBar");
const notAlowedChars = /^[^0-9+\-/*\.]*$/;
const calculatorButtons = document.getElementsByClassName("calculatorButton");
const plusOperator = '+';
const minusOperator = '-';
const divideOperator = '/';
const multiOperator = '*';
const operatoesArray = [plusOperator, minusOperator, divideOperator, multiOperator];
const methods = {
  [minusOperator]: (a, b) => a - b,
  [plusOperator]: (a, b) => a + b,
  [multiOperator]: (a, b) => a * b,
  [divideOperator]: (a, b) => a / b,
};
const expressionArray = [];
const calculateAssistingArray = [];
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
  
  if(inputBar.value >= Math.pow(2, 53)){
    disabeledButtonsExeptClearAndInputBar();
    inputBar.value = "Number too big";
  }
}

//React to clicks on the clear button to reset the calculator.
const onClearButtonClick = () => {
  expressionArray.length = 0;
  showBar.innerHTML = "";
  inputBar.value = "";
  equalButtonClicked = false;
  enabledAllButtonsAndInputBar();
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
  inputBar.value = inputBar.value.replace(notAlowedChars,"");
  if(operatoesArray.includes(inputBar.value.at(-1))){
    addOperator(inputBar.value.at(-1));
  }else if(inputBar.value.at(-1) == "."){
    addPoint();
  }else if(inputBar.value.length >= 1 && !inputBar.value.includes(".")){
    inputBar.value = parseFloat(inputBar.value);
  }
}

//React to operators added by buttons or keyboard.
const addOperator = (operator) => {
  if(equalButtonClicked && inputBar.value.length !== 1){//Continue the expression with the result value.
    expressionArray.push(operator);
    showBar.innerHTML = expressionArray[0] + operator;
    inputBar.value = "";
    equalButtonClicked = false;
  }else if(inputBar.value.length === 1){
    if(showBar.innerHTML.length === 0){
      inputBar.value = "";
    }else{//Replace the operator in the display bar with the one that is currently selected for addition.
      expressionArray.pop();
      expressionArray.push(inputBar.value);
      showBar.innerHTML = showBar.innerHTML.slice(0, -1) + operator;
      inputBar.value = "";   
    }
  }else{//Add the expression in the input bar to the display bar.
    expressionArray.push(inputBar.value.slice(0, -1));
    expressionArray.push(operator);
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
    expressionArray.pop();
  }else{
    expressionArray.push(inputBar.value)
  }

  showBar.innerHTML = expressionArray.join("");
  inputBar.value = calculateExpression();
  calculateAssistingArray.length = 0;
  equalButtonClicked = true;
}

//Calculate the mathematical expression.
const calculateExpression = () => {
  if(expressionArray.length === 0){
    return "";
  }
  
  expressionArray.forEach((item, index) => {
    if(item == divideOperator || item == multiOperator){
      calculateAssistingArray.push(methods[item](+calculateAssistingArray.pop(), +expressionArray[index+1]));
      expressionArray.splice(index,1);     
    }else{
      calculateAssistingArray.push(item);
    }
  })

  expressionArray.length = 0;
  
  calculateAssistingArray.forEach((item, index) => {
    if(item == plusOperator || item == minusOperator){
      expressionArray.push(methods[item](+expressionArray.pop(), +calculateAssistingArray[index+1]));
      calculateAssistingArray.splice(index,1);  
    }else{
      expressionArray.push(item);
    }
  })

  if(expressionArray[0] === Infinity || isNaN(expressionArray[0])){
    disabeledButtonsExeptClearAndInputBar();
    return "Cannot divide by zero";
  }

  if(expressionArray[0] >= Math.pow(2, 53) || expressionArray[0] <= ((-1) * Math.pow(2, 53))){
    disabeledButtonsExeptClearAndInputBar();
    return "Number out of range";
  }
  
  expressionArray[0] = parseFloat(Math.round(Number(expressionArray[0])*100)/100);
  return expressionArray[0];
}

//Disable all buttons and the input bar except the clear button.
const disabeledButtonsExeptClearAndInputBar = () => {
  [...calculatorButtons].forEach(button => {
    button.disabled = true;
  });
    
  inputBar.readOnly = true;
  document.getElementById("clearbutton").disabled = false;
}

//Enable all buttons and the input bar.
const enabledAllButtonsAndInputBar = () => {
  [...calculatorButtons].forEach(button => {
    button.disabled = false;
  });

  inputBar.readOnly = false;
}



