# GEMINI.md

## Project Overview
`lawnczar` is a decentralized PWA map application for sellers and shoppers. It allows sellers to purchase and schedule sale markers and shoppers to discover sales via an interactive map with lasso and swipe-based discovery.

## Directory Overview
- `assets/`: Custom marker SVG icons.
- `data/`: JSON data store for active sale markers.
- `docs/superpowers/`: Design specifications and implementation plans.
- `js/`: Core application logic and Native Web Components (`app-shell`, `lawn-map`, `sale-stepper`, `swipe-deck`).
- `index.html`: Main application entry point.
- `manifest.json`: PWA configuration.
- `style.css`: Global styles and CSS Grid layout.
- `sw.js`: Service worker for offline-first support.

## Core Features (Implemented)
- **Map View:** Leaflet.js integration with marker rendering.
- **Seller Flow:** 4-step purchase/activation UI stepper.
- **Shopper Discovery:** Freehand lasso selection and swipe-based itinerary deck.
- **PWA support:** Offline caching and standalone installation.

## Usage
The application is currently a functional front-end prototype. To view, serve the root directory using a local web server (e.g., `python3 -m http.server 8000`).
