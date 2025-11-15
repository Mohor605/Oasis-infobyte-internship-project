let currentInput = '';
let expression = '';
let lastAnswer = 0;

const resultDisplay = document.getElementById('result');
const expressionDisplay = document.getElementById('expression');

function updateDisplay() {
    resultDisplay.textContent = currentInput || '0';
    expressionDisplay.textContent = expression;
}

function appendNumber(num) {
    if (currentInput === '0' && num !== '.') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    if (currentInput === '' && expression === '' && op !== '(' && op !== ')') {
        return;
    }
    
    if (op === '(' || op === ')') {
        expression += op;
        currentInput = '';
    } else {
        if (currentInput !== '' || expression.slice(-1) === ')') {
            expression += op;
            currentInput = '';
        }
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    expression = '';
    updateDisplay();
}

function deleteLast() {
    if (currentInput !== '') {
        currentInput = currentInput.slice(0, -1);
        expression = expression.slice(0, -1);
    } else if (expression !== '') {
        expression = expression.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    if (expression === '') return;
    
    try {
        let evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        
        let result = eval(evalExpression);
        
        if (result === Infinity || result === -Infinity) {
            currentInput = 'Error';
            expression = '';
        } else {
            result = Math.round(result * 100000000) / 100000000;
            lastAnswer = result;
            currentInput = result.toString();
            expression = '';
        }
    } catch (error) {
        currentInput = 'Error';
        expression = '';
    }
    
    updateDisplay();
}

function calculateSquareRoot() {
    if (currentInput === '') return;
    
    try {
        let num = parseFloat(currentInput);
        if (num < 0) {
            currentInput = 'Error';
            expression = '';
        } else {
            let result = Math.sqrt(num);
            result = Math.round(result * 100000000) / 100000000;
            lastAnswer = result;
            currentInput = result.toString();
            expression = '';
        }
    } catch (error) {
        currentInput = 'Error';
        expression = '';
    }
    
    updateDisplay();
}

function calculatePercentage() {
    if (currentInput === '') return;
    
    try {
        let num = parseFloat(currentInput);
        let result = num / 100;
        result = Math.round(result * 100000000) / 100000000;
        lastAnswer = result;
        currentInput = result.toString();
        expression = '';
    } catch (error) {
        currentInput = 'Error';
        expression = '';
    }
    
    updateDisplay();
}

function getAnswer() {
    currentInput = lastAnswer.toString();
    expression += lastAnswer.toString();
    updateDisplay();
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === '(' || key === ')') {
        appendOperator(key);
    }
});

updateDisplay();