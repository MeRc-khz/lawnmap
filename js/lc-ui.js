/**
 * LawnCzar UI Kit — shared design system for all web components.
 * Professional ecommerce portal look: elevation, motion, toasts, inline errors.
 *
 * Usage in a component's shadow root:
 *   import { LC_TOKENS, lcToast } from './lc-ui.js';
 *   this.shadowRoot.innerHTML = `<style>${LC_TOKENS} ...</style>`;
 */

export const LC_TOKENS = `
    :host {
        /* Color system — mint/mango/slate from DESIGN_AND_STYLE_GUIDE.md */
        --mint: #26a69a;
        --mint-dark: #00897b;
        --mint-soft: #e0f2f1;
        --mango: #ffb300;
        --mango-soft: #fff8e1;
        --slate: #455a64;
        --ink: #263238;
        --surface: #ffffff;
        --surface-alt: #f8fafb;
        --line: #eceff1;
        --danger: #e53935;
        --danger-soft: #ffebee;
        --success: #43a047;
        --success-soft: #e8f5e9;

        /* Elevation ladder */
        --shadow-1: 0 2px 4px rgba(38, 50, 56, 0.06);
        --shadow-2: 0 4px 12px rgba(38, 50, 56, 0.10);
        --shadow-3: 0 10px 30px rgba(38, 50, 56, 0.14);
        --shadow-4: 0 16px 48px rgba(38, 50, 56, 0.20);

        /* Shape + motion */
        --radius-s: 8px;
        --radius-m: 12px;
        --radius-l: 16px;
        --ease: cubic-bezier(0.4, 0, 0.2, 1);
        --t-fast: 0.15s var(--ease);
        --t-med: 0.25s var(--ease);

        font-family: 'Inter', -apple-system, 'Segoe UI', sans-serif;
        color: var(--ink);
    }

    /* ---- Buttons ---- */
    .btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        border: none; cursor: pointer; font-weight: 600; font-family: inherit;
        border-radius: var(--radius-s);
        transition: transform var(--t-fast), box-shadow var(--t-fast),
                    background var(--t-fast), opacity var(--t-fast);
    }
    .btn:active { transform: scale(0.97); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-primary {
        background: var(--mint); color: #fff; padding: 13px 20px; font-size: 15px;
        box-shadow: var(--shadow-1);
    }
    .btn-primary:hover:not(:disabled) { background: var(--mint-dark); box-shadow: var(--shadow-2); }
    .btn-ghost {
        background: var(--surface-alt); color: var(--slate); padding: 12px 18px;
        font-size: 14px; border: 1px solid var(--line);
    }
    .btn-ghost:hover:not(:disabled) { background: var(--mint-soft); color: var(--mint-dark); border-color: var(--mint-soft); }
    .btn-block { width: 100%; }

    /* ---- Inputs ---- */
    .field { display: flex; flex-direction: column; gap: 6px; text-align: left; }
    .field label { font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--slate); }
    .input {
        padding: 13px 14px; border: 1.5px solid var(--line); border-radius: var(--radius-s);
        font-size: 15px; font-family: inherit; color: var(--ink); background: var(--surface);
        transition: border-color var(--t-fast), box-shadow var(--t-fast); width: 100%;
        box-sizing: border-box;
    }
    .input:focus { outline: none; border-color: var(--mint); box-shadow: 0 0 0 3px rgba(38, 166, 154, 0.15); }
    .input.invalid { border-color: var(--danger); box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.12); }

    /* ---- Card / modal surfaces ---- */
    .surface {
        background: var(--surface); border-radius: var(--radius-l);
        box-shadow: var(--shadow-4); border: 1px solid var(--line);
    }
    .modal-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 18px 22px 14px; border-bottom: 1px solid var(--line);
    }
    .modal-title { font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.01em; }
    .icon-btn {
        background: var(--surface-alt); border: none; cursor: pointer; color: var(--slate);
        width: 32px; height: 32px; border-radius: 50%; display: inline-flex;
        align-items: center; justify-content: center;
        transition: background var(--t-fast), color var(--t-fast), transform var(--t-fast);
    }
    .icon-btn:hover { background: var(--danger-soft); color: var(--danger); }
    .icon-btn:active { transform: scale(0.9); }

    /* ---- Step progress dots ---- */
    .steps { display: flex; gap: 6px; align-items: center; justify-content: center; padding: 0 22px 14px; }
    .step-dot { height: 4px; flex: 1; border-radius: 2px; background: var(--line); transition: background var(--t-med); }
    .step-dot.done { background: var(--mint); }

    /* ---- Badges ---- */
    .badge {
        display: inline-flex; align-items: center; gap: 5px;
        font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
        padding: 4px 10px; border-radius: 999px;
    }
    .badge-mint { background: var(--mint-soft); color: var(--mint-dark); }
    .badge-mango { background: var(--mango-soft); color: #e65100; }
    .badge-danger { background: var(--danger-soft); color: var(--danger); }

    /* ---- Keyframes ---- */
    @keyframes lc-pop-in { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: none; } }
    @keyframes lc-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes lc-slide-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes lc-spin { to { transform: rotate(360deg); } }
    @keyframes lc-toast-in { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
    .anim-pop { animation: lc-pop-in 0.22s var(--ease) both; }
    .anim-fade { animation: lc-fade-in 0.2s var(--ease) both; }
    .anim-slide { animation: lc-slide-up 0.25s var(--ease) both; }
    .spinner {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2.5px solid rgba(255,255,255,0.35); border-top-color: #fff;
        animation: lc-spin 0.7s linear infinite; display: inline-block;
    }
`;

