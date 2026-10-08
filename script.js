const previousOperand = document.getElementById('previous-operand');
const currentOperand = document.getElementById('current-operand');
const buttons = document.querySelectorAll('.button');

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentOperand.textContent = currentValue;
  previousOperand.textContent = previousValue
    ? `${previousValue} ${operator ?? ''}`
    : '0';
}

function clearCalculator() {
  currentValue = '0';
  previousValue = '';
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLast() {
  if (currentValue.length > 1) {
    currentValue = currentValue.slice(0, -1);
  } else {
    currentValue = '0';
  }
  updateDisplay();
}

function appendNumber(number) {
  if (currentValue === '0' || shouldResetDisplay) {
    currentValue = number;
    shouldResetDisplay = false;
  } else {
    currentValue += number;
  }
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function chooseOperator(nextOperator) {
  if (currentValue === '') return;

  if (previousValue !== '' && operator !== null && !shouldResetDisplay) {
    performCalculation();
  }

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetDisplay = true;
  updateDisplay();
}

function performCalculation() {
  if (previousValue === '' || operator === null) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      result = current === 0 ? 'Error' : prev / current;
      break;
    case '%':
      result = (prev * current) / 100;
      break;
    default:
      return;
  }

  if (result === 'Error') {
    currentValue = 'Error';
    previousValue = '';
    operator = null;
  } else {
    currentValue = String(result);
    previousValue = '';
    operator = null;
  }

  shouldResetDisplay = true;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    switch (action) {
      case 'number':
        appendNumber(value);
        break;
      case 'decimal':
        appendDecimal();
        break;
      case 'operator':
        chooseOperator(value);
        break;
      case 'equals':
        performCalculation();
        break;
      case 'clear':
        clearCalculator();
        break;
      case 'delete':
        deleteLast();
        break;
      default:
        break;
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  }

  if (key === '.') {
    appendDecimal();
  }

  if (['+', '-', '*', '/'].includes(key)) {
    chooseOperator(key);
  }

  if (key === '%') {
    chooseOperator('%');
  }

  if (key === 'Enter' || key === '=') {
    performCalculation();
  }

  if (key === 'Backspace') {
    deleteLast();
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
