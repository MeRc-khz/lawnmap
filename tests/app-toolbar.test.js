import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../js/app-toolbar.js';

describe('AppToolbar', () => {
  let toolbar;

  beforeEach(() => {
    document.body.innerHTML = '<app-toolbar></app-toolbar>';
    toolbar = document.querySelector('app-toolbar');
  });

  it('initializes with default mode "shop"', () => {
    expect(toolbar.currentMode).toBe('shop');
    const shopBtn = toolbar.shadowRoot.querySelector('#btn-shop');
    expect(shopBtn.classList.contains('active')).toBe(true);
  });

  it('updates mode and dispatches event when a button is clicked', async () => {
    const lassoBtn = toolbar.shadowRoot.querySelector('#btn-lasso');
    const modeChangeSpy = vi.fn();
    document.addEventListener('mode-change', modeChangeSpy);

    lassoBtn.click();
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(toolbar.currentMode).toBe('lasso');
    const updatedLassoBtn = toolbar.shadowRoot.querySelector('#btn-lasso');
    expect(updatedLassoBtn.classList.contains('active')).toBe(true);
    expect(modeChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { mode: 'lasso' }
      })
    );
  });
});
