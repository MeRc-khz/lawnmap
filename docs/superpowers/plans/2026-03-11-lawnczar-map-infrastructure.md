# lawnczar Implementation Plan: Chunk 2

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Leaflet.js, set up custom icons, and implement the marker sync logic.

**Architecture:** Encapsulated `<lawn-map>` web component managing the Leaflet lifecycle.

**Tech Stack:** Leaflet.js, SVG for icons, Fetch API.

---

### Task 3: Leaflet Integration & Map Initialization

**Files:**
- Modify: `index.html`
- Create: `js/lawn-map.js`

- [ ] **Step 1: Add Leaflet CDN to `index.html`**

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
```

- [ ] **Step 2: Create `js/lawn-map.js`**

```javascript
class LawnMap extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
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
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    }
}
customElements.define('lawn-map', LawnMap);
```

- [ ] **Step 3: Add `<lawn-map>` to `index.html`**

```html
<app-shell>
    <lawn-map></lawn-map>
</app-shell>
```

- [ ] **Step 4: Commit**

```bash
git add js/lawn-map.js index.html
git commit -m "feat: integrate leaflet and create lawn-map component"
```

---

### Task 4: Custom Marker Icons

**Files:**
- Create: `assets/marker-sign.svg`
- Create: `assets/marker-mansion.svg`
- Create: `assets/marker-truck.svg`

- [ ] **Step 1: Create `assets/marker-sign.svg` (Garage Sale)**

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="60" height="40" fill="#ffb300" rx="4"/>
  <rect x="45" y="60" width="10" height="20" fill="#455a64"/>
  <text x="50" y="45" font-size="12" text-anchor="middle" fill="white" font-family="sans-serif">SALE</text>
</svg>
```

- [ ] **Step 2: Create `assets/marker-mansion.svg` (Estate Sale)**

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M20 80 V50 L50 20 L80 50 V80 Z" fill="#26a69a"/>
  <rect x="40" y="60" width="20" height="20" fill="white"/>
</svg>
```

- [ ] **Step 3: Create `assets/marker-truck.svg` (Food Truck)**

```xml
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="40" width="50" height="40" fill="#ff7043" rx="4"/>
  <rect x="70" y="55" width="20" height="25" fill="#cfd8dc" rx="2"/>
  <circle cx="35" cy="80" r="8" fill="#455a64"/>
  <circle cx="75" cy="80" r="8" fill="#455a64"/>
</svg>
```

- [ ] **Step 4: Commit**

```bash
git add assets/*.svg
git commit -m "feat: add playful custom marker icons"
```

---

### Task 5: Marker Sync & Data Model

**Files:**
- Create: `data/markers.json`
- Modify: `js/lawn-map.js`

- [ ] **Step 1: Create `data/markers.json`**

```json
[
  {
    "id": "1",
    "type": "garage",
    "lat": 51.505,
    "lng": -0.09,
    "title": "Weekend Garage Sale",
    "description": "Furniture and toys."
  },
  {
    "id": "2",
    "type": "estate",
    "lat": 51.51,
    "lng": -0.1,
    "title": "Mansion Estate Sale",
    "description": "Antiques and art."
  },
  {
    "id": "3",
    "type": "truck",
    "lat": 51.49,
    "lng": -0.08,
    "title": "Taco Truck",
    "description": "Best street tacos in town!"
  }
]
```

- [ ] **Step 2: Implement Fetch and Render in `js/lawn-map.js`**

```javascript
// Inside LawnMap class
async loadMarkers() {
    const response = await fetch('data/markers.json');
    const markers = await response.json();
    markers.forEach(m => this.addMarker(m));
}

addMarker(data) {
    const icon = L.icon({
        iconUrl: `assets/marker-${data.type === 'garage' ? 'sign' : data.type}.svg`,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
    });
    L.marker([data.lat, data.lng], { icon }).addTo(this.map)
     .bindPopup(`<b>${data.title}</b><br>${data.description}`);
}
```

- [ ] **Step 3: Commit**

```bash
git add data/markers.json js/lawn-map.js
git commit -m "feat: implement marker sync and rendering"
```
