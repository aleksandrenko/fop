import Entity from './Entity.js';

class NumberInput extends Entity {
    constructor(domSelector, changeHandler) {
        super();

        this.value = '';
        this.parentDomElementSelector = domSelector;
        this.onChange = changeHandler;

        document.addEventListener("keydown", this._onKeyDown);
        document.addEventListener("click", (e) => {
            if(e.target.id === ('button-' + this.id)) {
                this._onSubmit();
            }
        });

        this.render();
    }

    _onSubmit = () => {
        if (this.value !== ''
            && parseFloat(this.value) !== 0 
            && this.onChange
        ) {
            this.onChange(parseFloat(this.value));
            this.value = '';
            this.render();
        }
    }

    _onKeyDown = (e) => {
        if (e.code === 'Enter') {
            this._onSubmit();
            return;
        }

        //limit the input to D*.DD
        if (e.target.id === this.id && e.code.slice(0, -1) !== 'Key') {
            const newValue = this.value + e.key;

            if (e.key === 'Backspace') {
                this.value = this.value.slice(0, -1);
            }

            const isValid = /^\d*\.?\d*$/.test(newValue);

            const canHaveDecimalParts = newValue.split('.')[1]
                ? newValue.split('.')[1].length <= 2
                : true;

            if (isValid && canHaveDecimalParts) {
                this.value = newValue;
            }
        }
        
        this.render();
    }

    getHTML = () => {
        return `
            <input type="text" placeholder="0.00" id=${this.id} value="${this.value}" />
            <button type="button" id="button-${this.id}">Add number</button>
        `;
    }

    render = () => {
        window.requestAnimationFrame(() => {
            const $parent = document.querySelector(this.parentDomElementSelector);
            if ($parent) {
                $parent.innerHTML = this.getHTML();
                $parent.querySelector('input').focus();
            }
        });
    }
}

export default NumberInput;