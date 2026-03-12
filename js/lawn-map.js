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
        
        this.activeMarkers = [];
        this.shopperMode = true; // Enabled by default for testing
        this.loadMarkers();
        this.initLasso();
    }

    initLasso() {
        this.isDrawing = false;
        this.lassoPoints = [];
        this.lassoLayer = L.polyline([], { color: '#26a69a', dashArray: '5, 5' }).addTo(this.map);

        this.map.on('mousedown', (e) => {
            if (!this.shopperMode) return;
            this.isDrawing = true;
            this.lassoPoints = [e.latlng];
            this.lassoLayer.setLatLngs(this.lassoPoints);
            this.map.dragging.disable();
        });

        this.map.on('mousemove', (e) => {
            if (!this.isDrawing) return;
            this.lassoPoints.push(e.latlng);
            this.lassoLayer.setLatLngs(this.lassoPoints);
        });

        this.map.on('mouseup', () => {
            if (!this.isDrawing) return;
            this.isDrawing = false;
            this.map.dragging.enable();
            this.finishLasso();
        });
    }

    finishLasso() {
        if (this.lassoPoints.length < 3) {
            this.lassoLayer.setLatLngs([]);
            return;
        }
        
        const polygon = L.polygon(this.lassoPoints);
        const selected = this.activeMarkers.filter(m => {
            const latlng = m.getLatLng();
            // Simple bounds check for now
            return polygon.getBounds().contains(latlng);
        });
        
        console.log('Selected markers:', selected);
        this.dispatchEvent(new CustomEvent('lasso-complete', { detail: selected, bubbles: true, composed: true }));
        this.lassoLayer.setLatLngs([]);
    }

    async loadMarkers() {
        try {
            const response = await fetch('/api/markers');
            const markers = await response.json();
            markers.forEach(m => this.addMarker(m));
        } catch (error) {
            console.error('Error loading markers:', error);
        }
    }

    addMarker(data) {
        const icon = L.icon({
            iconUrl: `assets/marker-${data.type === 'garage' ? 'sign' : data.type}.svg`,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });
        const marker = L.marker([data.lat, data.lng], { icon }).addTo(this.map)
         .bindPopup(`<b>${data.title}</b><br>${data.description}`);
        this.activeMarkers.push(marker);
    }
}
customElements.define('lawn-map', LawnMap);
