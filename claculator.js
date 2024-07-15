

const showBar = document.getElementById("showBar");
const inputBar = document.getElementById("inputBar");
const notAlowedChars = /^[^0-9+\-/*\.]*$/;
const calculatorButtons = document.getElementsByClassName("calculatorButton");
let expressionArray = [];
let equalButtonClicked = false;

//React to the 'Escape' and 'Enter' key presses.
document.addEventListener('keydown', (event) => {
  if(event.key === "Escape") {
    clearButtonClick();
  }
  if(event.key === "Enter"){
    equalButtonClick();
  }
});

//React to clicks on the numbers buttons.
const numberButtonClick = (buttenValue) => {
  if(equalButtonClicked){
    clearButtonClick(); 
  }
  inputBar.value = inputBar.value + buttenValue;
  checkInputBar();
}

//React to clicks on the clear button.
const clearButtonClick = () => {
  expressionArray = [];
  showBar.innerHTML = "";
  inputBar.value = "";
  equalButtonClicked = false;
  for(let button of calculatorButtons){
    button.disabled = false;
  }
}

//React to clicks on the delete button.
const deleteButtonClick = () => {
  inputBar.value = inputBar.value.slice(0, -1);
}

//Add the operator or point that the user clicks on.
const operatorOrPointButtonClick = (innerHTML) => {
  inputBar.value += innerHTML;
  checkInputBar();
}

//Check the value in the input bar after adding by the buttons or keyboard.
const checkInputBar = () => {
  inputBar.value = inputBar.value.replace(notAlowedChars,"");
  if(['+','-','*','/'].includes(inputBar.value.at(-1))){
    operatorCharAdd(inputBar.value.at(-1));
  }else if(inputBar.value.at(-1) == "."){
    pointCharAdd();
  }else if(inputBar.value.length >= 2 && !inputBar.value.includes(".")){
    inputBar.value = parseFloat(inputBar.value);
  }
}

//React to operators added by buttons or keyboard.
const operatorCharAdd = (char) => {
  if(equalButtonClicked){
    expressionArray.push(char);
    showBar.innerHTML = expressionArray[0] + char;
    inputBar.value = "";
    equalButtonClicked = false;
  }else if(inputBar.value.length === 1){
    if(showBar.innerHTML.length === 0){
      inputBar.value = "";
    }else{
      expressionArray.pop();
      expressionArray.push(inputBar.value);
      showBar.innerHTML = showBar.innerHTML.slice(0, -1) + char;
      inputBar.value = "";   
    }
  }else{
    expressionArray.push(inputBar.value.slice(0, -1));
    expressionArray.push(char);
    showBar.innerHTML += inputBar.value;
    inputBar.value = "";
  }
}

//React to point added by button or keyboard.
const pointCharAdd = () => {
  if(inputBar.value.slice(0,-1).includes(".") || inputBar.value.length === 1){
    inputBar.value = inputBar.value.slice(0, -1);
  }
}

//React to clicks on the equal button or pressing enter.
const equalButtonClick = () => {
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
  equalButtonClicked = true;
}

//Calculate the mathematical expression.
const calculateExpression = () => {
  const methods = {
    "-": (a, b) => a - b,
    "+": (a, b) => a + b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };

  if(expressionArray.length === 0){
    return "";
  }

  for(let i = 0; i < expressionArray.length; i++){
    if(expressionArray[i] == "/" || expressionArray[i] == "*"){
      expressionArray[i - 1] = methods[expressionArray[i]](+expressionArray[i-1],+expressionArray[i+1]);
      expressionArray.splice(i,2);
      i--;
    }
  }
  for(let i = 0; i < expressionArray.length; i++){
    if(expressionArray[i] == "-" || expressionArray[i] == "+"){
      expressionArray[i - 1] = methods[expressionArray[i]](+expressionArray[i-1],+expressionArray[i+1]);
      expressionArray.splice(i,2);
      i--;
    }
  }
  if(expressionArray[0] === Infinity || isNaN(expressionArray[0])){
    disabeledButtonsExeptClear();
    return "Cannot divide by zero";
  }
  expressionArray[0] = Number(expressionArray[0]).toFixed(2)
  let result = expressionArray[0];
  return parseFloat(result);
}

//Disable all buttons except the clear button.
const disabeledButtonsExeptClear = () => {
    for(let button of calculatorButtons){
      button.disabled = true;
    }
    document.getElementById("clearbutton").disabled = false;
}



