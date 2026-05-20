'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';
import { categories } from '@/lib/data';

export default function AdminProducts() {
  const { state, dispatch, showToast } = useStore();
  const [form, setForm] = useState({
    name: '', brand: '', category: 'Electronics', price: '', mrp: '',
    rating: '', image: '', stock: '', desc: '',
  });

  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addProduct = async () => {
    if (!form.name.trim()) { showToast('Please enter a product name'); return; }
    const price = parseInt(form.price) || 999;
    const mrp = parseInt(form.mrp) || 1499;
    const product = {
      name: form.name,
      brand: form.brand || 'Generic',
      category: form.category,
      price,
      originalPrice: mrp,
      discount: Math.round((mrp - price) / mrp * 100),
      rating: parseFloat(form.rating) || 4.0,
      image: form.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      stock: parseInt(form.stock) || 50,
      description: form.desc || 'Quality product',
    };
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const json = await res.json();
      
      if (res.ok && json.success) {
        // Map backend format to frontend format
        const newP = json.data;
        const mappedProduct = {
          id: newP._id,
          name: newP.name,
          brand: newP.brand || 'Generic',
          category: newP.category,
          price: newP.price,
          mrp: newP.originalPrice,
          discount: newP.discount,
          rating: newP.rating,
          reviews: newP.reviews?.length || 0,
          image: newP.image,
          stock: newP.stock,
          desc: newP.description,
        };
        dispatch({ type: 'ADD_PRODUCT', product: mappedProduct });
        showToast(`✅ Product "${form.name}" added!`);
        setForm({ name:'',brand:'',category:'Electronics',price:'',mrp:'',rating:'',image:'',stock:'',desc:'' });
      } else {
        showToast(json.message || 'Error adding product');
      }
    } catch (err) {
      console.error(err);
      showToast('Error adding product');
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        dispatch({ type: 'DELETE_PRODUCT', id });
        showToast('Product deleted');
      } else {
        showToast('Error deleting product');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting product');
    }
  };

  const editProduct = (id) => {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    setForm({ name:p.name,brand:p.brand,category:p.category,price:p.price,mrp:p.mrp,rating:p.rating,image:p.image,stock:p.stock,desc:p.desc });
    dispatch({ type: 'DELETE_PRODUCT', id });
    showToast('Edit mode: modify and re-save');
  };

  return (
    <div className="admin-section active" id="sec-products">
      <div className="add-product-form">
        <h2>➕ Add New Product</h2>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Samsung Galaxy S24" />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input type="text" value={form.brand} onChange={e => handleChange('brand', e.target.value)} placeholder="e.g. Samsung" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={e => handleChange('category', e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" value={form.price} onChange={e => handleChange('price', e.target.value)} placeholder="e.g. 29999" />
          </div>
          <div className="form-group">
            <label>MRP (₹)</label>
            <input type="number" value={form.mrp} onChange={e => handleChange('mrp', e.target.value)} placeholder="e.g. 39999" />
          </div>
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input type="number" value={form.rating} onChange={e => handleChange('rating', e.target.value)} min="1" max="5" step="0.1" placeholder="e.g. 4.2" />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" value={form.image} onChange={e => handleChange('image', e.target.value)} placeholder="e.g. https://..." />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => handleChange('stock', e.target.value)} placeholder="e.g. 100" />
          </div>
          <div className="form-group full">
            <label>Description</label>
            <textarea rows={3} value={form.desc} onChange={e => handleChange('desc', e.target.value)} placeholder="Product description..." style={{ resize: 'vertical' }} />
          </div>
        </div>
        <button className="form-submit" onClick={addProduct}>Add Product</button>
      </div>

      <div className="admin-table-wrap">
        <h2>All Products (<span id="prod-count-admin">{state.products.length}</span>)</h2>
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Product</th><th>Category</th><th>Price</th><th>MRP</th><th>Disc%</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {state.products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img src={p.image} alt="" style={{ width: 24, height: 24, objectFit: 'contain', verticalAlign: 'middle', marginRight: 8 }} />
                  {p.name.substring(0, 25)}...
                </td>
                <td>{p.category}</td>
                <td>₹{formatNumber(p.price)}</td>
                <td>₹{formatNumber(p.mrp)}</td>
                <td><span style={{ color: '#26a541', fontWeight: 600 }}>{p.discount}%</span></td>
                <td>{p.stock}</td>
                <td>{p.rating} ★</td>
                <td>
                  <button className="action-btn edit" onClick={() => editProduct(p.id)}>Edit</button>{' '}
                  <button className="action-btn del" onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
