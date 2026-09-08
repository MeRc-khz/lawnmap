# LawnCzar Design Document & Style Guide
**Version 1.0 — 2026-09-08** · Repo: `/srv/projects/REPOS/lawnmap` · Live: lawnczar.com (React POC) / lawnczar.shop (native web components)

---

## 1. Product Overview

LawnCzar is a mobile-first **map-based marketplace PWA** for hyperlocal commerce: garage sales, estate sales, yard sales, moving sales, food trucks, markets, thrift. Launch region: **San Diego / 91950 (National City)**.

**Core loops:**
- **Shopper:** set ZIP → browse map → lasso a neighborhood → swipe cards (Tinder-style `<swipe-deck>`) into an itinerary → in-app optimized routing (OSRM).
- **Seller:** 4-step onboarding stepper (location → details → photos → schedule) → Stripe payment for active marker → printable QR signage.
- **Affiliate:** sign up (name + ZIP) → Solana wallet + QR generated → 5% commission on scanned purchases → auto on-chain payout at 0.1 SOL. Signup auto-provisions a regional OSRM server (~75–120s).

**Stack:** Vanilla Web Components (Shadow DOM), Leaflet.js, Node/Express, MongoDB 7 (`lawnczar` DB, Docker), OSRM Docker containers per region, Stripe, Solana (`@solana/web3.js`, devnet→mainnet), Vitest. No frontend framework — this is a hard convention.

## 2. Information Architecture

```
index.html → <app-shell>
  <location-prompt>   ZIP entry modal (first run / Shop button)
  <app-toolbar>       Mode switch: 🔍 Shop / ⭕ Lasso / 💰 Sell (top on desktop, bottom on mobile)
  <lawn-map>          Leaflet map, markers, lasso tool, route polylines
  <sale-stepper>      4-step seller wizard
  <swipe-deck>        Card swiping for lassoed results
  <saved-sales>       Itinerary side drawer (right, slide-in)
```

Z-index ladder: map 1 → toolbar 2000 → route drawer 5000 → swipe deck 10000 → saved-sales 15000 → location-prompt 30000.

**Design principles**
1. **Map is the app.** Everything else overlays it; chrome stays thin (70px toolbar).
2. **Thumb-first.** Bottom toolbar + `env(safe-area-inset-bottom)` on mobile; big hit areas (48px).
3. **One accent.** Teal does the talking; everything else is neutral surfaces.
4. **Web-components-native.** Styles live in each component's Shadow DOM; global `style.css` only hosts tokens + layout of the custom element tags.

## 3. Style Guide

### 3.1 Color Tokens

| Token | Value | Use |
|---|---|---|
| `--mint` (primary) | `#26a69a` | Active states, CTAs, route markers, branded headings |
| `--mint-dark` | `#00695c` | Primary hover/pressed |
| `--mango` (accent) | `#ffb300` | Promoted/sale highlights, QR signage accents |
| `--mango-dark` | `#f57f17` / `#ef6c00` | Accent pressed, warning text |
| `--slate` (ink) | `#455a64` | Body text, inactive button labels |
| iOS blue (link/info) | `#007AFF` | Informational links, secondary actions |
| Error | `#f44336` / surface `#ffebee` | Destructive, errors |
| Success surface | `#e8f5e9` | Confirmations |
| Teal tint surface | `#e0f2f1` | Selected chips, soft brand fills |
| Surface | `#ffffff`, alt `#f8f9fa` / `#f5f5f5` | Cards, buttons, drawers |
| App background | `#f0f2f5` | Body |
| Borders | `#eee` / `#e0e0e0` / `#dee2e6` | Hairlines, dashed placeholders |

Rules: never introduce a new hue without an existing token mapping. Teal = interactive brand action; mango = commerce/promo only; blue = informational only.

