// ==================== MAIN APPLICATION ====================
// This is the entry point that initializes the application

// ==================== STATE ====================
let cart = [];
let orders = [];
let activeCategory = 'all';
let activeSearch = '';
let priceMin = 0, priceMax = 999999, minRating = 0, minDiscount = 0;
let sortMode = 'default';

// ==================== INITIALIZATION ====================
function initApp(){
  renderProducts();
  renderHero();
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initApp);

// Export for global access
window.initApp = initApp;