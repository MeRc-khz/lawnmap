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
                    display: flex; flex-direction: column;
                    background: white; border-radius: 12px;
                    padding: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 90%; max-width: 400px;
                    position: absolute; bottom: 20px; left: 50%;
                    transform: translateX(-50%); z-index: 100;
                    font-family: sans-serif;
                }
                .step { display: none; }
                .step.active { display: flex; flex-direction: column; gap: 10px; }
                button { 
                    background: #26a69a; 
                    color: white; 
                    border: none; 
                    padding: 12px; 
                    border-radius: 6px; 
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                }
                input, textarea {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }
                h3 { margin-bottom: 10px; color: #455a64; }
                p { font-size: 14px; color: #666; }
            </style>
            <div class="step ${this.currentStep === 1 ? 'active' : ''}">
                <h3>Step 1: Sale Details</h3>
                <input type="text" placeholder="Title" id="title">
                <textarea placeholder="Description"></textarea>
                <button id="next-1">Next</button>
            </div>
            <div class="step ${this.currentStep === 2 ? 'active' : ''}">
                <h3>Step 2: Upload Photo</h3>
                <input type="file" accept="image/*">
                <button id="next-2">Next</button>
            </div>
            <div class="step ${this.currentStep === 3 ? 'active' : ''}">
                <h3>Step 3: Schedule & Upsell</h3>
                <p>Activate 4 hours early for $5?</p>
                <button id="next-3">Schedule & Pay</button>
            </div>
            <div class="step ${this.currentStep === 4 ? 'active' : ''}">
                <h3>Step 4: Pay & Activate</h3>
                <div id="stripe-placeholder" style="padding: 20px; background: #f9f9f9; border: 1px dashed #ccc; text-align: center;">
                    Stripe Card Element Here
                </div>
                <button id="complete">Complete Purchase</button>
            </div>
        `;
        
        this.shadowRoot.querySelectorAll('button').forEach(btn => {
            if (btn.id.startsWith('next')) {
                btn.onclick = () => this.nextStep();
            } else if (btn.id === 'complete') {
                btn.onclick = () => alert('Sale Activated!');
            }
        });
    }
}
customElements.define('sale-stepper', SaleStepper);