### 3.2 Typography
- **Family:** `Inter` with system fallback (`-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`). Inter is referenced but **not yet self-hosted** — add `@font-face` or Google Fonts link to index.html (gap noted).
- **Scale:** page/modal titles 18–20px/700 · buttons 14–16px/600 · body 14px/400 · secondary 12px · badges/labels 11px.
- Route stop numerals: 14px/700 white on 28px teal circle, 2px white ring.

### 3.3 Shape & Elevation
- **Radius scale:** 4px (small controls, map popups) · 8px (inputs, cards, secondary buttons) · 12px (primary buttons, drawers, prominent cards) · 16px (modals) · 50% (avatar/stop dots).
- **Shadows:** sm `0 2px 4px rgba(0,0,0,.05)` · md `0 2px 10px rgba(0,0,0,.1)` (toolbar) · lg `0 10px 40px rgba(0,0,0,.15)` (modals/drawer) · brand glow `0 4px 12px rgba(38,166,154,.3)` (active CTA only) · map marker `0 2px 4px rgba(0,0,0,.3)`.
- Overlay dim: `rgba(0,0,0,.5)` behind modals.

### 3.4 Motion
- Standard transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
- Drawer slide: `right 0.3s ease`. Button press: `transform: scale(0.95)` on `:active`. Swipe deck: card physics (translate + rotate on drag, spring release). No other animation without a functional purpose.

### 3.5 Components

**Buttons** — height 48px, radius 12px, weight 600. Inactive: `#f8f9fa` bg, slate text, sm shadow. Active: mint bg, white text, brand glow. Destructive: `#f44336`. All buttons ≥44px tap target.

**Toolbar** — 70px fixed; top + bottom hairline on desktop, bottom on mobile with safe-area padding; white bg, md shadow; 3 equal buttons (max-width 110px) with emoji + label.

**Modals (`location-prompt`, stepper)** — white, radius 16px, 90% width / max 400px, lg shadow, dimmed backdrop; heading in mint.

**Cards (swipe deck / saved sales)** — white, radius 12px, md/lg shadow, 1px `#eee` border, Inter. Promoted cards get mango treatment (`#fff8e1` surface).

**Inputs** — radius 8px, 1px border, 16px font, bold value text for code-entry (letter-spacing 5px for ZIP/OTP).

**Map markers** — SVG assets (`marker-sign` garage, `marker-mansion` estate, `marker-truck` truck; others default pin). Route stops: numbered teal circles.

**Empty/error states** — tinted surface + slate text; Stripe placeholder = dashed `#dee2e6` border, logo at 0.5 opacity.

### 3.6 Voice & Content
- Emoji-as-icon in toolbar/buttons is an established convention (🔍 ⭕ 💰) — keep it.
- Sentence case everywhere. CTAs are verbs: "Start Listing", "Shop", "Save".
- Money, distances, and commission always concrete ("5% commission", "0.1 SOL payout").
- Error copy states the fix ("Local changes present, skipping pull" → say what unblocks it).

### 3.7 Brand
- Wordmark: lowercase **lawnczar** (current `<title>`). "Czar" positioning = local royalty/curation authority. Crown motif available for signage/QR print assets.
- PWA: theme color `#26a69a`; manifest icons in `/assets`.

## 4. Known Gaps / Next Design Work
1. **Self-host Inter** (no `@font-face` today — falls back to system).
2. Consolidate `style.css` (live, 96 lines) vs `styles.css` (1-line Tailwind build, unused by index.html — candidate for deletion).
3. Extract repeated inline styles in components into shared `css/tokens.css` imported by each Shadow Root.
4. Marker set covers only garage/estate/truck — design SVGs for the other 8 sale types (yard, moving, market, block, thrift, craft, antique, community).
5. Dark mode: not designed; token architecture above makes it a token-swap when scheduled.

*Sources: repo `/srv/projects/REPOS/lawnmap` (HEAD 8cf25b3), wiki pages `entities/lawnczar.md`, `concepts/lawnczar-{qr-referral-network,auto-region-provisioning,agentic-route-planning}.md`.*
