class AppToolbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMode = 'shop';
        this.render();
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
                    justify-content: center;
                    align-items: center;
                    background: white;
                    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
                    height: 60px;
                    z-index: 1000;
                    gap: 10px;
                    padding: 0 10px;
                }
                button {
                    flex: 1;
                    max-width: 120px;
                    height: 40px;
                    border: none;
                    border-radius: 8px;
                    background: #f5f5f5;
                    color: #455a64;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                button.active {
                    background: #26a69a;
                    color: white;
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
