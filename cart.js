// ==================== CART FUNCTIONS ====================

// Add product to cart
function addToCart(id){
  const p = products.find(p=>p.id===id);
  const ex = cart.find(c=>c.id===id);
  if(ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateCartCount();
  showToast('Added to cart! 🛒');
}

// Update cart count badge
function updateCartCount(){
  const total = cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById('cart-count').textContent = total;
}

// Render cart items
function renderCart(){
  const items = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  if(cart.length===0){
    items.innerHTML = '<div class="empty-cart"><div class="ec-icon">🛒</div><div style="font-weight:600;font-size:16px;margin-bottom:8px">Your cart is empty!</div><div style="font-size:13px">Add items to get started</div></div>';
    footer.style.display='none';
    return;
  }
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  items.innerHTML = cart.map(c=>`
    <div class="cart-item">
      <div class="ci-img">${c.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${c.name}</div>
        <div class="ci-price">₹${(c.price*c.qty).toLocaleString()}</div>
        <div class="ci-qty">
          <button onclick="changeQty(${c.id},-1)">−</button>
          <span>${c.qty}</span>
          <button onclick="changeQty(${c.id},1)">+</button>
        </div>
        <div class="ci-remove" onclick="removeFromCart(${c.id})">Remove</div>
      </div>
    </div>`).join('');
  document.getElementById('cart-total').textContent = '₹'+total.toLocaleString();
  footer.style.display='block';
}

// Change item quantity
function changeQty(id, delta){
  const item = cart.find(c=>c.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>c.id!==id);
  updateCartCount();
  renderCart();
}

// Remove item from cart
function removeFromCart(id){
  cart = cart.filter(c=>c.id!==id);
  updateCartCount();
  renderCart();
}

// Toggle cart panel
function toggleCart(){
  const panel = document.getElementById('cart-panel');
  const overlay = document.getElementById('overlay');
  renderCart();
  panel.classList.toggle('open');
  overlay.classList.toggle('show');
}

// Close all panels
function closeAll(){
  document.getElementById('cart-panel').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
  document.getElementById('checkout-modal').classList.remove('open');
}