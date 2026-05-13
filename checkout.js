// ==================== CHECKOUT FUNCTIONS ====================

// Open checkout modal
function openCheckout(){
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  document.getElementById('co-total').textContent = total.toLocaleString();
  document.getElementById('checkout-modal').classList.add('open');
  document.getElementById('overlay').classList.add('show');
}

// Close checkout modal
function closeCheckout(){
  document.getElementById('checkout-modal').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// Place order
function placeOrder(){
  const name = document.getElementById('co-name').value;
  if(!name.trim()){ showToast('Please fill in your name'); return; }
  const total = cart.reduce((s,c)=>s+c.price*c.qty,0);
  const order = {
    id:'SN'+Date.now(),
    customer: name||'Guest',
    phone: document.getElementById('co-phone').value,
    items: cart.length,
    total,
    payment: document.getElementById('co-payment').value,
    date: new Date().toLocaleDateString('en-IN'),
    status:'pending'
  };
  orders.push(order);
  cart = [];
  updateCartCount();
  closeCheckout();
  closeAll();
  showToast('🎉 Order placed! Order ID: '+order.id);
  updateAdminStats();
}