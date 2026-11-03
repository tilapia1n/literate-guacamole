let display = document.getElementById('display');

let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function clearCalculator() {
  currentInput = '0';
  previousInput = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastDigit() {
  if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }

  updateDisplay();
}

function appendNumber(value) {
  if (shouldResetDisplay) {
    currentInput = value;
    shouldResetDisplay = false;
  } else {
    currentInput = currentInput === '0' ? value : currentInput + value;
  }

  updateDisplay();
}

function appendDecimal() {
  if (shouldResetDisplay) {
    currentInput = '0.';
    shouldResetDisplay = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }

  updateDisplay();
}

function setOperator(nextOperator) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }

  previousInput = currentInput;
  operator = nextOperator;
  shouldResetDisplay = true;
}

function calculate() {
  if (!previousInput || !operator) {
    return;
  }

  const firstValue = parseFloat(previousInput);
  const secondValue = parseFloat(currentInput);

  if (Number.isNaN(firstValue) || Number.isNaN(secondValue)) {
    return;
  }

  let result;

  switch (operator) {
    case '+':
      result = firstValue + secondValue;
      break;
    case '-':
      result = firstValue - secondValue;
      break;
    case '*':
      result = firstValue * secondValue;
      break;
    case '/':
      result = secondValue === 0 ? 'Error' : firstValue / secondValue;
      break;
    default:
      return;
  }

  currentInput = result === 'Error' ? 'Error' : String(result);
  previousInput = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleButtonPress(button) {
  const { action, value } = button.dataset;

  if (value !== undefined) {
    if (['+', '-', '*', '/'].includes(value)) {
      setOperator(value);
      return;
    }

    if (value === '.') {
      appendDecimal();
      return;
    }

    appendNumber(value);
    return;
  }

  if (action === 'clear') {
    clearCalculator();
  } else if (action === 'delete') {
    deleteLastDigit();
  } else if (action === 'equals') {
    calculate();
  }
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', () => handleButtonPress(button));
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    setOperator(key);
    return;
  }

  if (key === '.') {
    appendDecimal();
    return;
  }

  if (key === 'Enter' || key === '=') {
    calculate();
    return;
  }

  if (key === 'Backspace') {
    deleteLastDigit();
    return;
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();

