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
            console.log('Lasso complete event received in app-shell:', e.detail);
            const deck = this.querySelector('swipe-deck');
            if (deck) {
                console.log('Setting cards in swipe-deck');
                deck.setCards(e.detail);
            } else {
                console.error('swipe-deck element not found!');
            }
        });
        this.addEventListener('keep-sale', (e) => {
            const savedSales = this.querySelector('saved-sales');
            if (savedSales) {
                savedSales.addSale(e.detail);
            }
        });
        this.addEventListener('view-marker', (e) => {
            const map = this.querySelector('lawn-map');
            if (map) {
                map.openMarkerPopup(e.detail.markerId);
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
