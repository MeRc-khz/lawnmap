import { LC_TOKENS } from './lc-ui.js';

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
                ${LC_TOKENS}
                :host {
                    display: ${this.cards.length ? 'flex' : 'none'};
                    position: absolute; top: 50%; left: 50%; 
                    transform: translate(-50%, -50%);
                    width: 90%; max-width: 320px; 
                    height: 450px; z-index: 200;
                    font-family: sans-serif;
                }
                .card {
                    background: var(--surface); border-radius: var(--radius-l);
                    padding: 24px; box-shadow: var(--shadow-4);
                    width: 100%; display: flex; flex-direction: column;
                    justify-content: space-between;
                    border: 1px solid var(--line);
                    transition: all 0.3s var(--ease);
                    animation: lc-pop-in 0.25s var(--ease) both;
                }
                .card.promoted {
                    border: 2px solid var(--mango);
                    background: var(--mango-soft);
                }
                .actions { display: flex; justify-content: space-around; margin-top: 24px; gap: 15px; }
                button {
                    flex: 1; border: none; padding: 14px; border-radius: var(--radius-s);
                    cursor: pointer; font-weight: 700; font-size: 15px; font-family: inherit;
                    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
                    transition: transform var(--t-fast), box-shadow var(--t-fast), background var(--t-fast);
                }
                button:active { transform: scale(0.96); }
                .btn-discard { background: var(--danger-soft); color: var(--danger); }
                .btn-discard:hover { background: #ffcdd2; box-shadow: var(--shadow-1); }
                .btn-keep { background: var(--success-soft); color: var(--success); }
                .btn-keep:hover { background: #c8e6c9; box-shadow: var(--shadow-1); }
                .btn-view { background: var(--mango); color: #fff; box-shadow: 0 3px 10px rgba(255,179,0,0.35); }
                .btn-view:hover { background: #ffa000; }
                h2 { color: var(--ink); margin: 0 0 10px 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
                p { color: var(--slate); font-size: 15px; line-height: 1.55; flex-grow: 1; }
                .badge {
                    background: var(--mint-soft); color: var(--mint-dark);
                    padding: 4px 10px; border-radius: 999px;
                    font-size: 11px; font-weight: 800; display: inline-block; margin-bottom: 10px;
                    text-transform: uppercase; letter-spacing: 0.08em;
                }
                .badge.promoted {
                    background: var(--mango);
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
                        <button class="btn-discard" id="discard"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg> Pass</button>
                        <button class="${isPromoted ? 'btn-view' : 'btn-keep'}" id="keep">
                            ${isPromoted ? (currentCard.ctaText || 'View Deal') : '<svg width=\'15\' height=\'15\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><path d=\'M20 6 9 17l-5-5\'/></svg> Save'}
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
