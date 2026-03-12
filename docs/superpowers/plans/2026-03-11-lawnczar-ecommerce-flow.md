# lawnczar Implementation Plan: Chunk 3

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 4-step purchase/activation UI and integrate mocked Stripe payments.

**Architecture:** `<sale-stepper>` web component that overlays the map using CSS Grid stacking.

**Tech Stack:** Native Web Components, CSS Flexbox, Mocked Stripe API.

---

### Task 6: Sale Stepper Component

**Files:**
- Create: `js/sale-stepper.js`
- Modify: `index.html`

- [ ] **Step 1: Create `js/sale-stepper.js`**

```javascript
class SaleStepper extends HTMLElement {
    constructor() {
        super();
        this.currentStep = 1;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    nextStep() {
        this.currentStep++;
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex; flex-direction: column;
                    background: white; border-radius: 12px;
                    padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 90%; max-width: 400px;
                    position: absolute; bottom: 20px; left: 50%;
                    transform: translateX(-50%); z-index: 100;
                }
                .step { display: none; }
                .step.active { display: flex; flex-direction: column; gap: 10px; }
                button { background: var(--mint, #26a69a); color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
            </style>
            <div class="step ${this.currentStep === 1 ? 'active' : ''}">
                <h3>Step 1: Sale Details</h3>
                <input type="text" placeholder="Title" id="title">
                <textarea placeholder="Description"></textarea>
                <button onclick="this.getRootNode().host.nextStep()">Next</button>
            </div>
            <div class="step ${this.currentStep === 2 ? 'active' : ''}">
                <h3>Step 2: Upload Photo</h3>
                <input type="file" accept="image/*">
                <button onclick="this.getRootNode().host.nextStep()">Next</button>
            </div>
            <div class="step ${this.currentStep === 3 ? 'active' : ''}">
                <h3>Step 3: Schedule & Upsell</h3>
                <p>Activate 4 hours early for $5?</p>
                <button onclick="this.getRootNode().host.nextStep()">Schedule & Pay</button>
            </div>
            <div class="step ${this.currentStep === 4 ? 'active' : ''}">
                <h3>Step 4: Pay & Activate</h3>
                <div id="stripe-placeholder">Stripe Card Element Here</div>
                <button onclick="alert('Sale Activated!')">Complete Purchase</button>
            </div>
        `;
    }
}
customElements.define('sale-stepper', SaleStepper);
```

- [ ] **Step 2: Add `<sale-stepper>` to `index.html`**

```html
<app-shell>
    <lawn-map></lawn-map>
    <sale-stepper></sale-stepper>
</app-shell>
```

- [ ] **Step 3: Commit**

```bash
git add js/sale-stepper.js index.html
git commit -m "feat: implement 4-step sale purchase flow"
```

---

### Task 7: Final PWA & IPFS Polish

**Files:**
- Modify: `sw.js` (Add new JS files to cache)
- Modify: `style.css` (Add "playful" polish)

- [ ] **Step 1: Update `sw.js`**

```javascript
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/js/lawn-map.js',
  '/js/sale-stepper.js',
  '/manifest.json',
  '/assets/marker-sign.svg',
  '/assets/marker-mansion.svg',
  '/assets/marker-truck.svg'
];
```

- [ ] **Step 2: Add CSS polish in `style.css`**

```css
app-shell {
    position: relative; /* For absolute positioning of overlays */
}

input, textarea {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}
```

- [ ] **Step 3: Commit**

```bash
git add sw.js style.css
git commit -m "chore: final pwa polish and asset caching"
```
