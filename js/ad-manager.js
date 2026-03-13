// js/ad-manager.js
export class AdManager {
    static injectAds(cards, fallbackPool) {
        if (cards.length < 3) return cards;
        
        const result = [...cards];
        let nextAdGap = Math.floor(Math.random() * 3) + 2; // Initial gap 2-4
        let lastAdIndex = -1;

        // Start from nextAdGap and work through the array
        for (let i = nextAdGap; i < result.length; i++) {
            // Check if we can inject an ad here
            const canInject = (lastAdIndex === -1 || i - lastAdIndex >= 4);
            
            if (canInject && fallbackPool.length > 0) {
                const ad = { 
                    ...fallbackPool[Math.floor(Math.random() * fallbackPool.length)], 
                    type: 'featured', 
                    isAd: true 
                };
                
                result.splice(i, 0, ad);
                lastAdIndex = i;
                
                // Skip the ad we just inserted
                i++;
                
                // Determine next gap (4-7)
                nextAdGap = Math.floor(Math.random() * 4) + 4;
                i += nextAdGap;
            }
        }
        return result;
    }
}
