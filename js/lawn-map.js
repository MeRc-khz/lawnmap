class LawnMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
            <style>
                :host { display: block; height: 100%; }
                #map-container { height: 100%; }
            </style>
            <div id="map-container"></div>
        `;
    }

    connectedCallback() {
        const container = this.shadowRoot.querySelector('#map-container');
        this.map = L.map(container).setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
    }
}
customElements.define('lawn-map', LawnMap);
