(function() {
  'use strict';
  
  function isListPage() {
    return /\/(list|wishlist|registry)/.test(window.location.pathname);
  }

  function extractPrice(text) {
    if (!text) return 0;
    const match = text.match(/\$?([\d,]+\.?\d*)/);
    return match ? parseFloat(match[1].replace(',', '')) : 0;
  }

  function calculateTotal() {
    const items = document.querySelectorAll('[data-itemid], [data-itemId], li[data-id]');
    let total = 0;
    let count = 0;

    items.forEach(item => {
      const priceEl = item.querySelector('.a-price .a-offscreen') ||
                      item.querySelector('[data-price]') ||
                      item.querySelector('.a-price span:not(.a-offscreen)');
      
      if (priceEl) {
        const price = extractPrice(priceEl.textContent || priceEl.getAttribute('data-price'));
        if (price > 0) {
          total += price;
          count++;
        }
      }
    });

    return { total, count };
  }

  function createDisplay() {
    if (!isListPage()) return;

    let display = document.getElementById('list-total-display');
    
    const { total, count } = calculateTotal();
    
    if (count === 0) {
      if (display) display.remove();
      return;
    }

    if (!display) {
      display = document.createElement('div');
      display.id = 'list-total-display';
      document.body.appendChild(display);
    }
    
    display.textContent = `List Total: $${total.toFixed(2)} (${count} items)`;
  }

  let timeout;
  function scheduleUpdate() {
    clearTimeout(timeout);
    timeout = setTimeout(createDisplay, 500);
  }

  const observer = new MutationObserver(scheduleUpdate);
  
  function init() {
    if (!isListPage()) return;
    
    createDisplay();
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1000);
  } else {
    window.addEventListener('load', () => setTimeout(init, 1000));
  }
})();