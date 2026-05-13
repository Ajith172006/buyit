// ==================== ADMIN FUNCTIONS ====================

// Show admin panel
function showAdmin(){
  document.getElementById('admin-panel').classList.remove('hidden');
  updateAdminStats();
  renderAdminProducts();
  renderAdminOrders();
  renderCustomers();
  renderAnalytics();
}

// Close admin panel
function closeAdmin(){
  document.getElementById('admin-panel').classList.add('hidden');
}

// Switch admin tabs
function adminTab(tab, el){
  document.querySelectorAll('.admin-menu-item').forEach(e=>e.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(e=>e.classList.remove('active'));
  document.getElementById('sec-'+tab).classList.add('active');
}

// Update admin stats
function updateAdminStats(){
  document.getElementById('total-orders-stat').textContent = orders.length;
  document.getElementById('total-products-stat').textContent = products.length;
  document.getElementById('prod-count-admin').textContent = products.length;
  document.getElementById('order-count-admin').textContent = orders.length;
  renderRecentOrders();
  renderTopProducts();
}

// Render recent orders
function renderRecentOrders(){
  const sampleOrdersList = [
    {id:'SN1001',customer:'Ravi Kumar',items:2,total:15990,date:'26/04/2026',status:'delivered'},
    {id:'SN1002',customer:'Priya Singh',items:1,total:134900,date:'26/04/2026',status:'shipped'},
    {id:'SN1003',customer:'Amit Patel',items:3,total:8247,date:'25/04/2026',status:'pending'},
    {id:'SN1004',customer:'Sneha Reddy',items:1,total:24990,date:'25/04/2026',status:'delivered'},
    {id:'SN1005',customer:'Mohan Das',items:2,total:3294,date:'24/04/2026',status:'cancelled'},
    ...orders.slice(-3).map(o=>({...o}))
  ];
  document.getElementById('recent-orders-table').innerHTML = `
    <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
    <tbody>${sampleOrdersList.slice(-8).map(o=>`
      <tr><td style="font-family:monospace;color:#7c3aed">${o.id}</td><td>${o.customer}</td><td>${o.items}</td>
      <td>₹${o.total.toLocaleString()}</td><td>${o.date}</td>
      <td><span class="status-badge ${o.status}">${o.status}</span></td></tr>`).join('')}
    </tbody>`;
}

// Render top products
function renderTopProducts(){
  const top = [...products].sort((a,b)=>b.reviews-a.reviews).slice(0,5);
  document.getElementById('top-products-table').innerHTML = `
    <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Reviews</th><th>Stock</th></tr></thead>
    <tbody>${top.map(p=>`
      <tr><td>${p.emoji} ${p.name.substring(0,30)}...</td><td>${p.category}</td>
      <td>₹${p.price.toLocaleString()}</td><td>${p.rating} ★</td>
      <td>${p.reviews.toLocaleString()}</td><td>${p.stock}</td></tr>`).join('')}
    </tbody>`;
}

// Render admin products table
function renderAdminProducts(){
  document.getElementById('prod-count-admin').textContent = products.length;
  document.getElementById('all-products-table').innerHTML = `
    <thead><tr><th>ID</th><th>Product</th><th>Category</th><th>Price</th><th>MRP</th><th>Disc%</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
    <tbody>${products.map(p=>`
      <tr><td>${p.id}</td><td>${p.emoji} ${p.name.substring(0,25)}...</td><td>${p.category}</td>
      <td>₹${p.price.toLocaleString()}</td><td>₹${p.mrp.toLocaleString()}</td>
      <td><span style="color:#26a541;font-weight:600">${p.discount}%</span></td>
      <td>${p.stock}</td><td>${p.rating} ★</td>
      <td><button class="action-btn edit" onclick="editProduct(${p.id})">Edit</button> 
      <button class="action-btn del" onclick="deleteProduct(${p.id})">Delete</button></td></tr>`).join('')}
    </tbody>`;
}

// Render admin orders table
function renderAdminOrders(){
  const allOrders = [...sampleOrders, ...orders];
  document.getElementById('order-count-admin').textContent = allOrders.length;
  document.getElementById('all-orders-table').innerHTML = `
    <thead><tr><th>Order ID</th><th>Customer</th><th>Phone</th><th>Items</th><th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
    <tbody>${allOrders.map(o=>`
      <tr><td style="font-family:monospace;color:#2874f0">${o.id}</td><td>${o.customer}</td>
      <td>${o.phone||'—'}</td><td>${o.items}</td>
      <td>₹${o.total.toLocaleString()}</td><td>${o.payment||'Online'}</td><td>${o.date}</td>
      <td><span class="status-badge ${o.status}">${o.status}</span></td>
      <td><select onchange="updateStatus('${o.id}',this.value)" style="font-size:11px;padding:3px 6px;border:1px solid #ddd;border-radius:3px">
        <option ${o.status==='pending'?'selected':''}>pending</option>
        <option ${o.status==='shipped'?'selected':''}>shipped</option>
        <option ${o.status==='delivered'?'selected':''}>delivered</option>
        <option ${o.status==='cancelled'?'selected':''}>cancelled</option>
      </select></td></tr>`).join('')}
    </tbody>`;
}

// Render customers table
function renderCustomers(){
  document.getElementById('customers-table').innerHTML = `
    <thead><tr><th>Name</th><th>Email</th><th>City</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
    <tbody>${customers.map(c=>`
      <tr><td>${c.name}</td><td style="color:#2874f0">${c.email}</td><td>${c.city}</td>
      <td>${c.orders}</td><td style="font-weight:600">${c.spent}</td><td>${c.joined}</td></tr>`).join('')}
    </tbody>`;
}

// Render analytics charts
function renderAnalytics(){
  document.getElementById('analytics-chart').innerHTML = analyticsData.categories.map((c,i)=>`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
      <span style="width:90px;font-size:12px;color:#555;text-align:right">${c}</span>
      <div style="flex:1;background:#f0f0f0;border-radius:4px;height:22px;position:relative">
        <div style="width:${analyticsData.categoryValues[i]}%;background:${analyticsData.categoryColors[i]};height:100%;border-radius:4px;display:flex;align-items:center;padding:0 8px">
          <span style="color:#fff;font-size:11px;font-weight:600">${analyticsData.categoryValues[i]}%</span>
        </div>
      </div>
    </div>`).join('');
  
  const maxRev = Math.max(...analyticsData.revenue);
  document.getElementById('revenue-chart').innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:16px;height:150px;padding:0 16px;border-bottom:1px solid #eee">
      ${analyticsData.months.map((m,i)=>`
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          <span style="font-size:11px;color:#555;font-weight:600">₹${analyticsData.revenue[i]}L</span>
          <div style="width:100%;background:linear-gradient(135deg,#7c3aed,#06b6d4);border-radius:3px 3px 0 0;height:${(analyticsData.revenue[i]/maxRev*100)}px"></div>
          <span style="font-size:11px;color:#777">${m}</span>
        </div>`).join('')}
    </div>`;
}

// Add new product
function addProduct(){
  const name = document.getElementById('fp-name').value.trim();
  if(!name){ showToast('Please enter a product name'); return; }
  const price = parseInt(document.getElementById('fp-price').value)||999;
  const mrp = parseInt(document.getElementById('fp-mrp').value)||1499;
  const disc = Math.round((mrp-price)/mrp*100);
  const np = {
    id: products.length+100+Math.floor(Math.random()*100),
    name, brand: document.getElementById('fp-brand').value||'Generic',
    category: document.getElementById('fp-cat').value,
    price, mrp, discount: disc,
    rating: parseFloat(document.getElementById('fp-rating').value)||4.0,
    reviews: Math.floor(Math.random()*1000)+100,
    emoji: document.getElementById('fp-emoji').value||'📦',
    stock: parseInt(document.getElementById('fp-stock').value)||50,
    desc: document.getElementById('fp-desc').value||'Quality product'
  };
  products.push(np);
  renderAdminProducts();
  renderProducts();
  renderHero();
  updateAdminStats();
  showToast('✅ Product "'+name+'" added!');
  ['fp-name','fp-brand','fp-price','fp-mrp','fp-rating','fp-emoji','fp-stock','fp-desc'].forEach(id=>document.getElementById(id).value='');
}

// Delete product
function deleteProduct(id){
  if(!confirm('Delete this product?')) return;
  products = products.filter(p=>p.id!==id);
  renderAdminProducts();
  renderProducts();
  renderHero();
  updateAdminStats();
  showToast('Product deleted');
}

// Edit product
function editProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('fp-name').value = p.name;
  document.getElementById('fp-brand').value = p.brand;
  document.getElementById('fp-price').value = p.price;
  document.getElementById('fp-mrp').value = p.mrp;
  document.getElementById('fp-rating').value = p.rating;
  document.getElementById('fp-emoji').value = p.emoji;
  document.getElementById('fp-stock').value = p.stock;
  document.getElementById('fp-desc').value = p.desc;
  deleteProduct(id);
  document.getElementById('sec-products').scrollTop = 0;
  showToast('Edit mode: modify and re-save');
}

// Update order status
function updateStatus(id, status){
  const o = orders.find(x=>x.id===id);
  if(o) o.status = status;
  showToast('Order '+id+' → '+status);
}