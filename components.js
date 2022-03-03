/*jshint esversion: 6 */
const smButton = document.createElement('template')
smButton.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}       
:host{
    display: inline-flex;
    width: auto;
    --background-color: 255, 255, 255;
    --padding: 0.6rem 1.2rem;
    --border-radius: 0.3rem;
    --background: rgba(var(--text-color, (17,17,17)), 0.1);
}
:host([variant='primary']) .button{
    background: var(--accent-color,teal);
    color: rgba(var(--background-color, (255,255,255)), 1);
}
:host([variant='outlined']) .button{
            box-shadow: 0 0 0 1px rgba(var(--text-color, (17,17,17)), 0.2) inset;
    background: transparent; 
    color: var(--accent-color,teal);
}
:host([variant='no-outline']) .button{
    background: inherit; 
    color: var(--accent-color,teal);
}
:host([disabled]){
    pointer-events: none;
    cursor: not-allowed;
}
.button {
    position: relative;
    display: flex;
    width: 100%;
    padding: var(--padding);
    cursor: pointer;
            user-select: none;
    border-radius: var(--border-radius); 
            justify-content: center;
    transition: box-shadow 0.3s, background-color 0.3s;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 500;
    background-color: var(--background); 
    -webkit-tap-highlight-color: transparent;
    outline: none;
    overflow: hidden;
    border: none;
    color: inherit;
    align-items: center;
}
:host([disabled]) .button{
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.6;
    color: rgba(var(--text-color, (17,17,17)), 1);
    background-color: rgba(var(--text-color, (17,17,17)), 0.3);
}
@media (hover: hover){
    :host(:not([disabled])) .button:hover,
    :host(:focus-within:not([disabled])) .button{
        -webkit-box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.12);
        box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.12);
    }
    :host([variant='outlined']:not([disabled])) .button:hover,
    :host(:focus-within[variant='outlined']:not([disabled])) .button:hover{
        -webkit-box-shadow: 0 0 0 1px rgba(var(--text-color, (17,17,17)), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.12);
                box-shadow: 0 0 0 1px rgba(var(--text-color, (17,17,17)), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.12);
    }
}
@media (hover: none){
    :host(:not([disabled])) .button:active{
        -webkit-box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
                box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
    }
    :host([variant='outlined']) .button:active{
        -webkit-box-shadow: 0 0 0 1px rgba(var(--text-color, (17,17,17)), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
                box-shadow: 0 0 0 1px rgba(var(--text-color, (17,17,17)), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
    }
}
</style>
<div part="button" class="button">
    <slot></slot>   
</div>`;
customElements.define('sm-button',
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({
                mode: 'open'
            }).append(smButton.content.cloneNode(true));
        }
        static get observedAttributes() {
            return ['disabled'];
        }

        get disabled() {
            return this.hasAttribute('disabled');
        }

        set disabled(value) {
            if (value) {
                this.setAttribute('disabled', '');
            } else {
                this.removeAttribute('disabled');
            }
        }
        focusIn() {
            this.focus();
        }

        handleKeyDown(e) {
            if (!this.hasAttribute('disabled') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                this.click();
            }
        }

        connectedCallback() {
            if (!this.hasAttribute('disabled')) {
                this.setAttribute('tabindex', '0');
            }
            this.setAttribute('role', 'button');
            this.addEventListener('keydown', this.handleKeyDown);
        }
        attributeChangedCallback(name) {
            if (name === 'disabled') {
                if (this.hasAttribute('disabled')) {
                    this.removeAttribute('tabindex');
                } else {
                    this.setAttribute('tabindex', '0');
                }
                this.setAttribute('aria-disabled', this.hasAttribute('disabled'));
            }
        }
    })
const smForm = document.createElement('template');
smForm.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        display: flex;
        width: 100%;
    }
    form{
        display: grid;
        gap: var(--gap, 1.5rem);
        width: 100%;
    }
    </style>
	<form part="form" onsubmit="return false">
		<slot></slot>
	</form>
`;

customElements.define('sm-form', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smForm.content.cloneNode(true))

        this.form = this.shadowRoot.querySelector('form');
        this.formElements
        this.requiredElements
        this.submitButton
        this.resetButton
        this.allRequiredValid = false;

        this.debounce = this.debounce.bind(this)
        this._checkValidity = this._checkValidity.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
        this.reset = this.reset.bind(this)
        this.elementsChanged = this.elementsChanged.bind(this)
    }
    debounce(callback, wait) {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }
    _checkValidity() {
        this.allRequiredValid = this.requiredElements.every(elem => elem.isValid)
        if (!this.submitButton) return;
        if (this.allRequiredValid) {
            this.submitButton.disabled = false;
        }
        else {
            this.submitButton.disabled = true;
        }
    }
    handleKeydown(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'SM-TEXTAREA') {
            if (this.allRequiredValid) {
                if (this.submitButton) {
                    this.submitButton.click()
                }
                this.dispatchEvent(new CustomEvent('submit', {
                    bubbles: true,
                    composed: true,
                }))
            }
            else {
                this.requiredElements.find(elem => !elem.isValid).vibrate()
            }
        }
    }
    reset() {
        this.formElements.forEach(elem => elem.reset())
    }
    elementsChanged() {
        this.formElements = [...this.querySelectorAll('sm-input, sm-textarea, sm-checkbox, tags-input, file-input, sm-switch, sm-radio')]
        this.requiredElements = this.formElements.filter(elem => elem.hasAttribute('required'));
        this.submitButton = this.querySelector('[variant="primary"], [type="submit"]');
        this.resetButton = this.querySelector('[type="reset"]');
        if (this.resetButton) {
            this.resetButton.addEventListener('click', this.reset);
        }
        this._checkValidity()
    }
    connectedCallback() {
        const slot = this.shadowRoot.querySelector('slot')
        slot.addEventListener('slotchange', this.elementsChanged)
        this.addEventListener('input', this.debounce(this._checkValidity, 100));
        this.addEventListener('keydown', this.debounce(this.handleKeydown, 100));
    }
    disconnectedCallback() {
        this.removeEventListener('input', this.debounce(this._checkValidity, 100));
        this.removeEventListener('keydown', this.debounce(this.handleKeydown, 100));
    }
})

