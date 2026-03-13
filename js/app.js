class AppShell extends HTMLElement {
    constructor() {
        super();
        console.log('lawnczar app shell initialized');
    }

    connectedCallback() {
        this.addEventListener('mode-change', (e) => {
            const map = this.querySelector('lawn-map');
            if (map) {
                map.setMode(e.detail.mode);
            }
        });
        this.addEventListener('start-sell-flow', (e) => {
            const stepper = this.querySelector('sale-stepper');
            if (stepper) {
                stepper.style.display = 'flex';
                stepper.listingLocation = e.detail.latlng;
            }
        });
        this.addEventListener('lasso-complete', (e) => {
            const deck = this.querySelector('swipe-deck');
            if (deck) {
                deck.setCards(e.detail);
            }
        });
    }
}
customElements.define('app-shell', AppShell);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}
