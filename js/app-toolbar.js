import { LC_TOKENS } from './lc-ui.js';

const ICONS = {
    shop: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
    lasso: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="10" r="6.5"/><path d="M8.5 15.5 7 21l5-2.5L17 21l-1.5-5.5"/></svg>`,
    sell: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 6.5c-1-1.7-2.8-2.5-5-2.5-2.8 0-5 1.4-5 3.8 0 4.7 10 2.9 10 7.4 0 2.4-2.2 3.8-5 3.8-2.2 0-4-.8-5-2.5"/></svg>`,
};

class AppToolbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMode = 'shop';
        this.render();
    }

    connectedCallback() {
        console.log('AppToolbar connected');
    }

    setMode(mode) {
        // If switching to shop mode, show the zip code prompt
        if (mode === 'shop') {
            this.dispatchEvent(new CustomEvent('shop-zip-prompt', {
                detail: {},
                bubbles: true,
                composed: true
            }));
        }
        this.currentMode = mode;
        this.render();
        this.dispatchEvent(new CustomEvent('mode-change', {
            detail: { mode },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${LC_TOKENS}
                :host {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                    gap: 10px;
                    padding: 0 10px;
                }
                button {
                    flex: 1;
                    max-width: 130px;
                    height: 46px;
                    border: 1.5px solid transparent;
                    border-radius: var(--radius-m);
                    background: var(--surface-alt);
                    color: var(--slate);
                    font-weight: 650;
                    font-size: 14px;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all var(--t-med);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: var(--shadow-1);
                }
                button:hover:not(.active) {
                    background: var(--mint-soft);
                    color: var(--mint-dark);
                    box-shadow: var(--shadow-2);
                }
                button:active { transform: scale(0.95); }
                button.active {
                    background: var(--mint);
                    color: white;
                    box-shadow: 0 4px 14px rgba(38, 166, 154, 0.35);
                }
                button.active svg { stroke: white; }
                @media (min-width: 601px) {
                    :host {
                        box-shadow: var(--shadow-2);
                    }
                }
            </style>
            <button class="${this.currentMode === 'shop' ? 'active' : ''}" id="btn-shop">${ICONS.shop}<span>Shop</span></button>
            <button class="${this.currentMode === 'lasso' ? 'active' : ''}" id="btn-lasso">${ICONS.lasso}<span>Lasso</span></button>
            <button class="${this.currentMode === 'sell' ? 'active' : ''}" id="btn-sell">${ICONS.sell}<span>Sell</span></button>
        `;

        this.shadowRoot.querySelector('#btn-shop').onclick = () => this.setMode('shop');
        this.shadowRoot.querySelector('#btn-lasso').onclick = () => this.setMode('lasso');
        this.shadowRoot.querySelector('#btn-sell').onclick = () => this.setMode('sell');
    }
}
customElements.define('app-toolbar', AppToolbar);