const smInput = document.createElement('template')
smInput.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
input[type="search"]::-webkit-search-decoration,
input[type="search"]::-webkit-search-cancel-button,
input[type="search"]::-webkit-search-results-button,
input[type="search"]::-webkit-search-results-decoration { display: none; }
input[type=number] {
-moz-appearance:textfield;
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
input:invalid{
    outline: none;
    -webkit-box-shadow: none;
            box-shadow: none;
}
::-moz-focus-inner{
border: none;
}
:host{
    display: flex;
    --success-color: #00C853;
    --danger-color: red;
    --width: 100%;
    --icon-gap: 0.5rem;
    --border-radius: 0.3rem;
    --background: rgba(var(--text-color, (17,17,17)), 0.06);
}
.hide{
   opacity: 0 !important;
   pointer-events: none !important;
}
.hide-completely{
    display: none;
}
.icon {
    fill: rgba(var(--text-color, (17,17,17)), 0.6);
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 1rem;
    cursor: pointer;
    min-width: 0;
}

:host(.round) .input{
    border-radius: 10rem;
}
.input {
    display: flex;
    cursor: text;
    min-width: 0;
    text-align: left;
            align-items: center;
    position: relative;
    gap: var(--icon-gap);
    padding: var(--padding, 0.6rem 0.8rem);
    border-radius: var(--border-radius);
    transition: opacity 0.3s, box-shadow 0.2s;
    background: var(--background);
    width: 100%;
    outline: none;
}
.input.readonly .clear{
    opacity: 0 !important;
    margin-right: -2rem;
    pointer-events: none !important;
}
.readonly{
    pointer-events: none;
}
.input:focus-within:not(.readonly){
    box-shadow: 0 0 0 0.1rem var(--accent-color,teal) inset !important;
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
}
.label {
    font-size: inherit;
    opacity: .7;
    font-weight: 400;
    position: absolute;
    top: 0;
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    -o-transition: transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s, color .03;
    -webkit-transform-origin: left;
    -ms-transform-origin: left;
        transform-origin: left;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
       text-overflow: ellipsis;
    width: 100%;
    user-select: none;
    will-change: transform;
}
.outer-container{
    position: relative;
    width: var(--width);
}
.container{
    width: 100%;
    display: flex;
    position: relative;
            align-items: center;
            flex: 1;
}    
input{
    font-size: inherit;
    border: none;
    background: transparent;
    outline: none;
    color: rgba(var(--text-color, (17,17,17)), 1);
    width: 100%;
}
:host([animate]) .input:focus-within .container input,
.animate-label .container input {
    -webkit-transform: translateY(0.6rem);
            -ms-transform: translateY(0.6rem);
        transform: translateY(0.6rem);
    }
  
    :host([animate]) .input:focus-within .label,
    .animate-label .label {
    -webkit-transform: translateY(-0.7em) scale(0.8);
            -ms-transform: translateY(-0.7em) scale(0.8);
        transform: translateY(-0.7em) scale(0.8);
    opacity: 1;
    color: var(--accent-color,teal)
}
:host([variant="outlined"]) .input {
    box-shadow: 0 0 0 1px var(--border-color, rgba(var(--text-color, (17,17,17)), 0.3)) inset;
    background: rgba(var(--background-color, (255,255,255)), 1);
}
.animate-label:focus-within:not(.readonly) .label{
    color: var(--accent-color,teal)
}
.feedback-text:not(:empty){
    display: flex;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
    align-items: center;
    padding: 0.8rem 0;
    color: rgba(var(--text-color, (17,17,17)), 0.8);
}
.success{
    color: var(--success-color);
}
.error{
    color: var(--danger-color);
}
.status-icon{
    margin-right: 0.2rem;
}
.status-icon--error{
    fill: var(--danger-color);
}
.status-icon--success{
    fill: var(--success-color);
}
@media (any-hover: hover){
    .icon:hover{
        background: rgba(var(--text-color, (17,17,17)), 0.1);
    }
}
</style>
<div class="outer-container">
    <label part="input" class="input">
        <slot name="icon"></slot>
        <div class="container">
            <input type="text"/>
            <div part="placeholder" class="label"></div>
        </div>
        <svg class="icon clear hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z"/></svg>
    </label>
    <p class="feedback-text"></p>
</div>
`;
customElements.define('sm-input',
    class extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({
                mode: 'open'
            }).append(smInput.content.cloneNode(true));

            this.inputParent = this.shadowRoot.querySelector('.input');
            this.input = this.shadowRoot.querySelector('input');
            this.clearBtn = this.shadowRoot.querySelector('.clear');
            this.label = this.shadowRoot.querySelector('.label');
            this.feedbackText = this.shadowRoot.querySelector('.feedback-text');
            this.outerContainer = this.shadowRoot.querySelector('.outer-container');
            this._helperText = '';
            this._errorText = '';
            this.isRequired = false;
            this.validationFunction = undefined;
            this.reflectedAttributes = ['value', 'required', 'disabled', 'type', 'inputmode', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step'];

            this.reset = this.reset.bind(this);
            this.focusIn = this.focusIn.bind(this);
            this.focusOut = this.focusOut.bind(this);
            this.fireEvent = this.fireEvent.bind(this);
            this.checkInput = this.checkInput.bind(this);
            this.vibrate = this.vibrate.bind(this);
        }

        static get observedAttributes() {
            return ['value', 'placeholder', 'required', 'disabled', 'type', 'inputmode', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step', 'helper-text', 'error-text', 'hiderequired'];
        }

        get value() {
            return this.input.value;
        }

        set value(val) {
            this.input.value = val;
            this.checkInput();
            this.fireEvent();
        }

        get placeholder() {
            return this.getAttribute('placeholder');
        }

        set placeholder(val) {
            this.setAttribute('placeholder', val);
        }

        get type() {
            return this.getAttribute('type');
        }

        set type(val) {
            this.setAttribute('type', val);
        }

        get validity() {
            return this.input.validity;
        }

        get disabled() {
            return this.hasAttribute('disabled');
        }
        set disabled(value) {
            if (value)
                this.inputParent.classList.add('disabled');
            else
                this.inputParent.classList.remove('disabled');
        }
        get readOnly() {
            return this.hasAttribute('readonly');
        }
        set readOnly(value) {
            if (value) {
                this.setAttribute('readonly', '');
            } else {
                this.removeAttribute('readonly');
            }
        }
        set customValidation(val) {
            this.validationFunction = val;
        }
        set errorText(val) {
            this._errorText = val;
        }
        set helperText(val) {
            this._helperText = val;
        }
        get isValid() {
            if (this.input.value !== '') {
                const _isValid = this.input.checkValidity();
                let _customValid = true;
                if (this.validationFunction) {
                    _customValid = Boolean(this.validationFunction(this.input.value));
                }
                if (_isValid && _customValid) {
                    this.feedbackText.classList.remove('error');
                    this.feedbackText.classList.add('success');
                    this.feedbackText.textContent = '';
                } else {
                    if (this._errorText) {
                        this.feedbackText.classList.add('error');
                        this.feedbackText.classList.remove('success');
                        this.feedbackText.innerHTML = `
                            <svg class="status-icon status-icon--error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"/></svg>
                        ${this._errorText}
                        `;
                    }
                }
                return (_isValid && _customValid);
            }
        }
        reset() {
            this.value = '';
        }

        focusIn() {
            this.input.focus();
        }

        focusOut() {
            this.input.blur();
        }

        fireEvent() {
            let event = new Event('input', {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            this.dispatchEvent(event);
        }

        checkInput(e) {
            if (!this.hasAttribute('readonly')) {
                if (this.input.value.trim() !== '') {
                    this.clearBtn.classList.remove('hide');
                } else {
                    this.clearBtn.classList.add('hide');
                }
            }
            if (!this.hasAttribute('placeholder') || this.getAttribute('placeholder').trim() === '') return;
            if (this.input.value !== '') {
                if (this.animate)
                    this.inputParent.classList.add('animate-label');
                else
                    this.label.classList.add('hide');
            } else {
                if (this.animate)
                    this.inputParent.classList.remove('animate-label');
                else
                    this.label.classList.remove('hide');
            }
        }
        vibrate() {
            this.outerContainer.animate([
                { transform: 'translateX(-1rem)' },
                { transform: 'translateX(1rem)' },
                { transform: 'translateX(-0.5rem)' },
                { transform: 'translateX(0.5rem)' },
                { transform: 'translateX(0)' },
            ], {
                duration: 300,
                easing: 'ease'
            });
        }


        connectedCallback() {
            this.animate = this.hasAttribute('animate');
            this.setAttribute('role', 'textbox');
            this.input.addEventListener('input', this.checkInput);
            this.clearBtn.addEventListener('click', this.reset);
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (this.reflectedAttributes.includes(name)) {
                    if (this.hasAttribute(name)) {
                        this.input.setAttribute(name, this.getAttribute(name) ? this.getAttribute(name) : '');
                    }
                    else {
                        this.input.removeAttribute(name);
                    }
                }
                if (name === 'placeholder') {
                    this.label.textContent = newValue;
                    this.setAttribute('aria-label', newValue);
                }
                else if (this.hasAttribute('value')) {
                    this.checkInput();
                }
                else if (name === 'type') {
                    if (this.hasAttribute('type') && this.getAttribute('type') === 'number') {
                        this.input.setAttribute('inputmode', 'numeric');
                    }
                }
                else if (name === 'helper-text') {
                    this._helperText = this.getAttribute('helper-text');
                }
                else if (name === 'error-text') {
                    this._errorText = this.getAttribute('error-text');
                }
                else if (name === 'required') {
                    this.isRequired = this.hasAttribute('required');
                    if (this.isRequired) {
                        this.setAttribute('aria-required', 'true');
                    }
                    else {
                        this.setAttribute('aria-required', 'false');
                    }
                }
                else if (name === 'readonly') {
                    if (this.hasAttribute('readonly')) {
                        this.inputParent.classList.add('readonly');
                    } else {
                        this.inputParent.classList.remove('readonly');
                    }
                }
                else if (name === 'disabled') {
                    if (this.hasAttribute('disabled')) {
                        this.inputParent.classList.add('disabled');
                    }
                    else {
                        this.inputParent.classList.remove('disabled');
                    }
                }
            }
        }
        disconnectedCallback() {
            this.input.removeEventListener('input', this.checkInput);
            this.clearBtn.removeEventListener('click', this.reset);
        }
    })
const smNotifications = document.createElement('template')
smNotifications.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        display: flex;
        --accent-color: #4d2588;
        --background-color: 255, 255, 255;
        --danger-color: red;
        --icon-height: 1.5rem;
        --icon-width: 1.5rem;
    }
    .hide{
        opacity: 0 !important;
        pointer-events: none !important;
    }
    .notification-panel{
        display: grid;
        width: 100%;
        gap: 0.5rem;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 100;
        max-height: 100%;
        padding: 1rem;
        overflow: hidden auto;
        -ms-scroll-chaining: none;
            overscroll-behavior: contain;
    }
    .notification-panel:empty{
        display:none;
    }
    .notification{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        border-radius: 0.3rem;
        background: rgba(var(--background-color, (255,255,255)), 1);
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
        padding: 1rem;
        align-items: center;
    }
    .icon-container:not(:empty){
        margin-right: 0.5rem;
        height: var(--icon-height);
        width: var(--icon-width);
    }
    h4:first-letter,
    p:first-letter{
        text-transform: uppercase;
    }
    h4{
        font-weight: 400;
    }
    p{
        line-height: 1.6;
        -webkit-box-flex: 1;
            -ms-flex: 1;
                flex: 1;
        color: rgba(var(--text-color, (17,17,17)), 0.9);
        overflow-wrap: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
    }
    .notification:last-of-type{
        margin-bottom: 0;
    }
    .icon {
        height: 100%;
        width: 100%;
        fill: rgba(var(--text-color, (17,17,17)), 0.7);
    }
    .icon--success {
        fill: var(--green);
      }
      .icon--failure,
      .icon--error {
        fill: var(--danger-color);
      }
    .close{
        height: 2rem;
        width: 2rem;
        border: none;
        cursor: pointer;
        margin-left: 1rem;
        border-radius: 50%;
        padding: 0.3rem;
        transition: background-color 0.3s, transform 0.3s;
        background-color: transparent;
    }
    .close:active{
        transform: scale(0.9);
    }
    @media screen and (min-width: 640px){
        .notification-panel{
            max-width: 28rem;
            width: max-content;
        }
        .notification{
            width: auto;
            border: solid 1px rgba(var(--text-color, (17,17,17)), 0.2);
        }
    }
    @media (any-hover: hover){
        ::-webkit-scrollbar{
            width: 0.5rem;
        }
        
        ::-webkit-scrollbar-thumb{
            background: rgba(var(--text-color, (17,17,17)), 0.3);
            border-radius: 1rem;
            &:hover{
                background: rgba(var(--text-color, (17,17,17)), 0.5);
            }
        }
        .close:hover{
            background-color: rgba(var(--text-color, (17,17,17)), 0.1);
        }
    }
</style>
<div class="notification-panel"></div>
`;


customElements.define('sm-notifications', class extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({
            mode: 'open'
        }).append(smNotifications.content.cloneNode(true))

        this.notificationPanel = this.shadowRoot.querySelector('.notification-panel')
        this.animationOptions = {
            duration: 300,
            fill: "forwards",
            easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }

        this.push = this.push.bind(this)
        this.createNotification = this.createNotification.bind(this)
        this.removeNotification = this.removeNotification.bind(this)
        this.clearAll = this.clearAll.bind(this)

    }

    randString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++)
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        return result;
    }

    createNotification(message, options = {}) {
        const { pinned = false, icon = '' } = options;
        const notification = document.createElement('output')
        notification.id = this.randString(8)
        notification.classList.add('notification');
        let composition = ``;
        composition += `
            <div class="icon-container">${icon}</div>
            <p>${message}</p>
            `;
        if (pinned) {
            notification.classList.add('pinned');
            composition += `
                <button class="close">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/></svg>
                </button>
            `;
        }
        notification.innerHTML = composition;
        return notification;
    }

    push(message, options = {}) {
        const notification = this.createNotification(message, options);
        this.notificationPanel.append(notification);
        notification.animate([
            {
                transform: `translateY(1rem)`,
                opacity: '0'
            },
            {
                transform: `none`,
                opacity: '1'
            },
        ], this.animationOptions);
        return notification.id;
    }

    removeNotification(notification) {
        notification.animate([
            {
                transform: `none`,
                opacity: '1'
            },
            {
                transform: `translateY(0.5rem)`,
                opacity: '0'
            }
        ], this.animationOptions).onfinish = () => {
            notification.remove();
        };
    }

    clearAll() {
        Array.from(this.notificationPanel.children).forEach(child => {
            this.removeNotification(child);
        });
    }

    connectedCallback() {
        this.notificationPanel.addEventListener('click', e => {
            if (e.target.closest('.close')) {
                this.removeNotification(e.target.closest('.notification'));
            }
        });

        const observer = new MutationObserver(mutationList => {
            mutationList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length && !mutation.addedNodes[0].classList.contains('pinned')) {
                        setTimeout(() => {
                            this.removeNotification(mutation.addedNodes[0]);
                        }, 5000);
                    }
                }
            });
        });
        observer.observe(this.notificationPanel, {
            childList: true,
        });
    }
});

