
import { LC_TOKENS, lcToast, lcEmptyState } from './lc-ui.js';

class SavedSales extends HTMLElement {
    constructor() {
        super();
        this.saved = [];
        this.isOpen = false;
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    addSale(sale) {
        if (!this.saved.find(s => s.id === sale.id)) {
            this.saved.push(sale);
            this.isOpen = true;
            this.render();
        }
    }

    removeSale(index) {
        this.saved.splice(index, 1);
        if (this.saved.length === 0) this.isOpen = false;
        this.render();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.render();
    }

    async openRoute() {
        if (this.saved.length === 0) return;

        const routeBtn = this.shadowRoot.querySelector('#main-route-btn');
        if (routeBtn) {
            routeBtn.disabled = true;
            routeBtn.innerHTML = '<span class="spinner"></span> Calculating route…';
        }

        try {
            const response = await fetch('/api/route', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stops: this.saved })
            });
            if (!response.ok) throw new Error(`Route API error: ${response.status}`);
            const data = await response.json();

            // Dispatch event with route geometry + ordered stops
            this.dispatchEvent(new CustomEvent('route-ready', {
                detail: {
                    geometry: data.geometry,
                    stops: this.saved,
                    duration: data.duration,
                    distance: data.distance,
                    provider: data.provider,
                    region: data.region
                },
                bubbles: true,
                composed: true
            }));