/**
 * Global toast — renders once into document.body (outside shadow roots).
 * lcToast('Saved!', 'success') | lcToast('Bad ZIP', 'error') | lcToast('Working…', 'info', true)
 */
export function lcToast(message, kind = 'info', loading = false) {
    let host = document.getElementById('lc-toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'lc-toast-host';
        host.style.cssText = 'position:fixed;bottom:84px;left:50%;transform:translateX(-50%);z-index:30000;display:flex;flex-direction:column;gap:8px;align-items:center;pointer-events:none;';
        document.body.appendChild(host);
    }
    const colors = {
        success: ['#e8f5e9', '#2e7d32'],
        error:   ['#ffebee', '#c62828'],
        info:    ['#e0f2f1', '#00695c'],
    };
    const [bg, fg] = colors[kind] || colors.info;
    const t = document.createElement('div');
    t.style.cssText = [
        'pointer-events:auto', 'max-width:320px', 'padding:12px 18px',
        `background:${bg}`, `color:${fg}`, 'border-radius:12px',
        'font:600 14px Inter, sans-serif', 'box-shadow:0 8px 24px rgba(38,50,56,0.18)',
        'display:flex', 'align-items:center', 'gap:9px',
        'animation:lc-toast-in 0.25s cubic-bezier(0.4,0,0.2,1) both',
        'border:1px solid rgba(38,50,56,0.08)',
    ].join(';');
    if (loading) {
        const sp = document.createElement('span');
        sp.style.cssText = 'width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(0,0,0,0.15);border-top-color:currentColor;animation:lc-spin 0.7s linear infinite;display:inline-block;';
        t.appendChild(sp);
    }
    t.appendChild(document.createTextNode(message));
    host.appendChild(t);
    return {
        dismiss(delayMs = 0) {
            setTimeout(() => {
                t.style.transition = 'opacity 0.25s, transform 0.25s';
                t.style.opacity = '0';
                t.style.transform = 'translateY(8px)';
                setTimeout(() => t.remove(), 260);
            }, delayMs);
        },
    };
}

/** Inline error banner for modal bodies (replace alert() inside modals). */
export function lcInlineError(container, message) {
    if (!container) return;
    container.innerHTML = `
        <div class="anim-pop" style="display:flex;gap:8px;align-items:flex-start;background:#ffebee;color:#c62828;
             border:1px solid #ffcdd2;border-radius:10px;padding:10px 14px;font-size:13.5px;line-height:1.4;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;margin-top:1px;">
                <circle cx="12" cy="12" r="10" stroke="#c62828" stroke-width="2"/>
                <path d="M12 7v6" stroke="#c62828" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="16.5" r="1.2" fill="#c62828"/>
            </svg>
            <span>${message}</span>
        </div>`;
}

/** Empty-state block for decks/lists. */
export function lcEmptyState(iconSvg, title, subtitle) {
    return `
        <div style="text-align:center;padding:36px 20px;color:#90a4ae;" class="anim-fade">
            <div style="opacity:0.9;margin-bottom:10px;">${iconSvg}</div>
            <div style="font-weight:700;font-size:15px;color:#546e7a;margin-bottom:4px;">${title}</div>
            <div style="font-size:13px;">${subtitle}</div>
        </div>`;
}
