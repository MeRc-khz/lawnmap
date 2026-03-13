import { AdManager } from './ad-manager.js';

class AppShell extends HTMLElement {
    constructor() {
        super();
        console.log('lawnczar app shell initialized');
        this.featuredSales = [];
        this.loadFallbacks();
    }

    async loadFallbacks() {
        try {
            const response = await fetch('/api/markers');
            const markers = await response.json();
            this.featuredSales = markers.filter(m => m.type === 'featured' || m.isAd);
            console.log('Fallbacks loaded:', this.featuredSales.length);
        } catch (error) {
            console.error('Error loading fallbacks:', error);
        }
    }

    connectedCallback() {
        console.log('AppShell connected');
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
                const finalCards = AdManager.injectAds(e.detail, this.featuredSales);
                deck.setCards(finalCards);
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
        this.addEventListener('location-set', (e) => {
            const map = this.querySelector('lawn-map');
            if (map) {
                map.centerOn(e.detail.lat, e.detail.lng);
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
