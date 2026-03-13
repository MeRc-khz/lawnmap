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
        this.currentMode = 'shop';
        this.loadMarkers();
        this.initLasso();

        this.map.on('click', (e) => {
            if (this.currentMode === 'sell') {
                this.handleSellerClick(e.latlng);
            }
        });
    }

    setMode(mode) {
        this.currentMode = mode;
        
        // Clear temp markers if exiting sell mode
        if (mode !== 'sell' && this.tempSellerMarker) {
            this.map.removeLayer(this.tempSellerMarker);
            this.tempSellerMarker = null;
        }
    }

    handleSellerClick(latlng) {
        if (this.tempSellerMarker) {
            this.map.removeLayer(this.tempSellerMarker);
        }

        this.tempSellerMarker = L.marker(latlng).addTo(this.map);
        
        const container = document.createElement('div');
        container.innerHTML = `
            <div style="text-align: center;">
                <p style="margin: 0 0 10px 0; font-weight: bold; font-family: sans-serif;">Confirm Location?</p>
                <button id="confirm-sell-btn" style="background: #26a69a; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-weight: bold;">Start Listing</button>
            </div>
        `;

        container.querySelector('#confirm-sell-btn').onclick = () => {
            this.map.closePopup();
            this.dispatchEvent(new CustomEvent('start-sell-flow', { 
                detail: { latlng },
                bubbles: true,
                composed: true
            }));
        };

        this.tempSellerMarker.bindPopup(container).openPopup();
    }

    initLasso() {
        this.isDrawing = false;
        this.lassoPoints = [];
        this.lassoLayer = L.polygon([], { 
            color: '#26a69a', 
            weight: 2,
            dashArray: '5, 5',
            fillColor: '#26a69a',
            fillOpacity: 0.1
        }).addTo(this.map);

        this.map.on('mousedown', (e) => {
            if (this.currentMode !== 'lasso') return;
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
            if (this.currentMode === 'lasso') {
                this.map.dragging.enable();
            }
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
