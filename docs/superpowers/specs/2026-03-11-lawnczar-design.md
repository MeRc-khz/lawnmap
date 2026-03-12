# Design Document: lawnczar

**Topic:** Decentralized PWA Map Application for Sellers and Shoppers
**Date:** 2026-03-11
**Status:** Approved

## Project Overview
`lawnczar` is an ecommerce-driven map application that empowers both sellers and shoppers. Sellers can purchase and schedule markers for yard sales, estate sales, and food trucks. Shoppers can discover sales through an interactive "Circle-to-Select" lasso tool, build an itinerary via a swipe-based discovery UI, and generate optimized routes.

## Core Modes
- **Sell Mode:** A 4-step purchase and activation flow.
- **Shop Mode:** A discovery flow centered on area selection and itinerary building.

## Architecture
- **Hosting:** IPFS (Decentralized)
- **Application Type:** Progressive Web App (PWA) with Service Worker for offline-first support.
- **Frontend Core:** Native Web Components (Shadow DOM) + Leaflet.js.
- **Layout:** CSS Grid for the main shell; Flexbox for internal component layouts.
- **Data Sync:** Periodic fetching of a `markers.json` file for lightweight state updates.
- **Payments:** Stripe integration for purchasing markers.
- **Video:** Embedded widget (Agora/Daily.co) for live streaming in marker popups.
- **Routing:** Leaflet Routing Machine for optimal sales route calculation.

## Component Structure
- `<app-shell>`: The root container, managing the PWA lifecycle and toggling between Sell and Shop modes.
- `<lawn-map>`: Encapsulates Leaflet.js, handling marker rendering, GPS tracking, and the Lasso tool.
- `<sale-marker>`: Custom markers with playful icons and video dialogs.
- `<sale-stepper>` (Sell Mode): 4-step UI (Details, Media, Scheduling/Upsell, Payment/Activation).
- `<shopper-lasso>` (Shop Mode): Captures freehand drawing on the map for area-based selection.
- `<swipe-deck>` (Shop Mode): A Tinder-style card stack for building a sales itinerary.
- `<itinerary-router>` (Shop Mode): Renders the optimal route between all selected sales.

## User Flows

### Seller Flow
1. **Details:** Enter sale title, type, and description.
2. **Media:** Upload a photo (stored on IPFS/S3).
3. **Schedule:** Pick a date/time; opt-in for early activation upsell.
4. **Pay & Activate:** Pay via Stripe; marker activates at current GPS location on the scheduled day.
5. **Stream:** Go live with video directly on the marker when the sale starts.

### Shopper Flow
1. **Lasso:** Circle a section of the map to select nearby sales.
2. **Discovery:** Swipe right to "Keep" a sale or left to "Discard" it from the list.
3. **Route:** View an optimized route to all the "Keep" sales on the map.

## Visual Design
- **Theme:** Modern, playful, and high-impact.
- **Icons:** Yard sale sign (Garage), Mansion (Estate), Moving truck (Food Truck).
- **Palette:** Mint, Mango, and Slate (CSS Variables).

## Decentralization & PWA Strategy
- **IPFS Gateway Compatibility:** Use relative paths for all assets.
- **Service Worker:** Caches 100% of UI assets for offline-first performance.
- **Web Manifest:** Enables "Add to Home Screen" installation on mobile devices.
