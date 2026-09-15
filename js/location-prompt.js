import { LC_TOKENS, lcToast, lcInlineError } from './lc-ui.js';

class LocationPrompt extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.zip = localStorage.getItem('lawnczar_zip') || '';
        this.render();
    }

    show() {
        this.showForced = true;
        this.style.display = 'flex';
        this.render();
    }

    hide() {
        this.showForced = false;
        this.style.display = 'none';
    }

    connectedCallback() {
        console.log('LocationPrompt connected');
        if (this.zip && !this.showForced) {
            this.style.display = 'none';
        } else {
            this.style.display = 'flex';
        }
    }

    async handleZipSubmit(zip) {
        if (!/^\d{5}$/.test(zip)) {
            const errSlot = this.shadowRoot.querySelector('#error-slot');
            lcInlineError(errSlot, 'Enter a valid 5-digit ZIP code.');
            this.shadowRoot.querySelector('#zip-input').classList.add('invalid');
            return;
        }

        const btn = this.shadowRoot.querySelector('#start-btn');
        const errSlot = this.shadowRoot.querySelector('#error-slot');
        errSlot.innerHTML = '';
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span> Finding sales…';

        try {
            const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
            if (!response.ok) throw new Error('ZIP code not found');

            const data = await response.json();
            const place = data.places[0];
            const lat = parseFloat(place.latitude);
            const lng = parseFloat(place.longitude);

            localStorage.setItem('lawnczar_zip', zip);
            localStorage.setItem('lawnczar_lat', lat);
            localStorage.setItem('lawnczar_lng', lng);

            this.dispatchEvent(new CustomEvent('location-set', {
                detail: { zip, lat, lng },
                bubbles: true,
                composed: true
            }));

            lcToast(`Showing sales near ${place['place name']}, ${place['state abbreviation']}`, 'success');
            this.style.display = 'none';
        } catch (error) {
            btn.disabled = false;
            btn.textContent = 'Find Sales';
            lcInlineError(errSlot, 'That ZIP didn\u2019t come up — double-check it and try again.');
            this.shadowRoot.querySelector('#zip-input').classList.add('invalid');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${LC_TOKENS}
                :host {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(38, 50, 56, 0.55);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    align-items: center;
                    justify-content: center;
                    z-index: 20000;
                }
                .modal {
                    background: var(--surface);
                    border-radius: var(--radius-l);
                    width: 90%;
                    max-width: 400px;
                    box-shadow: var(--shadow-4);
                    border: 1px solid var(--line);
                    overflow: hidden;
                    animation: lc-pop-in 0.25s var(--ease) both;
                }
                .brand-band {
                    background: linear-gradient(135deg, var(--mint) 0%, var(--mint-dark) 100%);
                    padding: 28px 24px 22px;
                    text-align: center;
                    color: white;
                }
                .brand-mark {
                    width: 52px; height: 52px; border-radius: 14px;
                    background: rgba(255,255,255,0.16);
                    display: inline-flex; align-items: center; justify-content: center;
                    margin-bottom: 12px;
                    border: 1px solid rgba(255,255,255,0.25);
                }
                .brand-band h2 { margin: 0 0 6px; font-size: 21px; font-weight: 800; letter-spacing: -0.02em; }
                .brand-band p { margin: 0; opacity: 0.92; font-size: 14px; }
                .body { padding: 22px 24px 26px; display: flex; flex-direction: column; gap: 14px; }
                #zip-input {
                    text-align: center; font-size: 26px; letter-spacing: 8px;
                    font-weight: 700; font-feature-settings: 'tnum';
                }
                #error-slot:empty { display: none; }
            </style>
            <div class="modal">
                <div class="brand-band">
                    <div class="brand-mark">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>
                            <path d="M9 20v-6h6v6"/>
                        </svg>
                    </div>
                    <h2>Welcome to LawnCzar</h2>
                    <p>Enter your ZIP to shop sales in your area.</p>
                </div>
                <div class="body">
                    <div class="field">
                        <label for="zip-input">ZIP Code</label>
                        <input class="input" type="text" id="zip-input" placeholder="00000" maxlength="5" inputmode="numeric" autocomplete="postal-code" value="${this.zip}">
                    </div>
                    <div id="error-slot"></div>
                    <button class="btn btn-primary btn-block" id="start-btn">Find Sales</button>
                </div>
            </div>
        `;

        const go = () => this.handleZipSubmit(this.shadowRoot.querySelector('#zip-input').value.trim());
        this.shadowRoot.querySelector('#start-btn').onclick = go;
        this.shadowRoot.querySelector('#zip-input').addEventListener('keydown', e => {
            if (e.key === 'Enter') go();
            if (e.key === 'Backspace' || e.key === 'Delete') return;
            if (!/^\d$/.test(e.key)) e.preventDefault();
        });
        this.shadowRoot.querySelector('#zip-input').addEventListener('input', e => {
            e.target.classList.remove('invalid');
            this.shadowRoot.querySelector('#error-slot').innerHTML = '';
        });
    }
}
customElements.define('location-prompt', LocationPrompt);
