// ==================== UTILITY FUNCTIONS ====================

// Show toast notification
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// Format price with currency
function formatPrice(price){
  return '₹' + price.toLocaleString();
}

// Format date
function formatDate(date){
  return new Date(date).toLocaleDateString('en-IN');
}

// Debounce function for search
function debounce(func, wait){
  let timeout;
  return function executedFunction(...args){
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get URL parameters
function getUrlParams(){
  const params = new URLSearchParams(window.location.search);
  return params;
}

// Show page (placeholder for future SPA routing)
function showPage(page){
  console.log('Navigating to:', page);
}