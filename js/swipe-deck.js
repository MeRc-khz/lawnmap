class SwipeDeck extends HTMLElement {
    constructor() {
        super();
        this.cards = [];
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    setCards(input) {
        console.log('swipe-deck.setCards called with:', input.length, 'items');
        if (input.length === 0) {
            this.cards = [];
            this.render();
            return;
        }
        
        // Handle both Leaflet markers and raw card objects
        this.cards = input.map(item => {
            // If it's already a card object (has isAd or type: 'featured'/'ad')
            if (item.isAd || item.type === 'featured' || item.type === 'ad' || (item.title && item.description && !item.getPopup)) {
                return item;
            }
            
            // Assume it's a Leaflet marker
            const popup = item.getPopup().getContent();
            const div = document.createElement('div');
            div.innerHTML = popup;
            const latlng = item.getLatLng();
            return {
                id: item.options.id,
                lat: latlng.lat,
                lng: latlng.lng,
                title: div.querySelector('b').innerText,
                description: div.innerText.replace(div.querySelector('b').innerText, '').trim(),
                type: 'sale'
            };
        });
        console.log('Processed cards:', this.cards);
        this.render();
    }

    swipe(direction) {
        const card = this.cards.pop();
        if (direction === 'right') {
            console.log('Keeping:', card.title);
            // If it's a real sale, dispatch keep event
            if (!card.isAd) {
                this.dispatchEvent(new CustomEvent('keep-sale', { detail: card, bubbles: true, composed: true }));
            } else if (card.adUrl) {
                window.open(card.adUrl, '_blank');
            }
        } else {
            console.log('Discarding:', card.title);
        }
        this.render();
    }

    render() {
        const currentCard = this.cards.length ? this.cards[this.cards.length - 1] : null;
        const isPromoted = currentCard ? (currentCard.isAd || currentCard.type === 'featured' || currentCard.type === 'ad') : false;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: ${this.cards.length ? 'flex' : 'none'};
                    position: absolute; top: 50%; left: 50%; 
                    transform: translate(-50%, -50%);
                    width: 90%; max-width: 320px; 
                    height: 450px; z-index: 200;
                    font-family: sans-serif;
                }
                .card {
                    background: white; border-radius: 16px; 
                    padding: 24px; box-shadow: 0 15px 45px rgba(0,0,0,0.15); 
                    width: 100%; display: flex; flex-direction: column;
                    justify-content: space-between;
                    border: 1px solid #eee;
                    transition: all 0.3s ease;
                }
                .card.promoted {
                    border: 2px solid #fff8e1;
                    background: #fffdf7;
                }
                .actions { display: flex; justify-content: space-around; margin-top: 24px; gap: 15px; }
                button { 
                    flex: 1; border: none; padding: 14px; border-radius: 8px; 
                    cursor: pointer; font-weight: bold; font-size: 16px;
                }
                .btn-discard { background: #ffebee; color: #f44336; }
                .btn-keep { background: #e8f5e9; color: #4caf50; }
                .btn-view { background: #fff8e1; color: #f57f17; }
                h2 { color: #455a64; margin: 0 0 10px 0; }
                p { color: #666; font-size: 16px; line-height: 1.5; flex-grow: 1; }
                .badge { 
                    background: #eee; padding: 4px 8px; border-radius: 4px; 
                    font-size: 12px; display: inline-block; margin-bottom: 10px;
                    text-transform: uppercase; letter-spacing: 1px;
                }
                .badge.promoted {
                    background: #f57f17;
                    color: white;
                }
            </style>
            ${currentCard ? `
                <div class="card ${isPromoted ? 'promoted' : ''}">
                    <div>
                        <div class="badge ${isPromoted ? 'promoted' : ''}">
                            ${isPromoted ? 'Promoted' : 'Sale Discovery'}
                        </div>
                        <h2>${currentCard.title}</h2>
                        <p>${currentCard.description}</p>
                    </div>
                    <div class="actions">
                        <button class="btn-discard" id="discard">❌ No</button>
                        <button class="${isPromoted ? 'btn-view' : 'btn-keep'}" id="keep">
                            ${isPromoted ? (currentCard.ctaText || 'View Deal') : '✅ Yes'}
                        </button>
                    </div>
                </div>
            ` : ''}
        `;

        if (this.cards.length) {
            this.shadowRoot.querySelector('#discard').onclick = () => this.swipe('left');
            this.shadowRoot.querySelector('#keep').onclick = () => this.swipe('right');
        }
    }
}
customElements.define('swipe-deck', SwipeDeck);
