class AppShell extends HTMLElement {
    constructor() {
        super();
        console.log('lawnczar app shell initialized');
    }

    connectedCallback() {
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