class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        if (this.items.length == 0)
            return "Underflow";
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
}
const popupStack = new Stack();

const smPopup = document.createElement('template');
smPopup.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
:host{
    position: fixed;
    display: -ms-grid;
    display: grid;
    z-index: 10;
    --width: 100%;
    --height: auto;
    --min-width: auto;
    --min-height: auto;
    --backdrop-background: rgba(0, 0, 0, 0.6);
    --border-radius: 0.8rem 0.8rem 0 0;
}
.popup-container{
    display: -ms-grid;
    display: grid;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    place-items: center;
    z-index: 10;
    touch-action: none;
}
:host(.stacked) .popup{
    -webkit-transform: scale(0.9) translateY(-2rem) !important;
            transform: scale(0.9) translateY(-2rem) !important;
}
.background{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    background: var(--backdrop-background);
    -webkit-transition: opacity 0.3s;
    -o-transition: opacity 0.3s;
    transition: opacity 0.3s;
}
.popup{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
            flex-direction: column;
    position: relative;
    -ms-flex-item-align: end;
        align-self: flex-end;
    -webkit-box-align: start;
        -ms-flex-align: start;
            align-items: flex-start;
    width: var(--width);
    min-width: var(--min-width);
    height: var(--height);
    min-height: var(--min-height);
    max-height: 90vh;
    border-radius: var(--border-radius);
    background: rgba(var(--background-color, (255,255,255)), 1);
    -webkit-box-shadow: 0 -1rem 2rem #00000020;
            box-shadow: 0 -1rem 2rem #00000020;
}
.container-header{
    display: -webkit-box;
    display: flex;
    width: 100%;
    touch-action: none;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.popup-top{
    display: -webkit-box;
    display: flex;
    width: 100%;
}
.popup-body{
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
    width: 100%;
    padding: var(--body-padding, 1.5rem);
    overflow-y: auto;
}
.hide{
    display:none;
}
@media screen and (min-width: 640px){
    :host{
        --border-radius: 0.5rem;
    }
    .popup{
        -ms-flex-item-align: center;
            -ms-grid-row-align: center;
            align-self: center;
        border-radius: var(--border-radius);
        height: var(--height);
        -webkit-box-shadow: 0 3rem 2rem -0.5rem #00000040;
                box-shadow: 0 3rem 2rem -0.5rem #00000040;
    }
}
@media screen and (max-width: 640px){
    .popup-top{
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
                flex-direction: column;
        -webkit-box-align: center;
                align-items: center;
    }
    .handle{
        height: 0.3rem;
        width: 2rem;
        background: rgba(var(--text-color, (17,17,17)), .4);
        border-radius: 1rem;
        margin: 0.5rem 0;
    }
}
@media (any-hover: hover){
    ::-webkit-scrollbar{
        width: 0.5rem;
    }
    
    ::-webkit-scrollbar-thumb{
        background: rgba(var(--text-color, (17,17,17)), 0.3);
        border-radius: 1rem;
        &:hover{
            background: rgba(var(--text-color, (17,17,17))), 0.5);
        }
    }
}
</style>
<div class="popup-container hide" role="dialog">
    <div part="background" class="background"></div>
    <div part="popup" class="popup">
        <div part="popup-header" class="popup-top">
            <div class="handle"></div>
            <slot name="header"></slot>
        </div>
        <div part="popup-body" class="popup-body">
            <slot></slot>
        </div>
    </div>
