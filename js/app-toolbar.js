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
                    max-width: 110px;
                    height: 48px;
                    border: none;
                    border-radius: 12px;
                    background: #f8f9fa;
                    color: #455a64;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                button:active {
                    transform: scale(0.95);
                }
                button.active {
                    background: #26a69a;
                    color: white;
                    box-shadow: 0 4px 12px rgba(38, 166, 154, 0.3);
                }
                @media (min-width: 601px) {
                    :host {
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                }
            </style>
            <button class="${this.currentMode === 'shop' ? 'active' : ''}" id="btn-shop">🔍 Shop</button>
            <button class="${this.currentMode === 'lasso' ? 'active' : ''}" id="btn-lasso">⭕ Lasso</button>
            <button class="${this.currentMode === 'sell' ? 'active' : ''}" id="btn-sell">💰 Sell</button>
        `;

        this.shadowRoot.querySelector('#btn-shop').onclick = () => this.setMode('shop');
        this.shadowRoot.querySelector('#btn-lasso').onclick = () => this.setMode('lasso');
        this.shadowRoot.querySelector('#btn-sell').onclick = () => this.setMode('sell');
    }
}
customElements.define('app-toolbar', AppToolbar);
