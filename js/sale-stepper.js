import { LC_TOKENS, lcToast, lcInlineError } from './lc-ui.js';

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

    reset() {
        this.currentStep = 1;
        this.style.display = 'none';
        this.render();
    }

    render() {
        const doneCls = (n) => this.currentStep > n ? 'done' : '';
        this.shadowRoot.innerHTML = `
            <style>
                ${LC_TOKENS}
                :host {
                    display: none; flex-direction: column;
                    background: var(--surface); border-radius: var(--radius-l);
                    width: 90%; max-width: 420px;
                    position: fixed; top: 50%; left: 50%;
                    transform: translate(-50%, -50%); z-index: 10000;
                    box-shadow: var(--shadow-4);
                    border: 1px solid var(--line);
                    overflow: hidden;
                    animation: lc-pop-in 0.25s var(--ease) both;
                }
                .step { display: none; flex-direction: column; gap: 14px; padding: 6px 22px 24px; }
                .step.active { display: flex; }
                .step h3 {
                    margin: 0; color: var(--ink); font-size: 18px; font-weight: 800; letter-spacing: -0.01em;
                    display: flex; align-items: center; gap: 10px;
                }
                .step-num {
                    width: 26px; height: 26px; border-radius: 8px; background: var(--mint-soft);
                    color: var(--mint-dark); font-size: 13px; font-weight: 800;
                    display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .step p { margin: 0; font-size: 13.5px; color: var(--slate); line-height: 1.5; }
                .upsell {
                    display: flex; align-items: flex-start; gap: 10px; padding: 14px;
                    background: var(--mango-soft); border: 1.5px solid #ffe082; border-radius: var(--radius-m);
                    cursor: pointer; transition: box-shadow var(--t-fast);
                }
                .upsell:hover { box-shadow: var(--shadow-1); }
                .upsell input { width: 18px; height: 18px; margin-top: 2px; accent-color: var(--mango); }
                .upsell .u-title { font-weight: 700; font-size: 14px; color: var(--ink); }
                .upsell .u-sub { font-size: 12.5px; color: var(--slate); margin-top: 2px; line-height: 1.45; }
                .upsell .u-price {
                    margin-left: auto; background: var(--mango); color: #fff; font-weight: 800;
                    font-size: 13px; padding: 4px 10px; border-radius: 999px; flex-shrink: 0;
                }
                .pay-box {
                    padding: 22px; background: var(--surface-alt); border: 1.5px dashed var(--line);
                    text-align: center; border-radius: var(--radius-m); margin-bottom: 4px;
                }
                .pay-box img { opacity: 0.6; }
                .pay-box .secure-note { margin-top: 10px; font-size: 12px; color: var(--slate); display: flex; align-items: center; justify-content: center; gap: 5px; }
                .drop-zone {
                    border: 2px dashed var(--line); border-radius: var(--radius-m); padding: 20px;
                    text-align: center; color: var(--slate); font-size: 13.5px; cursor: pointer;
                    transition: border-color var(--t-fast), background var(--t-fast);
                }
                .drop-zone:hover { border-color: var(--mint); background: var(--mint-soft); }
                .drop-zone input { display: none; }
                #error-slot:empty { display: none; }
            </style>
            <div class="modal-header">
                <span class="modal-title">List a Sale</span>
                <button class="icon-btn" id="close-stepper" title="Close">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="steps">
                <span class="step-dot ${this.currentStep >= 1 ? 'done' : ''}"></span>
                <span class="step-dot ${doneCls(1)}"></span>
                <span class="step-dot ${doneCls(2)}"></span>
                <span class="step-dot ${doneCls(3)}"></span>
                <span class="step-dot ${doneCls(4)}"></span>
            </div>
            <div class="step ${this.currentStep === 1 ? 'active' : ''}">
                <h3><span class="step-num">1</span> Confirm location</h3>
                <p>Enter the 5-digit ZIP where this sale happens.</p>
                <input class="input" type="text" id="sale-zip" placeholder="00000" maxlength="5" inputmode="numeric" style="text-align:center; font-size:24px; letter-spacing:8px; font-weight:700;">
                <div id="error-slot"></div>
                <button class="btn btn-primary btn-block" id="next-1">Confirm ZIP</button>
            </div>
            <div class="step ${this.currentStep === 2 ? 'active' : ''}">
                <h3><span class="step-num">2</span> Sale details</h3>
                <div class="field">
                    <label for="title">Title</label>
                    <input class="input" type="text" placeholder="e.g. Weekend Garage Sale" id="title">
                </div>
                <div class="field">
                    <label for="desc">What's for sale</label>
                    <textarea class="input" placeholder="Tools, records, toys…" rows="4" id="desc"></textarea>
                </div>
                <button class="btn btn-primary btn-block" id="next-2">Continue</button>
            </div>
            <div class="step ${this.currentStep === 3 ? 'active' : ''}">
                <h3><span class="step-num">3</span> Add a photo</h3>
                <p>A photo of your featured items pulls in more shoppers.</p>
                <label class="drop-zone">
                    <input type="file" accept="image/*" id="photo">
                    <div style="margin-bottom:8px;">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#90a4ae" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/>
                            <path d="m21 15-3.5-3.5L9 20"/>
                        </svg>
                    </div>
                    <strong style="color:var(--mint-dark);">Choose a photo</strong><br>or drop it here
                </label>
                <button class="btn btn-primary btn-block" id="next-3">Continue</button>
            </div>
            <div class="step ${this.currentStep === 4 ? 'active' : ''}">
                <h3><span class="step-num">4</span> Schedule &amp; boost</h3>
                <p>Optional: activate your sale 4 hours early and pin it to the top of shopper discovery.</p>
                <label class="upsell">
                    <input type="checkbox" id="upsell">
                    <span>
                        <span class="u-title">Featured Sale</span>
                        <span class="u-sub">Appears at the top of the shopper deck with a highlighted card.</span>
                    </span>
                    <span class="u-price">$5</span>
                </label>
                <button class="btn btn-primary btn-block" id="next-4">Continue to payment</button>
            </div>
            <div class="step ${this.currentStep === 5 ? 'active' : ''}">
                <h3><span class="step-num">5</span> Pay &amp; publish</h3>
                <div class="pay-box">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" width="80" alt="Stripe">
                    <div class="secure-note">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#43a047" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                        Secure payment powered by Stripe
                    </div>
                </div>
                <button class="btn btn-primary btn-block" id="complete">Pay &amp; Publish Sale</button>
            </div>
        `;

        const errorSlot = () => this.shadowRoot.querySelector('#error-slot');
        this.shadowRoot.querySelectorAll('button').forEach(btn => {
            if (btn.id.startsWith('next')) {
                btn.onclick = () => {
                    if (this.currentStep === 1) {
                        const zip = this.shadowRoot.querySelector('#sale-zip').value;
                        if (!/^\d{5}$/.test(zip)) {
                            lcInlineError(errorSlot(), 'Enter a valid 5-digit ZIP code.');
                            this.shadowRoot.querySelector('#sale-zip').classList.add('invalid');
                            return;
                        }
                    }
                    this.nextStep();
                };
            } else if (btn.id === 'complete') {
                btn.onclick = () => {
                    btn.disabled = true;
                    btn.innerHTML = '<span class="spinner"></span> Publishing…';
                    setTimeout(() => {
                        lcToast('Your sale is live on the map!', 'success');
                        this.reset();
                    }, 900);
                };
            } else if (btn.id === 'close-stepper') {
                btn.onclick = () => this.reset();
            }
        });
    }
}
customElements.define('sale-stepper', SaleStepper);