</div>
`;
customElements.define('sm-popup', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).append(smPopup.content.cloneNode(true));

        this.allowClosing = false;
        this.isOpen = false;
        this.pinned = false;
        this.offset = 0;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
        this.touchEndTime = 0;
        this.touchEndAnimation = undefined;
        this.focusable
        this.autoFocus
        this.mutationObserver

        this.popupContainer = this.shadowRoot.querySelector('.popup-container');
        this.backdrop = this.shadowRoot.querySelector('.background');
        this.popup = this.shadowRoot.querySelector('.popup');
        this.popupBodySlot = this.shadowRoot.querySelector('.popup-body slot');
        this.popupHeader = this.shadowRoot.querySelector('.popup-top');

        this.resumeScrolling = this.resumeScrolling.bind(this);
        this.setStateOpen = this.setStateOpen.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.detectFocus = this.detectFocus.bind(this);
    }

    static get observedAttributes() {
        return ['open'];
    }

    get open() {
        return this.isOpen;
    }

    animateTo(element, keyframes, options) {
        const anime = element.animate(keyframes, { ...options, fill: 'both' })
        anime.finished.then(() => {
            anime.commitStyles()
            anime.cancel()
        })
        return anime
    }

    resumeScrolling() {
        const scrollY = document.body.style.top;
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        document.body.style.overflow = '';
        document.body.style.top = 'initial';
    }

    setStateOpen() {
        if (!this.isOpen || this.offset) {
            const animOptions = {
                duration: 300,
                easing: 'ease'
            }
            const initialAnimation = (window.innerWidth > 640) ? 'scale(1.1)' : `translateY(${this.offset ? `${this.offset}px` : '100%'})`
            this.animateTo(this.popup, [
                {
                    opacity: this.offset ? 1 : 0,
                    transform: initialAnimation
                },
                {
                    opacity: 1,
                    transform: 'none'
                },
            ], animOptions)

        }
    }

    show(options = {}) {
        const { pinned = false } = options;
        if (!this.isOpen) {
            const animOptions = {
                duration: 300,
                easing: 'ease'
            }
            popupStack.push({
                popup: this,
                permission: pinned
            });
            if (popupStack.items.length > 1) {
                this.animateTo(popupStack.items[popupStack.items.length - 2].popup.shadowRoot.querySelector('.popup'), [
                    { transform: 'none' },
                    { transform: (window.innerWidth > 640) ? 'scale(0.95)' : 'translateY(-1.5rem)' },
                ], animOptions)
            }
            this.popupContainer.classList.remove('hide');
            if (!this.offset)
                this.backdrop.animate([
                    { opacity: 0 },
                    { opacity: 1 },
                ], animOptions)
            this.setStateOpen()
            this.dispatchEvent(
                new CustomEvent("popupopened", {
                    bubbles: true,
                    detail: {
                        popup: this,
                    }
                })
            );
            this.pinned = pinned;
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
            document.body.style.top = `-${window.scrollY}px`;
            const elementToFocus = this.autoFocus || this.focusable[0];
            elementToFocus.tagName.includes('SM-') ? elementToFocus.focusIn() : elementToFocus.focus();
            if (!this.hasAttribute('open'))
                this.setAttribute('open', '');
        }
    }
    hide() {
        const animOptions = {
            duration: 150,
            easing: 'ease'
        }
        this.backdrop.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], animOptions)
        this.animateTo(this.popup, [
            {
                opacity: 1,
                transform: (window.innerWidth > 640) ? 'none' : `translateY(${this.offset ? `${this.offset}px` : '0'})`
            },
            {
                opacity: 0,
                transform: (window.innerWidth > 640) ? 'scale(1.1)' : 'translateY(100%)'
            },
        ], animOptions).finished
            .finally(() => {
                this.popupContainer.classList.add('hide');
                this.popup.style = ''
                this.removeAttribute('open');

                if (this.forms.length) {
                    this.forms.forEach(form => form.reset());
                }
                this.dispatchEvent(
                    new CustomEvent("popupclosed", {
                        bubbles: true,
                        detail: {
                            popup: this,
                        }
                    })
                );
                this.isOpen = false;
            })
        popupStack.pop();
        if (popupStack.items.length) {
            this.animateTo(popupStack.items[popupStack.items.length - 1].popup.shadowRoot.querySelector('.popup'), [
                { transform: (window.innerWidth > 640) ? 'scale(0.95)' : 'translateY(-1.5rem)' },
                { transform: 'none' },
            ], animOptions)

        } else {
            this.resumeScrolling();
        }
    }

    handleTouchStart(e) {
        this.offset = 0
        this.popupHeader.addEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.popupHeader.addEventListener('touchend', this.handleTouchEnd, { passive: true });
        this.touchStartY = e.changedTouches[0].clientY;
        this.touchStartTime = e.timeStamp;
    }

    handleTouchMove(e) {
        if (this.touchStartY < e.changedTouches[0].clientY) {
            this.offset = e.changedTouches[0].clientY - this.touchStartY;
            this.touchEndAnimation = window.requestAnimationFrame(() => {
                this.popup.style.transform = `translateY(${this.offset}px)`;
            });
        }
    }

    handleTouchEnd(e) {
        this.touchEndTime = e.timeStamp;
        cancelAnimationFrame(this.touchEndAnimation);
        this.touchEndY = e.changedTouches[0].clientY;
        this.threshold = this.popup.getBoundingClientRect().height * 0.3;
        if (this.touchEndTime - this.touchStartTime > 200) {
            if (this.touchEndY - this.touchStartY > this.threshold) {
                if (this.pinned) {
                    this.setStateOpen();
                    return;
                } else
                    this.hide();
            } else {
                this.setStateOpen();
            }
        } else {
            if (this.touchEndY > this.touchStartY)
                if (this.pinned) {
                    this.setStateOpen();
                    return;
                }
                else
                    this.hide();
        }
        this.popupHeader.removeEventListener('touchmove', this.handleTouchMove, { passive: true });
        this.popupHeader.removeEventListener('touchend', this.handleTouchEnd, { passive: true });
    }


    detectFocus(e) {
        if (e.key === 'Tab') {
            const lastElement = this.focusable[this.focusable.length - 1];
            const firstElement = this.focusable[0];
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.tagName.includes('SM-') ? lastElement.focusIn() : lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.tagName.includes('SM-') ? firstElement.focusIn() : firstElement.focus();
            }
        }
    }

    updateFocusableList() {
        this.focusable = this.querySelectorAll('sm-button:not([disabled]), button:not([disabled]), [href], sm-input, input, sm-select, select, sm-checkbox, sm-textarea, textarea, [tabindex]:not([tabindex="-1"])')
        this.autoFocus = this.querySelector('[autofocus]')
    }

    connectedCallback() {
        this.popupBodySlot.addEventListener('slotchange', () => {
            this.forms = this.querySelectorAll('sm-form');
            this.updateFocusableList()
        });
        this.popupContainer.addEventListener('mousedown', e => {
            if (e.target === this.popupContainer && !this.pinned) {
                if (this.pinned) {
                    this.setStateOpen();
                } else
                    this.hide();
            }
        });

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    // Firefox implements `contentBoxSize` as a single content rect, rather than an array
                    const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
                    this.threshold = contentBoxSize.blockSize.height * 0.3;
                } else {
                    this.threshold = entry.contentRect.height * 0.3;
                }
            }
        });
        resizeObserver.observe(this);

        this.mutationObserver = new MutationObserver(entries => {
            this.updateFocusableList()
        })
        this.mutationObserver.observe(this, { attributes: true, childList: true, subtree: true })

        this.addEventListener('keydown', this.detectFocus);
        this.popupHeader.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    }
    disconnectedCallback() {
        this.removeEventListener('keydown', this.detectFocus);
        resizeObserver.unobserve();
        this.mutationObserver.disconnect()
        this.popupHeader.removeEventListener('touchstart', this.handleTouchStart, { passive: true });
    }
    attributeChangedCallback(name) {
        if (name === 'open') {
            if (this.hasAttribute('open')) {
                this.show();
            }
        }
    }
});
const smSwitch = document.createElement('template')
smSwitch.innerHTML = `	
<style>
    *{
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
        padding: 0;
        margin: 0;
    }
    
    :host{
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
    }
    label{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 100%;
        outline: none;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    :host([disabled]) {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
    }
    .switch {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        width: 2.4rem;
        flex-shrink: 0;
        margin-left: auto;
        padding: 0.2rem;
        cursor: pointer;
        border-radius: 2rem;
    }
    
    input {
        display: none;
    }
    
    .track {
        position: absolute;
        left: 0;
        right: 0;
        height: 1.4rem;
        -webkit-transition: background 0.3s;
        -o-transition: background 0.3s;
        transition: background 0.3s;
        background: rgba(var(--text-color,inherit), 0.4);
        -webkit-box-shadow: 0 0.1rem 0.3rem #00000040 inset;
                box-shadow: 0 0.1rem 0.3rem #00000040 inset;
        border-radius: 1rem;
    }
    
    label:active .thumb::after,
    label:focus-within .thumb::after{
        opacity: 1;
    }
    
    .thumb::after{
        content: '';
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: absolute;
        height: 2.6rem;
        width: 2.6rem;
        background: rgba(var(--text-color,inherit), 0.2);
        border-radius: 2rem;
        opacity: 0;
        -webkit-transition: opacity 0.3s;
        -o-transition: opacity 0.3s;
        transition: opacity 0.3s;
    }
    
    .thumb {
        position: relative;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        height: 1rem;
        width: 1rem;
        -webkit-box-pack: center;
            -ms-flex-pack: center;
                justify-content: center;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        border-radius: 1rem;
        -webkit-box-shadow: 0 0.1rem 0.4rem #00000060;
                box-shadow: 0 0.1rem 0.4rem #00000060;
        -webkit-transition: -webkit-transform 0.3s;
        transition: -webkit-transform 0.3s;
        -o-transition: transform 0.3s;
        transition: transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        border: solid 0.3rem white;
    }
    
    input:checked ~ .thumb {
        -webkit-transform: translateX(100%);
            -ms-transform: translateX(100%);
                transform: translateX(100%);
    }
    
    input:checked ~ .track {
        background: var(--accent-color, teal);
    }
</style>
<label tabindex="0">
    <slot name="left"></slot>
    <div part="switch" class="switch">
        <input type="checkbox">
        <div class="track"></div>
        <div class="thumb"></div>
    </div>
    <slot name="right"></slot>
</label>`

customElements.define('sm-switch', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smSwitch.content.cloneNode(true))
        this.switch = this.shadowRoot.querySelector('.switch');
        this.input = this.shadowRoot.querySelector('input')
        this.isChecked = false
        this.isDisabled = false

        this.dispatch = this.dispatch.bind(this)
    }

    static get observedAttributes() {
        return ['disabled', 'checked']
    }

    get disabled() {
        return this.isDisabled
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '')
        } else {
            this.removeAttribute('disabled')
        }
    }

    get checked() {
        return this.isChecked
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '')
        } else {
            this.removeAttribute('checked')
        }
    }

    reset() {

    }

    dispatch() {
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: {
                value: this.isChecked
            }
        }))
    }

    connectedCallback() {
        this.addEventListener('keydown', e => {
            if (e.key === ' ' && !this.isDisabled) {
                e.preventDefault()
                this.input.click()
            }
        })
        this.input.addEventListener('click', e => {
            if (this.input.checked)
                this.checked = true
            else
                this.checked = false
            this.dispatch()
        })
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'disabled') {
                if (this.hasAttribute('disabled')) {
                    this.disabled = true
                }
                else {
                    this.disabled = false
                }
            }
            else if (name === 'checked') {
                if (this.hasAttribute('checked')) {
                    this.isChecked = true
                    this.input.checked = true
                }
                else {
                    this.isChecked = false
                    this.input.checked = false
                }
            }
        }
    }

})
const themeToggle = document.createElement('template');
themeToggle.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        cursor: pointer;
        --height: 2.5rem;
        --width: 2.5rem;
    }
    .theme-toggle {
        display: flex;
        position: relative;
        width: 1.2rem;
        height: 1.2rem;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
    .theme-toggle::after{
        content: '';
        position: absolute;
        height: var(--height);
        width: var(--width);
        top: 50%;
        left: 50%;
        opacity: 0;
        border-radius: 50%;
        pointer-events: none;
        transition: transform 0.3s, opacity 0.3s;
        transform: translate(-50%, -50%) scale(1.2);
        background-color: rgba(var(--text-color,inherit), 0.12);
    }
    :host(:focus-within) .theme-toggle{
        outline: none;
    }
    :host(:focus-within) .theme-toggle::after{
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    .icon {
        position: absolute;
        height: 100%;
        width: 100%;
        fill: rgba(var(--text-color,inherit), 1);
        transition: transform 0.3s, opacity 0.1s;
    }
    
    .theme-switcher__checkbox {
        display: none;
    }
    :host([checked]) .moon-icon {
        transform: translateY(50%);
        opacity: 0;
    }
    :host(:not([checked])) .sun-icon {
        transform: translateY(50%);
        opacity: 0;
    }
    </style>
    <label class="theme-toggle" title="Change theme" tabindex="0">
        <slot name="light-mode-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon moon-icon" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"/></svg>
        </slot>
        <slot name="dark-mode-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon sun-icon" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><rect fill="none" height="24" width="24"/><path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"/></svg>
        </slot>
    </label>
`;

class ThemeToggle extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({
            mode: 'open'
        }).append(themeToggle.content.cloneNode(true));

        this.isChecked = false;
        this.hasTheme = 'light';

        this.toggleState = this.toggleState.bind(this);
        this.fireEvent = this.fireEvent.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
    }
    static get observedAttributes() {
        return ['checked'];
    }

    daylight() {
        this.hasTheme = 'light';
        document.body.dataset.theme = 'light';
        this.setAttribute('aria-checked', 'false');
    }

    nightlight() {
        this.hasTheme = 'dark';
        document.body.dataset.theme = 'dark';
        this.setAttribute('aria-checked', 'true');
    }

    toggleState() {
        this.toggleAttribute('checked');
        this.fireEvent();
    }
    handleKeyDown(e) {
        if (e.key === ' ') {
            this.toggleState();
        }
    }
    handleThemeChange(e) {
        if (e.detail.theme !== this.hasTheme) {
            if (e.detail.theme === 'dark') {
                this.setAttribute('checked', '');
            }
            else {
                this.removeAttribute('checked');
            }
        }
    }

    fireEvent() {
        this.dispatchEvent(
            new CustomEvent('themechange', {
                bubbles: true,
                composed: true,
                detail: {
                    theme: this.hasTheme
                }
            })
        );
    }

    connectedCallback() {
        this.setAttribute('role', 'switch');
        this.setAttribute('aria-label', 'theme toggle');
        if (localStorage.getItem(`${window.location.hostname}-theme`) === "dark") {
            this.nightlight();
            this.setAttribute('checked', '');
        } else if (localStorage.getItem(`${window.location.hostname}-theme`) === "light") {
            this.daylight();
            this.removeAttribute('checked');
        }
        else {
            if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
                this.nightlight();
                this.setAttribute('checked', '');
            } else {
                this.daylight();
                this.removeAttribute('checked');
            }
        }
        this.addEventListener("click", this.toggleState);
        this.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener('themechange', this.handleThemeChange);
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.toggleState);
        this.removeEventListener("keydown", this.handleKeyDown);
        document.removeEventListener('themechange', this.handleThemeChange);
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === 'checked') {
            if (this.hasAttribute('checked')) {
                this.nightlight();
                localStorage.setItem(`${window.location.hostname}-theme`, "dark");
            } else {
                this.daylight();
                localStorage.setItem(`${window.location.hostname}-theme`, "light");
            }
        }
    }
}

