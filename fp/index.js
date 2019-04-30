
const HTML = `
  <main class="nma-panel">
    <header class="nma-panel-header">ADDING NUMBERS IS HARD!</header>
    <section class="nma-panel-content">
      <section class="nma-panel-content-main">
        <ol class="nma-panel-content-main-numbers" id="nma-panel-content-main-numbers"></ol>
        <div class="nma-panel-content-main-summary" id="nma-panel-content-main-summary">0.00</div>
      </section>
      <aside class="nma-panel-content-aside">
        <input id="nma-number-input" placeholder="0.00" type="text" />
        <button id="nma-number-add-btn">Add number</button>
      </aside>
    </section>
  </main>
`;

const pipe = (...fns) => (initialValue) => {
  return fns.reduce((value, fn) => fn(value), initialValue);
};

let uuid = 1;
const getUUID = () => `uuid-${++uuid}`;

let state = {
  numbers: [],
  newNumber: ''
}

function getDataState (stateKey, state) {
  return state[stateKey];
}

function sumNumbers (numbers) { 
  return numbers
    .map(number => number.value)
    .reduce((sum, number) => sum + number, 0)
    .toFixed(2);
}

function updateElementHTMLEffect (domSelector, html) {
  const $element = document.querySelector(domSelector);

  $element 
    ? $element.innerHTML = html
    : console.error(`No dom element with selector: ${domSelector}`);
}

function createNumbersListElements (numbers) {
  return numbers.map(number => `
    <li id=${number.id}>
      <span>${number.value.toFixed(2)}</span>
      <button id=${number.id} data-type="delete-entity-btn">delete</button>
    </li>
  `)
  .join('');
}

const getNumbers = getDataState.bind(null, 'numbers');

const updateSum = pipe(
  getNumbers,
  sumNumbers,
  updateElementHTMLEffect.bind(null, '#nma-panel-content-main-summary')
);

const updateNumberList = pipe(
  getNumbers,
  createNumbersListElements,
  updateElementHTMLEffect.bind(null, '#nma-panel-content-main-numbers')
);

const updateUI = (state) => {
  updateNumberList(state);
  updateSum(state);
}

function isDeleteItemBtn (e) {
  return e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'delete-entity-btn';
}

function isAddButton (e) {
  return e.target.id === 'nma-number-add-btn';
}

function filterEventTarget (filterFn, e) {
  if (filterFn(e)) {
    return e;
  } else {
    const PIPE_ERROR = new Error('Filter function stop execution.');
    PIPE_ERROR.code = 'PIPE_ERROR';

    throw PIPE_ERROR;
  }
}

function eventTargetIdSelector (e) {
  return e.target.id;
}

function getDataFromEvent (selectorFn, e) {
  return selectorFn(e);
}

function filterOutNumbers (collection, idToFilterOut) {
  return collection.filter(number => number.id !== idToFilterOut);
}

function updateStateEffect (updateFn, id) {
  state = {
    numbers: updateFn(state.numbers, id),
    newNumber: ''
  };
  return state;
}

const deleteNumber = pipe(
  filterEventTarget.bind(null, isDeleteItemBtn),
  getDataFromEvent.bind(null, eventTargetIdSelector),
  updateStateEffect.bind(null, filterOutNumbers),
  updateUI
);

function addNewNumber (collection, newNumberValue) {
  if (!newNumberValue) {
    return collection
  }

  return [{
    id: getUUID(),
    value: newNumberValue
  }].concat(collection);
}

function getInputValueEffect (selector) {
  const $element = document.querySelector(selector);
  return $element.value;
}

function setInputValueEffect (selector, value) {
  const $element = document.querySelector(selector);
  $element.value = value;
}

function preventDefaultEvent (e) {
  e.preventDefault();
  return e;
}

const addNumber = pipe(
  filterEventTarget.bind(null, isAddButton),
  getInputValueEffect.bind(null, '#nma-number-input'),
  parseFloat,
  updateStateEffect.bind(null, addNewNumber),
  updateUI,
  setInputValueEffect.bind(null, '#nma-number-input', ''),
);

const updateInputUI = pipe(
  preventDefaultEvent,
  (e) => {
    const newValue = state.newNumber + e.key;

    if (e.key === 'Backspace') {
        state.newNumber = state.newNumber.slice(0, -1);
    }

    const isValid = /^\d*\.?\d*$/.test(newValue);

    const canHaveDecimalParts = newValue.split('.')[1]
        ? newValue.split('.')[1].length <= 2
        : true;

    if (isValid && canHaveDecimalParts) {
      state.newNumber = newValue;
    }
    return state.newNumber;
  },
  setInputValueEffect.bind(null, '#nma-number-input')
);

document.addEventListener('DOMContentLoaded', () => {
  const appDomElementSelector = '#fp';
  const createAppHTML = updateElementHTMLEffect.bind(null, appDomElementSelector);

  createAppHTML(HTML);
  
  const $element = document.querySelector(appDomElementSelector);
  const $numberInput = $element.querySelector('#nma-number-input');

  $element.addEventListener('click', deleteNumber);
  $element.addEventListener('click', addNumber);

  $numberInput.addEventListener('keydown', updateInputUI);
});
