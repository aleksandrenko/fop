import UTILS from './utils.js';

import NumberInput from './NumberInput.js';
import Number from './Number.js';

class Adder {
    constructor(domSelector) {
        this.parentDomElementSelector = domSelector;
        this.entries = [];
        this.numberInput = new NumberInput('#nma-panel-content-aside', this.addNumber);

        document.addEventListener("DOMContentLoaded", this._init);
    }

    _init = () => {
        const $parent = document.querySelector(this.parentDomElementSelector);
        $parent.addEventListener("click", this._onClick);

        document.removeEventListener("DOMContentLoaded", this._init);

        this.render();
    }

    _onClick = (e) => {
        const target = e.target;
        const type = UTILS.attrVal(target, 'data-type');
        const id = UTILS.attrVal(target, 'data-uuid');
        
        if (type === 'delete-entity-btn') {
            this.removeNumber(id);
        }
    }

    getSum = () => {
        return this.entries
            .map(entry => entry.value)
            .reduce((sum, number) => sum + number, 0)
            .toFixed(2);
    }

    getHTML = () => { 
        const numbers = this.entries
            .map(entity =>`
                <li>
                    <span>${entity.value.toFixed(2)}</span>
                    <button data-uuid=${entity.id} data-type="delete-entity-btn">delete</button>
                </li>
            `)
            .join('');

        // Its always rerendering the whole html. Can be optimized.
        return `
            <main class="nma-panel">
                <header class="nma-panel-header">ADDING NUMBERS IS HARD!</header>
                <section class="nma-panel-content">
                    <section class="nma-panel-content-main">
                        <ol class="nma-panel-content-main-numbers">
                            ${numbers}
                        </ol>
                        <div class="nma-panel-content-main-summary">
                            ${this.getSum()}
                        </div>
                    </section>
                    <aside class="nma-panel-content-aside" id="nma-panel-content-aside" />
                </section>
            </main>
        `
    };

    render = () => {
        window.requestAnimationFrame(() => {
            const $parent = document.querySelector(this.parentDomElementSelector);
            $parent.innerHTML = this.getHTML();
            this.numberInput.render();
        });
    }

    addNumber = (value) => {
        const number = new Number(value);
        this.entries.unshift(number);
        this.render();
    }

    removeNumber = (id) => {
        this.entries = this.entries.filter((entity) => entity.id !== id);
        this.render();
    }
}

export default Adder;