window.customElements.define('theme-toggle', ThemeToggle);

const smCopy = document.createElement('template');
smCopy.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}       
:host{
    display: -webkit-box;
    display: flex;
    --accent-color: #4d2588;
    --background-color: 255, 255, 255;
    --padding: 0;
    --background-color: inherit;
    --button-background-color: rgba(var(--text-color, (17,17,17)), 0.2);
}
.copy{
    display: grid;
    width: 100%;
    gap: 0.5rem;
    padding: var(--padding);
    align-items: center;
    grid-template-columns: minmax(0, 1fr) auto;
}
:host(:not([clip-text])) .copy-content{
    overflow-wrap: break-word;
    word-wrap: break-word;
}
:host([clip-text]) .copy-content{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.copy-button{
    display: inline-flex;
    justify-content: center;
    cursor: pointer;
    border: none;
    padding: 0.4rem;
    background-color: inherit;
    border-radius: var(--button-border-radius, 0.3rem);
}
.copy-button:active{
    background-color: var(--button-background-color);
}
.icon{
    height: 1.2rem;
    width: 1.2rem;
    fill: rgba(var(--text-color, (17,17,17)), 0.8);
}
@media (any-hover: hover){
    .copy:hover .copy-button{
        opacity: 1;
    }
    .copy-button{
        opacity: 0.6;
    }
    .copy-button:hover{
        background-color: var(--button-background-color);
    }
}
</style>
<section class="copy">
    <p class="copy-content"></p>
    <button part="button" class="copy-button" title="copy">
        <slot name="copy-icon">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7zM5.003 8L5 20h10V8H5.003zM9 6h8v10h2V4H9v2z"/></svg>
        </slot>
    </button>
</section>
`;
customElements.define('sm-copy',
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({
                mode: 'open'
            }).append(smCopy.content.cloneNode(true));

            this.copyContent = this.shadowRoot.querySelector('.copy-content');
            this.copyButton = this.shadowRoot.querySelector('.copy-button');

            this.copy = this.copy.bind(this);
        }
        static get observedAttributes() {
            return ['value'];
        }
        set value(val) {
            this.setAttribute('value', val);
        }
        get value() {
            return this.getAttribute('value');
        }
        fireEvent() {
            this.dispatchEvent(
                new CustomEvent('copy', {
                    composed: true,
                    bubbles: true,
                    cancelable: true,
                })
            );
        }
        copy() {
            navigator.clipboard.writeText(this.copyContent.textContent)
                .then(res => this.fireEvent())
                .catch(err => console.error(err));
        }
        connectedCallback() {
            this.copyButton.addEventListener('click', this.copy);
        }
        attributeChangedCallback(name, oldValue, newValue) {
            if (name === 'value') {
                this.copyContent.textContent = newValue;
            }
        }
        disconnectedCallback() {
            this.copyButton.removeEventListener('click', this.copy);
        }
    });
const spinner = document.createElement('template');
spinner.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
.loader {
    height: var(--size, 1.5rem);
    width: var(--size, 1.5rem);
    stroke-width: 8;
    overflow: visible;
    stroke: var(--accent-color, teal);
    fill: none;
    stroke-dashoffset: 180;
    stroke-dasharray: 180;
    animation: load 2s infinite, spin 1s linear infinite;
}
@keyframes load {
    50% {
        stroke-dashoffset: 0;
    }
    100%{
        stroke-dashoffset: -180;
    }
}

@keyframes spin {
    100% {
        transform: rotate(360deg);
    }
}
</style>
<svg viewBox="0 0 64 64" class="loader"><circle cx="32" cy="32" r="32" /></svg>

`;
class SpinnerLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({
            mode: 'open'
        }).append(spinner.content.cloneNode(true));
    }
}
window.customElements.define('sm-spinner', SpinnerLoader);