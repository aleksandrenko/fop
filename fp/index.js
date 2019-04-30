
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

const getUUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

const on = (domEvent) => new Promise((resolve, reject) => {
  document.addEventListener(domEvent, resolve);
});

const selectDomElement = (domSelector) => () => new Promise((resolve, reject) => {
  const $element = document.querySelector(domSelector);

  !$element && reject(`No dom element with selector: ${domSelector}`);
  $element && resolve($element);
});

const updateInnerHTML = (html) => ($element) => new Promise((resolve, reject) => {
  $element.innerHTML = html;
  resolve($element);
});

const render = (numbers) => {
  const numbersHTML = numbers
  .map(number => `
    <li id=${number.id}>
      <span>${number.value.toFixed(2)}</span>
      <button id=${number.id} data-type="delete-entity-btn">delete</button>
    </li>
  `)
  .join('');
  document.querySelector('#nma-panel-content-main-numbers').innerHTML = numbersHTML;

  const sum = numbers
    .map(number => number.value)
    .reduce((sum, number) => sum + number, 0)
    .toFixed(2);

  document.querySelector('#nma-panel-content-main-summary').innerHTML = sum;
}

const startListeningForUserInput = ($element) => {
  let value = '';
  let numbers = [];

  $element.addEventListener('click', (e) => {
    if (e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'delete-entity-btn') {
      numbers = numbers.filter(number => number.id !== e.target.id);

      render(numbers);
    }

    if (e.target.id === 'nma-number-add-btn') {
      const $input = document.querySelector('#nma-number-input');
      const newNumberValue = parseFloat($input.value);

      if (!newNumberValue) {
        return; 
      }

      numbers.unshift({
        id: getUUID(),
        value: newNumberValue
      });

      //reset input value and ui
      $input.value = '';
      value = '';

      render(numbers);
    }
  });

  $element
    .querySelector('#nma-number-input')
    .addEventListener('keydown', (e) => {
      e.preventDefault();
      const $input = document.querySelector('#nma-number-input')
      const newValue = value + e.key;

      if (e.key === 'Backspace') {
          value = value.slice(0, -1);
      }

      const isValid = /^\d*\.?\d*$/.test(newValue);

      const canHaveDecimalParts = newValue.split('.')[1]
          ? newValue.split('.')[1].length <= 2
          : true;

      if (isValid && canHaveDecimalParts) {
          value = newValue;
      }

      $input.value = value;
    });
}

on('DOMContentLoaded')
  .then(selectDomElement('#fp'))
  .then(updateInnerHTML(HTML))
  .then(startListeningForUserInput)
  .catch((error) => {
    console.error(error);
  });

