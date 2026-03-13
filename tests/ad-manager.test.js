// tests/ad-manager.test.js
import { describe, it, expect } from 'vitest';
import { AdManager } from '../js/ad-manager.js';

describe('AdManager.injectAds', () => {
    it('should not inject ads if there are fewer than 3 cards', () => {
        const cards = [{ id: 1 }, { id: 2 }];
        const result = AdManager.injectAds(cards, []);
        expect(result.length).toBe(2);
        expect(result.some(c => c.isAd)).toBe(false);
    });

    it('should inject an ad between index 2 and 4', () => {
        const cards = Array(10).fill({ id: 'sale' });
        const fallbacks = [{ id: 'fallback', type: 'featured' }];
        const result = AdManager.injectAds(cards, fallbacks);
        // Find the first ad injected
        const firstAdIndex = result.findIndex(c => c.isAd || c.type === 'featured');
        expect(firstAdIndex).toBeGreaterThanOrEqual(2);
        expect(firstAdIndex).toBeLessThanOrEqual(4);
    });

    it('should maintain a minimum gap between ads', () => {
        const cards = Array(30).fill({ id: 'sale' });
        const fallbacks = [{ id: 'fallback', type: 'featured' }];
        const result = AdManager.injectAds(cards, fallbacks);
        
        const adIndices = result.reduce((acc, c, idx) => {
            if (c.isAd) acc.push(idx);
            return acc;
        }, []);

        for (let i = 1; i < adIndices.length; i++) {
            const gap = adIndices[i] - adIndices[i-1];
            expect(gap).toBeGreaterThanOrEqual(4);
        }
    });
});
