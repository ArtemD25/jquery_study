const DEFAULT_VALUE = '0';
const OPERATIONS = ['btn-divide', 'btn-subtract', 'btn-add', 'btn-multiply'];
const ERROR = 'ERROR';
const MAGIC_NUMBER = 48;

$(document).ready(function() {
  const input = $('#calc__input');
  const logList = $('#log__list');
  const calcData = {
    operand1: null,
    operator: null,
    operand2: null
  }
  resetCalc(true);
  
  
  $(document).on('click', evt => {
    if (input.hasClass('error')) {
      input.removeClass('error');
    }
    const target = $(evt.target);
    if (target.hasClass('calc__button')) {
      evaluateUserInput(evt, target);
    } else if (target.hasClass('log__circle')) {
      target.toggleClass('circle-full');
    } else if (target.hasClass('log__delete')) {
      target.closest('li.log__item').remove();
    }
  })
  
  logList.on('scroll', evt => {
    console.log(`Scroll Top: ${evt.target.scrollTop}`);
  })
  
  function evaluateUserInput(evt, target) {
    if (target.attr('data-calc') === 'btn-clear') {
      resetCalc(true);
    } else if (target.attr('data-calc') === 'btn-equals' && calcData.operand2) {
      evaluateAndRenderExpression(calcData);
    } else if (OPERATIONS.includes(target.attr('data-calc')) && !calcData.operand2) {
      calcData.operator = target.text();
      input.val(`${calcData.operand1} ${target.text()}`);
    } else if (target.hasClass('number') && !calcData.operator) {
      if (addDigitToOperand(target.text(), calcData.operand1)) {
        calcData.operand1 = addDigitToOperand(target.text(), calcData.operand1);
      }
      input.val(calcData.operand1);
    } else if (target.hasClass('number') && calcData.operator) {
      if (addDigitToOperand(target.text(), calcData.operand2)) {
        calcData.operand2 = addDigitToOperand(target.text(), calcData.operand2);
      }
      input.val(`${calcData.operand1} ${calcData.operator} ${calcData.operand2}`);
    }
  }
  
  $(document).on('keypress', (evt) => {
    if (calcData.operand2 && evt.key === 'Enter') {
      evaluateAndRenderExpression(calcData);
    }
  })
  
  function evaluateAndRenderExpression(data) {
    const result = calcResult(data);
    input.val(result);
    if (result === ERROR) {
      input.addClass('error');
    } else {
      renderLog(data, result);
    }
    resetCalc(false);
  }
  
  function addDigitToOperand(digit, totalNumber) {
    if (totalNumber === '0' && digit !== '0' || !totalNumber) {
      return digit;
    } else if (totalNumber && totalNumber !== '0') {
      return totalNumber + digit;
    }
    return false;
  }
  
  function calcResult(data) {
    if (data.operator === '/' && data.operand2 === '0') {
      return ERROR;
    }
    switch(data.operator) {
      case '*':
        return +data.operand1 * +data.operand2;
      case '/':
        return +data.operand1 / +data.operand2;
      case '+':
        return +data.operand1 + +data.operand2;
      case '-':
        return +data.operand1 - +data.operand2;
      default:
        return ERROR;
    }
  }
  
  function resetCalc(renderDefaultValue) {
    if (renderDefaultValue) {
      input.val(DEFAULT_VALUE);
    }
    calcData.operand1 = DEFAULT_VALUE;
    calcData.operator = null;
    calcData.operand2 = null;
  }
  
  function renderLog(data, result) {
    const circleBtn = jQuery('<button>', {
      class: 'log__circle'
    });
    const deleteBtn = jQuery('<button>', {
      class: 'log__delete'
    });
    const text = jQuery('<p>', {
      class: 'log__text',
      text: `${data.operand1} ${data.operator} ${data.operand2} = ${result}`
    });
    const li = jQuery('<li>', {
      class: 'log__item'
    });
    if (text.text().match(MAGIC_NUMBER)) {
      text.css({'text-decoration': 'underline'});
    }
    li.append(circleBtn, text, deleteBtn);
    logList.prepend(li);
  }
})