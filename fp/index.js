import { HTML } from './html.js';
import {
  pipe,
  getDataState,
  preventDefaultEvent,
  filterEventTarget,
  eventTargetIdSelector,
  getDataFromEvent
} from './utils.js';

import {
  updateElementHTMLEffect,
  getInputValueEffect,
  setInputValueEffect
} from './effects.js';

import {
  sumNumbers,
  createNumbersListElements,
  isDeleteItemBtn,
  isAddButton,
  filterOutNumbers,
  addNewNumber
} from './helpers.js';

let state = {
  numbers: [],
  newNumber: ''
};

function updateStateEffect(updateFn, id) {
  state = {
    numbers: updateFn(state.numbers, id),
    newNumber: ''
  };

  return state;
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

const deleteNumber = pipe(
  filterEventTarget.bind(null, isDeleteItemBtn),
  getDataFromEvent.bind(null, eventTargetIdSelector),
  updateStateEffect.bind(null, filterOutNumbers),
  updateUI
);

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

function updateUI (state) {
  updateNumberList(state);
  updateSum(state);
}

//setup the app
document.addEventListener('DOMContentLoaded', () => {
  try {
    const appDomElementSelector = '#fp';
    const createAppHTML = updateElementHTMLEffect.bind(null, appDomElementSelector);

    createAppHTML(HTML);

    const $element = document.querySelector(appDomElementSelector);
    const $numberInput = $element.querySelector('#nma-number-input');

    $element.addEventListener('click', deleteNumber);
    $element.addEventListener('click', addNumber);

    $numberInput.addEventListener('keydown', updateInputUI);
  } catch (err) {
    console.log(err);
  }
});
