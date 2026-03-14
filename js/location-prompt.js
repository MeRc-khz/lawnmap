class LocationPrompt extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.zip = localStorage.getItem('lawnczar_zip') || '';
        this.render();
    }

    connectedCallback() {
        console.log('LocationPrompt connected');
        if (this.zip && !this.showForced) {
            this.style.display = 'none';
        } else {
            this.style.display = 'flex';
        }
    }

    async handleZipSubmit(zip) {
        if (!/^\d{5}$/.test(zip)) {
            alert('Please enter a valid 5-digit ZIP code.');
            return;
        }

        try {
            const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
            if (!response.ok) throw new Error('ZIP code not found');
            
            const data = await response.json();
            const place = data.places[0];
            const lat = parseFloat(place.latitude);
            const lng = parseFloat(place.longitude);

            localStorage.setItem('lawnczar_zip', zip);
            localStorage.setItem('lawnczar_lat', lat);
            localStorage.setItem('lawnczar_lng', lng);

            this.dispatchEvent(new CustomEvent('location-set', {
                detail: { zip, lat, lng },
                bubbles: true,
                composed: true
            }));

            this.style.display = 'none';
        } catch (error) {
            alert('Could not find that ZIP code. Please try again.');
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.8);
                    align-items: center;
                    justify-content: center;
                    z-index: 20000;
                    font-family: sans-serif;
                }
                :host([style*="display: none"]) {
                    display: none !important;
                }
                :host([style*="display: flex"]) {
                    display: flex !important;
                }
                .modal {
                    background: white;
                    padding: 30px;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                }
                h2 { color: #26a69a; margin-top: 0; }
                p { color: #666; margin-bottom: 20px; }
                input {
                    width: 100%;
                    padding: 15px;
                    font-size: 24px;
                    text-align: center;
                    border: 2px solid #eee;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    letter-spacing: 5px;
                }
                input:focus {
                    outline: none;
                    border-color: #26a69a;
                }
                button {
                    width: 100%;
                    padding: 15px;
                    background: #26a69a;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                }
            </style>
            <div class="modal">
                <h2>Welcome to Lawnczar</h2>
                <p>Enter your ZIP code to find sales in your area.</p>
                <input type="text" id="zip-input" placeholder="00000" maxlength="5" value="${this.zip}">
                <button id="start-btn">Find Sales</button>
            </div>
        `;

        const input = this.shadowRoot.querySelector('#zip-input');
        const btn = this.shadowRoot.querySelector('#start-btn');

        btn.onclick = () => this.handleZipSubmit(input.value);
        input.onkeyup = (e) => {
            if (e.key === 'Enter') this.handleZipSubmit(input.value);
        };
    }
}
customElements.define('location-prompt', LocationPrompt);
