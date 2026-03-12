# lawnczar Implementation Plan: Chunk 4

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Shopper Discovery flow, including the Freehand Lasso selection and the Swipe Deck.

**Architecture:** Shopper logic integrated into `<lawn-map>` and standalone `<swipe-deck>` and `<itinerary-router>` components.

**Tech Stack:** Leaflet.js, Canvas (for drawing), Leaflet Routing Machine.

---

### Task 9: Lasso Selection Tool

**Files:**
- Modify: `js/lawn-map.js`

- [ ] **Step 1: Add Lasso Drawing Logic in `js/lawn-map.js`**

```javascript
// Inside LawnMap class
initLasso() {
    this.isDrawing = false;
    this.points = [];
    this.lassoLayer = L.polyline([], { color: 'var(--mint, #26a69a)', dashArray: '5, 5' }).addTo(this.map);

    this.map.on('mousedown', (e) => {
        if (!this.shopperMode) return;
        this.isDrawing = true;
        this.points = [e.latlng];
        this.lassoLayer.setLatLngs(this.points);
    });

    this.map.on('mousemove', (e) => {
        if (!this.isDrawing) return;
        this.points.push(e.latlng);
        this.lassoLayer.setLatLngs(this.points);
    });

    this.map.on('mouseup', () => {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.finishLasso();
    });
}

finishLasso() {
    // Spatial intersection check against active markers
    const polygon = L.polygon(this.points);
    const selected = this.activeMarkers.filter(m => {
        return polygon.getBounds().contains(m.getLatLng()); // Simplified for now
    });
    this.dispatchEvent(new CustomEvent('lasso-complete', { detail: selected }));
}
```

- [ ] **Step 2: Commit**

```bash
git add js/lawn-map.js
git commit -m "feat: add freehand lasso selection logic"
```

---

### Task 10: Swipe Discovery Deck

**Files:**
- Create: `js/swipe-deck.js`
- Modify: `index.html`

- [ ] **Step 1: Create `js/swipe-deck.js`**

```javascript
class SwipeDeck extends HTMLElement {
    constructor() {
        super();
        this.cards = [];
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    setCards(markers) {
        this.cards = markers;
        this.render();
    }

    swipe(direction) {
        const card = this.cards.pop();
        if (direction === 'right') {
            this.dispatchEvent(new CustomEvent('keep-sale', { detail: card }));
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: ${this.cards.length ? 'flex' : 'none'};
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 300px; height: 400px; z-index: 200;
                }
                .card {
                    background: white; border-radius: 12px; padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%;
                }
                .actions { display: flex; justify-content: space-around; margin-top: 20px; }
            </style>
            ${this.cards.length ? `
                <div class="card">
                    <h3>${this.cards[this.cards.length - 1].title}</h3>
                    <p>${this.cards[this.cards.length - 1].description}</p>
                    <div class="actions">
                        <button onclick="this.getRootNode().host.swipe('left')">❌ Discard</button>
                        <button onclick="this.getRootNode().host.swipe('right')">✅ Keep</button>
                    </div>
                </div>
            ` : ''}
        `;
    }
}
customElements.define('swipe-deck', SwipeDeck);
```

- [ ] **Step 2: Add `<swipe-deck>` to `index.html`**

```html
<app-shell>
    <lawn-map></lawn-map>
    <swipe-deck></swipe-deck>
</app-shell>
```

- [ ] **Step 3: Commit**

```bash
git add js/swipe-deck.js index.html
git commit -m "feat: implement swipe-based discovery deck"
```
