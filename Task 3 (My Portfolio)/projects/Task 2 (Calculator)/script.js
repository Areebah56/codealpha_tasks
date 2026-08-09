const currentOperandEl = document.getElementById('currentOperand');
const prevOperandEl = document.getElementById('prevOperand');
const tapeEl = document.getElementById('tape');
const keys = document.querySelectorAll('.key');

let currentOperand = '0';
let previousOperand = '';
let operation = null;
let justEvaluated = false;

const MAX_DIGITS = 14;

function formatNumber(numStr) {
  if (numStr === '' || numStr === undefined) return '';
  const [intPart, decPart] = numStr.split('.');
  const negative = intPart.startsWith('-');
  const digits = negative ? intPart.slice(1) : intPart;
  const withCommas = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = negative ? '-' : '';
  return decPart !== undefined
    ? `${sign}${withCommas}.${decPart}`
    : `${sign}${withCommas}`;
}

function updateDisplay() {
  currentOperandEl.textContent = formatNumber(currentOperand);
  prevOperandEl.textContent = previousOperand && operation
    ? `${formatNumber(previousOperand)} ${operation}`
    : '';
}

function inputNumber(digit) {
  if (justEvaluated) {
    currentOperand = digit;
    justEvaluated = false;
    return;
  }
  if (currentOperand.replace('-', '').replace('.', '').length >= MAX_DIGITS) return;
  currentOperand = currentOperand === '0' ? digit : currentOperand + digit;
}

function inputDecimal() {
  if (justEvaluated) {
    currentOperand = '0.';
    justEvaluated = false;
    return;
  }
  if (!currentOperand.includes('.')) {
    currentOperand += '.';
  }
}

function chooseOperator(op) {
  if (currentOperand === '' && previousOperand === '') return;

  if (previousOperand !== '' && currentOperand !== '' && !justEvaluated) {
    evaluate();
  }

  operation = op;
  previousOperand = currentOperand;
  currentOperand = '0';
  justEvaluated = false;
}

function compute(a, b, op) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? null : a / b;
    default: return b;
  }
}

function roundResult(num) {
  return Math.round((num + Number.EPSILON) * 1e10) / 1e10;
}

function evaluate() {
  if (operation === null || previousOperand === '') return;

  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  const result = compute(prev, curr, operation);

  if (result === null) {
    currentOperand = 'Error';
    previousOperand = '';
    operation = null;
    justEvaluated = true;
    updateDisplay();
    return;
  }

  const expression = `${formatNumber(previousOperand)} ${operation} ${formatNumber(currentOperand)}`;
  const resultStr = roundResult(result).toString();

  addTapeEntry(expression, formatNumber(resultStr));

  currentOperand = resultStr;
  previousOperand = '';
  operation = null;
  justEvaluated = true;
}

function clearAll() {
  currentOperand = '0';
  previousOperand = '';
  operation = null;
  justEvaluated = false;
}

function backspace() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  currentOperand = currentOperand.length > 1 ? currentOperand.slice(0, -1) : '0';
}

function applyPercent() {
  if (currentOperand === 'Error') return;
  currentOperand = roundResult(parseFloat(currentOperand) / 100).toString();
}

function addTapeEntry(expression, result) {
  const entry = document.createElement('div');
  entry.className = 'tape-entry';
  entry.innerHTML = `<span>${expression}</span><span>= ${result}</span>`;
  tapeEl.prepend(entry);
  while (tapeEl.children.length > 20) {
    tapeEl.removeChild(tapeEl.lastChild);
  }
}

function pressAnim(el) {
  if (!el) return;
  el.classList.add('pressed');
  setTimeout(() => el.classList.remove('pressed'), 90);
}

function handleAction(action, dataset, el) {
  if (currentOperand === 'Error' && action !== 'clear') {
    clearAll();
  }
  switch (action) {
    case 'number': inputNumber(dataset.num); break;
    case 'decimal': inputDecimal(); break;
    case 'operator': chooseOperator(dataset.op); break;
    case 'equals': evaluate(); break;
    case 'clear': clearAll(); break;
    case 'backspace': backspace(); break;
    case 'percent': applyPercent(); break;
  }
  pressAnim(el);
  updateDisplay();
}

keys.forEach(key => {
  key.addEventListener('click', () => {
    handleAction(key.dataset.action, key.dataset, key);
  });
});

const OP_MAP = { '+': '+', '-': '−', '*': '×', '/': '÷' };

document.addEventListener('keydown', (e) => {
  const key = e.key;

  if (/^[0-9]$/.test(key)) {
    handleAction('number', { num: key }, findKey(`[data-num="${key}"]`));
  } else if (key === '.') {
    handleAction('decimal', {}, findKey('[data-action="decimal"]'));
  } else if (['+', '-', '*', '/'].includes(key)) {
    const op = OP_MAP[key];
    handleAction('operator', { op }, findKey(`[data-op="${op}"]`));
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    handleAction('equals', {}, findKey('[data-action="equals"]'));
  } else if (key === 'Backspace') {
    handleAction('backspace', {}, findKey('[data-action="backspace"]'));
  } else if (key === 'Escape') {
    handleAction('clear', {}, findKey('[data-action="clear"]'));
  } else if (key === '%') {
    handleAction('percent', {}, findKey('[data-action="percent"]'));
  }
});

function findKey(selector) {
  return document.querySelector(selector);
}

updateDisplay();
