// ==================== FILTER FUNCTIONS ====================

// Get filtered and sorted products
function getFiltered(){
  let arr = products.filter(p=>{
    if(activeCategory !== 'all' && p.category !== activeCategory) return false;
    if(activeSearch && !p.name.toLowerCase().includes(activeSearch.toLowerCase()) && !p.brand.toLowerCase().includes(activeSearch.toLowerCase())) return false;
    if(p.price < priceMin || p.price > priceMax) return false;
    if(p.rating < minRating) return false;
    if(p.discount < minDiscount) return false;
    return true;
  });
  if(sortMode==='price_asc') arr.sort((a,b)=>a.price-b.price);
  else if(sortMode==='price_desc') arr.sort((a,b)=>b.price-a.price);
  else if(sortMode==='rating') arr.sort((a,b)=>b.rating-a.rating);
  else if(sortMode==='discount') arr.sort((a,b)=>b.discount-a.discount);
  return arr;
}

// Set category
function setCategory(cat, el){
  activeCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('section-label').textContent = cat==='all'?'All Products':cat;
  renderProducts();
}

// Search products
function filterProducts(){
  activeSearch = document.getElementById('search-input').value;
  renderProducts();
}

// Price filter
function priceFilter(min,max){ priceMin=min; priceMax=max; renderProducts(); }

// Rating filter
function ratingFilter(r){ minRating=r; renderProducts(); }

// Discount filter
function discFilter(d){ minDiscount=d; renderProducts(); }

// Sort products
function sortProducts(v){ sortMode=v; renderProducts(); }