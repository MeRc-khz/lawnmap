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

    openRoute() {
        if (this.saved.length === 0) return;
        
        // Create a multi-stop route
        // Origin is user's current location (omitted to use current)
        // Waypoints are the saved sales
        const waypoints = this.saved.map(s => `${s.lat},${s.lng}`).join('/');
        const url = `https://www.google.com/maps/dir//${waypoints}`;
        window.open(url, '_blank');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    right: ${this.isOpen ? '0' : '-300px'};
                    top: 0;
                    width: 300px;
                    height: 100vh;
                    background: white;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    transition: right 0.3s ease;
                    z-index: 5000;
                    display: flex;
                    flex-direction: column;
                    font-family: sans-serif;
                }
                .header {
                    padding: 20px;
                    background: #26a69a;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .close-btn {
                    cursor: pointer;
                    font-size: 20px;
                }
                .list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 10px;
                }
                .item {
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 12px;
                    margin-bottom: 10px;
                    background: #f9f9f9;
                    position: relative;
                }
                .item h4 { margin: 0 0 5px 0; color: #455a64; padding-right: 20px; }
                .item p { margin: 0; font-size: 12px; color: #666; }
                
                .delete-x {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    cursor: pointer;
                    color: #999;
                    font-size: 18px;
                }
                .delete-x:hover { color: #f44336; }

                .item-actions {
                    margin-top: 10px;
                }
                .btn-view {
                    background: #e0f2f1;
                    color: #26a69a;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                }
                .btn-main-route {
                    width: 100%;
                    padding: 15px;
                    background: #ffb300;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    font-size: 16px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .btn-main-route:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .toggle-tab {
                    position: absolute;
                    left: -40px;
                    top: 80px;
                    width: 40px;
                    height: 40px;
                    background: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px 0 0 8px;
                    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
                    cursor: pointer;
                    z-index: 5001;
                }
            </style>
            <div class="toggle-tab" id="toggle-tab">
                ${this.isOpen ? '➡️' : '📜'}
            </div>
            <div class="header">
                <h3>Itinerary (${this.saved.length})</h3>
                <span class="close-btn" id="close-x">✕</span>
            </div>
            <div class="list">
                ${this.saved.length === 0 ? '<div class="empty-msg" style="text-align: center; color: #999; margin-top: 40px;">Your itinerary is empty.</div>' : ''}
                ${this.saved.map((sale, index) => `
                    <div class="item">
                        <span class="delete-x" data-index="${index}">✕</span>
                        <h4>${sale.title}</h4>
                        <p>${sale.description.substring(0, 60)}...</p>
                        <div class="item-actions">
                            <button class="btn-view" data-id="${sale.id}">👁️ View on Map</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="footer">
                <button class="btn-main-route" id="main-route-btn" ${this.saved.length === 0 ? 'disabled' : ''}>
                    🗺️ Start Route
                </button>
            </div>
        `;

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
