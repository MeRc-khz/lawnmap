# lawnczar Implementation Plan: Chunk 1

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the lawnczar project structure, set up the PWA foundation, and build the basic app shell.

**Architecture:** A decentralized PWA hosted on IPFS. Native Web Components with a CSS Grid app shell.

**Tech Stack:** Vanilla JS, HTML, CSS, Leaflet.js, Service Worker.

---

### Task 1: Initialize Project Structure

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `js/app.js`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>lawnczar</title>
    <link rel="stylesheet" href="style.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <app-shell>
        <div id="map"></div>
    </app-shell>
    <script src="js/app.js" type="module"></script>
</body>
</html>
```

- [ ] **Step 2: Create `style.css`**

```css
:root {
    --mint: #26a69a;
    --mango: #ffb300;
    --slate: #455a64;
    --white: #ffffff;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', sans-serif;
    height: 100vh;
    overflow: hidden;
}

app-shell {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    height: 100%;
}

#map {
    grid-area: 1 / 1;
    z-index: 1;
}
```

- [ ] **Step 3: Create `js/app.js`**

```javascript
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
```

- [ ] **Step 4: Commit**

```bash
git add index.html style.css js/app.js
git commit -m "chore: initialize project structure and basic app shell"
```

---

### Task 2: PWA Manifest & Service Worker

**Files:**
- Create: `manifest.json`
- Create: `sw.js`

- [ ] **Step 1: Create `manifest.json`**

```json
{
  "name": "lawnczar",
  "short_name": "lawnczar",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#26a69a",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 2: Create `sw.js`**

```javascript
const CACHE_NAME = 'lawnczar-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
```

- [ ] **Step 3: Commit**

```bash
git add manifest.json sw.js
git commit -m "feat: add pwa manifest and service worker"
```
