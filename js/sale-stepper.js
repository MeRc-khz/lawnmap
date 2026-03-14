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
                    display: none; flex-direction: column;
                    background: white; border-radius: 12px;
                    padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    width: 90%; max-width: 400px;
                    position: fixed; top: 50%; left: 50%;
                    transform: translate(-50%, -50%); z-index: 10000;
                    font-family: 'Inter', sans-serif;
                    border: 1px solid #eee;
                }
                .step { display: none; }
                .step.active { display: flex; flex-direction: column; gap: 12px; }
                button { 
                    background: #26a69a; 
                    color: white; 
                    border: none; 
                    padding: 14px; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                    transition: all 0.2s;
                }
                button:hover { background: #2bbbad; }
                input, textarea {
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                }
                h3 { margin-bottom: 15px; color: #455a64; font-size: 18px; }
                p { font-size: 14px; color: #666; line-height: 1.5; }
                .close-btn { 
                    position: absolute; top: 10px; right: 10px; 
                    background: none; border: none; font-size: 20px; 
                    color: #999; cursor: pointer; padding: 5px;
                }
            </style>
            <button class="close-btn" id="close-stepper">✕</button>
            <div class="step ${this.currentStep === 1 ? 'active' : ''}">
                <h3>Step 1: Confirm Location</h3>
                <p>Please enter the 5-digit ZIP code for this sale location.</p>
                <input type="text" id="sale-zip" placeholder="00000" maxlength="5" style="text-align: center; font-size: 24px; letter-spacing: 5px;">
                <button id="next-1">Confirm ZIP</button>
            </div>
            <div class="step ${this.currentStep === 2 ? 'active' : ''}">
                <h3>Step 2: Sale Details</h3>
                <input type="text" placeholder="Sale Title (e.g. Garage Sale)" id="title">
                <textarea placeholder="Description of items (e.g. Tools, records, toys)" rows="4"></textarea>
                <button id="next-2">Next</button>
            </div>
            <div class="step ${this.currentStep === 3 ? 'active' : ''}">
                <h3>Step 3: Upload Photo</h3>
                <p>Add a photo of your featured items to attract more shoppers!</p>
                <input type="file" accept="image/*" style="padding: 10px 0;">
                <button id="next-3">Next</button>
            </div>
            <div class="step ${this.currentStep === 4 ? 'active' : ''}">
                <h3>Step 4: Schedule & Featured</h3>
                <p>Activate 4 hours early for $5? Featured sales appear at the top of shopper discovery decks.</p>
                <label style="display: flex; align-items: center; gap: 10px; font-size: 14px;">
                    <input type="checkbox" id="upsell"> Yes, make it a Featured Sale ($5)
                </label>
                <button id="next-4">Proceed to Payment</button>
            </div>
            <div class="step ${this.currentStep === 5 ? 'active' : ''}">
                <h3>Step 5: Pay & Activate</h3>
                <div id="stripe-placeholder" style="padding: 30px; background: #f8f9fa; border: 2px dashed #dee2e6; text-align: center; border-radius: 12px; margin-bottom: 15px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" width="80" style="opacity: 0.5;">
                    <p style="margin-top: 10px; font-size: 12px;">Secure Payment Powered by Stripe</p>
                </div>
                <button id="complete">Pay & Publish Sale</button>
            </div>
        `;
        
        this.shadowRoot.querySelectorAll('button').forEach(btn => {
            if (btn.id.startsWith('next')) {
                btn.onclick = () => {
                    if (this.currentStep === 1) {
                        const zip = this.shadowRoot.querySelector('#sale-zip').value;
                        if (!/^\d{5}$/.test(zip)) {
                            alert('Please enter a valid 5-digit ZIP code.');
                            return;
                        }
                    }
                    this.nextStep();
                };
            } else if (btn.id === 'complete') {
                btn.onclick = () => {
                    alert('Success! Your sale is now live on the map.');
                    this.style.display = 'none';
                    this.currentStep = 1;
                    this.render();
                };
            } else if (btn.id === 'close-stepper') {
                btn.onclick = () => {
                    this.style.display = 'none';
                    this.currentStep = 1;
                    this.render();
                };
            }
        });
    }
}
customElements.define('sale-stepper', SaleStepper);
