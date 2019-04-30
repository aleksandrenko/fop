export function updateElementHTMLEffect(domSelector, html) {
  const $element = document.querySelector(domSelector);

  $element
    ? $element.innerHTML = html
    : console.error(`No dom element with selector: ${domSelector}`);
}

export function getInputValueEffect(selector) {
  const $element = document.querySelector(selector);
  return $element.value;
}

export function setInputValueEffect(selector, value) {
  const $element = document.querySelector(selector);
  $element.value = value;
}
