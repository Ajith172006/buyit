// ==================== STATE ====================
// These variables are shared across all modules

let cart = [];
let orders = [];
let activeCategory = 'all';
let activeSearch = '';
let priceMin = 0, priceMax = 999999, minRating = 0, minDiscount = 0;
let sortMode = 'default';

// ==================== INITIALIZATION ====================
// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  renderHero();
});

// Legacy initialization (kept for compatibility)
renderProducts();
renderHero();

// Export functions to global scope for HTML onclick handlers
// This ensures backward compatibility with inline event handlers
window.getFiltered = getFiltered;
window.renderProducts = renderProducts;
window.renderHero = renderHero;
window.setCategory = setCategory;
window.filterProducts = filterProducts;
window.priceFilter = priceFilter;
window.ratingFilter = ratingFilter;
window.discFilter = discFilter;
window.sortProducts = sortProducts;
window.addToCart = addToCart;
window.updateCartCount = updateCartCount;
window.renderCart = renderCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.closeAll = closeAll;
window.showDetail = showDetail;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.placeOrder = placeOrder;
window.showToast = showToast;
window.showAdmin = showAdmin;
window.closeAdmin = closeAdmin;
window.adminTab = adminTab;
window.updateAdminStats = updateAdminStats;
window.renderRecentOrders = renderRecentOrders;
window.renderTopProducts = renderTopProducts;
window.renderAdminProducts = renderAdminProducts;
window.renderAdminOrders = renderAdminOrders;
window.renderCustomers = renderCustomers;
window.renderAnalytics = renderAnalytics;
window.addProduct = addProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.updateStatus = updateStatus;
window.showPage = showPage;