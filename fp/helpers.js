import { getUUID } from './utils.js';

export function sumNumbers(numbers) {
    return numbers
        .map(number => number.value)
        .reduce((sum, number) => sum + number, 0)
        .toFixed(2);
}

export function createNumbersListElements(numbers) {
    return numbers.map(number => `
      <li id=${number.id}>
        <span>${number.value.toFixed(2)}</span>
        <button id=${number.id} data-type="delete-entity-btn">delete</button>
      </li>
    `)
    .join('');
}

export function isDeleteItemBtn(e) {
    return e.target.attributes['data-type'] && e.target.attributes['data-type'].value === 'delete-entity-btn';
}

export function isAddButton(e) {
    return e.target.id === 'nma-number-add-btn';
}

export function filterOutNumbers(collection, idToFilterOut) {
    return collection.filter(number => number.id !== idToFilterOut);
}

export function addNewNumber(collection, newNumberValue) {
    if (!newNumberValue) {
        return collection
    }

    return [{
        id: getUUID(),
        value: newNumberValue
    }].concat(collection);
}
