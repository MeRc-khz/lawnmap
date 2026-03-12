class AppShell extends HTMLElement {
    constructor() {
        super();
        console.log('lawnczar app shell initialized');
    }
}
customElements.define('app-shell', AppShell);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js');
    });
}