            // Update button with route info + provider
            if (routeBtn) {
                const providerTag = data.provider === 'osrm' && data.region
                    ? ` (${data.region})`
                    : data.provider === 'mapbox'
                        ? ' (mapbox)'
                        : '';
                routeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"/></svg> ${data.distance} mi \u00b7 ${data.duration} min${providerTag}`;
                routeBtn.disabled = false;
            }
            lcToast('Route optimized \u2014 added to map', 'success');
        } catch (error) {
            console.error('Route error:', error);
            if (routeBtn) {
                routeBtn.textContent = 'Route failed \u2014 tap to retry';
                routeBtn.disabled = false;
            }
            lcToast('Could not calculate route. Try again.', 'error');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                ${LC_TOKENS}
                :host {
                    position: absolute;
                    top: 80px; right: 12px;
                    width: 300px; max-height: calc(100% - 170px);
                    display: flex; flex-direction: column;
                    z-index: 5000;
                    font-family: inherit;
                    transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
                }
                @media (max-width: 600px) {
                    :host {
                        top: auto; bottom: 84px; right: 10px;
                        width: min(92vw, 320px); max-height: 55vh;
                    }
                }
                :host(.closed) { pointer-events: none; }
                :host(.closed) .panel { transform: translateX(calc(100% + 20px)); opacity: 0; }
                .panel {
                    background: var(--surface);
                    border-radius: var(--radius-l);
                    box-shadow: var(--shadow-3);
                    border: 1px solid var(--line);
                    display: flex; flex-direction: column;
                    max-height: inherit;
                    overflow: hidden;
                    transition: transform 0.3s var(--ease), opacity 0.3s var(--ease);
                }
                .header {
                    background: linear-gradient(135deg, var(--mint) 0%, var(--mint-dark) 100%);
                    color: #fff;
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 13px 16px;
                }
                .header h3 {
                    margin: 0; font-size: 14.5px; font-weight: 700; letter-spacing: 0.01em;
                    display: flex; align-items: center; gap: 8px;
                }
                .count-pill {
                    background: rgba(255,255,255,0.22); border-radius: 999px;
                    font-size: 11.5px; padding: 2px 9px; font-weight: 800;
                }
                .header .close-btn {
                    cursor: pointer; display: inline-flex; padding: 4px; border-radius: 8px;
                    background: rgba(255,255,255,0.14); border: none;
                    transition: background var(--t-fast);
                }
                .header .close-btn:hover { background: rgba(255,255,255,0.28); }
                .list { flex-grow: 1; overflow-y: auto; padding: 12px; }
                .item {
                    border: 1px solid var(--line); border-radius: var(--radius-m);
                    padding: 12px 13px; margin-bottom: 9px; background: var(--surface-alt);
                    position: relative;
                    transition: box-shadow var(--t-fast), border-color var(--t-fast);
                    animation: lc-fade-in 0.2s var(--ease) both;
                }
                .item:hover { box-shadow: var(--shadow-1); border-color: var(--mint-soft); }
                .item h4 { margin: 0 0 4px 0; color: var(--ink); padding-right: 22px; font-size: 14px; font-weight: 700; }
                .item p { margin: 0; font-size: 12.5px; color: var(--slate); line-height: 1.45; }
                .delete-x {
                    position: absolute; top: 8px; right: 8px; cursor: pointer;
                    color: #b0bec5; border: none; background: none; padding: 4px;
                    border-radius: 6px; display: inline-flex;
                    transition: color var(--t-fast), background var(--t-fast);
                }
                .delete-x:hover { color: var(--danger); background: var(--danger-soft); }
                .item-actions { margin-top: 9px; }
                .btn-view {
                    background: var(--mint-soft); color: var(--mint-dark); border: none;
                    padding: 6px 12px; border-radius: 8px; font-size: 11.5px;
                    font-weight: 700; cursor: pointer; font-family: inherit;
                    display: inline-flex; align-items: center; gap: 5px;
                    transition: background var(--t-fast);
                }
                .btn-view:hover { background: #b2dfdb; }
                .footer { padding: 14px; border-top: 1px solid var(--line); background: var(--surface); }
                .btn-main-route {
                    width: 100%; padding: 13px; background: var(--mango); color: #fff;
                    border: none; border-radius: var(--radius-m); font-weight: 800;
                    font-size: 15px; cursor: pointer; font-family: inherit;
                    display: flex; align-items: center; justify-content: center; gap: 9px;
                    box-shadow: 0 3px 10px rgba(255, 179, 0, 0.35);
                    transition: background var(--t-fast), transform var(--t-fast), box-shadow var(--t-fast);
                }
                .btn-main-route:hover:not(:disabled) { background: #ffa000; box-shadow: 0 5px 14px rgba(255, 179, 0, 0.45); }
                .btn-main-route:active:not(:disabled) { transform: scale(0.98); }
                .btn-main-route:disabled { background: #cfd8dc; box-shadow: none; cursor: not-allowed; }
                .toggle-tab {
                    position: absolute; right: 100%; top: 10px; margin-right: 8px;
                    width: 40px; height: 40px;
                    background: var(--surface); border: 1px solid var(--line);
                    display: flex; align-items: center; justify-content: center;
                    border-radius: var(--radius-s); box-shadow: var(--shadow-2);
                    cursor: pointer; transition: background var(--t-fast), transform var(--t-fast);
                }
                .toggle-tab:hover { background: var(--mint-soft); transform: translateX(-2px); }
                .toggle-tab svg { color: var(--mint-dark); }
                .empty-msg { text-align: center; color: #90a4ae; padding-top: 8px; }
            </style>
            <div class="toggle-tab" id="toggle-tab" title="Saved sales">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>
            </div>
            <div class="panel">
                <div class="header">
                    <h3>Itinerary <span class="count-pill">${this.saved.length}</span></h3>
                    <button class="close-btn" id="close-x" title="Hide">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>
                <div class="list">
                    ${this.saved.length === 0
                        ? lcEmptyState('<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>', 'Your itinerary is empty', 'Swipe right on sales to save them here')
                        : ''}
                    ${this.saved.map((sale, index) => `
                        <div class="item">
                            <button class="delete-x" data-index="${index}" title="Remove">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                            <h4>${sale.title}</h4>
                            <p>${(sale.description || '').substring(0, 60)}...</p>
                            <div class="item-actions">
                                <button class="btn-view" data-id="${sale.id}">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/></svg>
                                    View on Map
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="footer">
                    <button class="btn-main-route" id="main-route-btn" ${this.saved.length === 0 ? 'disabled' : ''}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"/></svg>
                        Start Route
                    </button>
                </div>
            </div>
        `;

        this.shadowRoot.classList.toggle('closed', !this.isOpen);
        this.shadowRoot.querySelector('#toggle-tab').onclick = () => this.toggle();
        this.shadowRoot.querySelector('#close-x').onclick = () => this.toggle();

        const routeBtn = this.shadowRoot.querySelector('#main-route-btn');
        if (routeBtn) routeBtn.onclick = () => this.openRoute();

        this.shadowRoot.querySelectorAll('.delete-x').forEach(btn => {
            btn.onclick = () => this.removeSale(parseInt(btn.dataset.index));
        });

        this.shadowRoot.querySelectorAll('.btn-view').forEach(btn => {
            btn.onclick = () => {
                const markerId = btn.dataset.id;
                this.dispatchEvent(new CustomEvent('view-marker', {
                    detail: { markerId },
                    bubbles: true,
                    composed: true
                }));
                // On mobile, close sidebar when viewing
                if (window.innerWidth <= 600) this.toggle();
            };
        });
    }
}
customElements.define('saved-sales', SavedSales);
