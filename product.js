// ==================== PRODUCT FUNCTIONS ====================

// Render products grid
function renderProducts(){
  const arr = getFiltered();
  document.getElementById('product-count').textContent = arr.length + ' products';
  const grid = document.getElementById('product-grid');
  grid.innerHTML = arr.length===0 ? '<div style="padding:40px;text-align:center;color:#777;font-size:14px">😕 No products found. Try different filters.</div>' :
    arr.map(p=>`
    <div class="product-card" onclick="showDetail(${p.id})">
      ${p.discount>=30?`<div class="badge">${p.discount}% OFF</div>`:''}
      <div class="p-img">${p.emoji}</div>
      <div class="p-brand">${p.brand}</div>
      <div class="p-name">${p.name}</div>
      <div class="p-rating">
        <span class="stars">${p.rating} ★</span>
        <span class="count">(${p.reviews.toLocaleString()})</span>
      </div>
      <div style="display:flex;align-items:baseline;flex-wrap:wrap">
        <span class="p-price">₹${p.price.toLocaleString()}</span>
        <span class="p-mrp">₹${p.mrp.toLocaleString()}</span>
        <span class="p-disc">${p.discount}% off</span>
      </div>
      <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
    </div>`).join('');
}

// Render hero deals
function renderHero(){
  const top = [...products].sort((a,b)=>b.discount-a.discount).slice(0,4);
  document.getElementById('hero-deals').innerHTML = top.map(p=>`
    <div class="deal-card" onclick="showDetail(${p.id})">
      <div class="d-img">${p.emoji}</div>
      <div class="d-price">₹${p.price.toLocaleString()}</div>
      <div class="d-name">${p.brand}</div>
    </div>`).join('');
}

// Show product detail
function showDetail(id){
  const p = products.find(x=>x.id===id);
  const view = document.getElementById('detail-view');
  document.getElementById('detail-body').innerHTML = `
    <div class="detail-img-col">
      <div class="big-img">${p.emoji}</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
        ${[...Array(4)].map(()=>`<div style="width:52px;height:52px;border:1px solid #ddd;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer">${p.emoji}</div>`).join('')}
      </div>
    </div>
    <div class="detail-info-col">
      <div class="detail-brand">${p.brand} <span style="color:#2874f0;font-size:12px">★ Verified Seller</span></div>
      <h1>${p.name}</h1>
      <div class="detail-rating-bar">
        <span class="stars" style="background:#388e3c;color:#fff;padding:4px 10px;border-radius:4px;font-weight:700">${p.rating} ★</span>
        <span style="font-size:13px;color:#777">${p.reviews.toLocaleString()} Ratings & Reviews</span>
      </div>
      <div class="detail-price-section">
        <span class="detail-price">₹${p.price.toLocaleString()}</span>
        <span class="detail-mrp">₹${p.mrp.toLocaleString()}</span>
        <span class="detail-disc">${p.discount}% off</span>
      </div>
      <div style="background:#f1f8e9;padding:12px;border-radius:4px;margin-bottom:16px;font-size:13px">
        <b style="color:#388e3c">Available Offers</b><br>
        <div style="margin-top:6px;color:#555">🏷 10% instant discount on HDFC Credit Card</div>
        <div style="margin-top:4px;color:#555">🏷 Get ₹200 off on orders above ₹1999. Use: SAVE200</div>
        <div style="margin-top:4px;color:#555">🏷 No Cost EMI on select Credit Cards</div>
      </div>
      <div class="detail-features">
        <h3>Highlights</h3>
        <ul><li>${p.desc}</li><li>Stock: ${p.stock} units available</li><li>Category: ${p.category}</li></ul>
      </div>
      <div class="detail-btns">
        <button class="detail-btns btn-cart" onclick="addToCart(${p.id});document.getElementById('detail-view').classList.add('hidden')" style="background:#ff9f00;color:#fff">ADD TO CART</button>
        <button class="detail-btns btn-buy" onclick="addToCart(${p.id});document.getElementById('detail-view').classList.add('hidden');openCheckout()">BUY NOW</button>
      </div>
      <div style="margin-top:16px;font-size:12px;color:#777;display:flex;gap:16px">
        <span>🚚 Free Delivery</span>
        <span>↩ 7 Day Return</span>
        <span>✓ Top Brand</span>
        <span>🛡 1 Year Warranty</span>
      </div>
    </div>`;
  view.classList.remove('hidden');
}