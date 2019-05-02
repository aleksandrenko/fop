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
        let sum = 0;

        for (let i = 0; this.entries.length > i; i++) {
            sum += this.entries[i].value;
        }

        return sum.toFixed(2);
    }

    getHTML = () => {
        let numbers = '';
        
        for (let i = 0; this.entries.length > i; i++) {
            let entity = this.entries[i];
            numbers += `
                <li>
                    <span>${entity.value.toFixed(2)}</span>
                    <button data-uuid=${entity.id} data-type="delete-entity-btn">delete</button>
                </li>
            `
        }
        
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
        for(let i = 0; this.entries.length > i; i++) {
            let entity = this.entries[i];

            if (entity.id === id) {
                this.entries.splice(i, 1);
            }
        };
        this.render();
    }
}

export default Adder;
