'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';
import { categories } from '@/lib/data';

export default function AdminProducts() {
  const { state, dispatch, showToast } = useStore();
  const [form, setForm] = useState({
    name: '', brand: '', category: 'Electronics', price: '', mrp: '',
    rating: '', images: [], stock: '', desc: '',
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleImageSelection = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    if (form.images.length + files.length > 5) { showToast('You can upload a maximum of 5 images'); return; }
    if (files.some((file) => !file.type.startsWith('image/'))) { showToast('Please select image files only'); return; }
    if (files.some((file) => file.size > 2 * 1024 * 1024)) { showToast('Each image must be 2 MB or smaller'); return; }
    const existingSize = form.images.reduce((total, image) => total + Math.ceil((image.length * 3) / 4), 0);
    if (existingSize + files.reduce((total, file) => total + file.size, 0) > 6 * 1024 * 1024) { showToast('Combined image size must be 6 MB or smaller'); return; }

    const images = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    handleChange('images', [...form.images, ...images]);
    event.target.value = '';
  };

  const removeImage = (index) => handleChange('images', form.images.filter((_, imageIndex) => imageIndex !== index));

  const addProduct = async () => {
    if (!form.name.trim()) { showToast('Please enter a product name'); return; }
    if (form.images.length === 0) { showToast('Please upload at least one product image'); return; }
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
      image: form.images[0],
      images: form.images,
      stock: parseInt(form.stock) || 50,
      description: form.desc || 'Quality product',
    };

    const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'changeme-in-production';

    if (editingId) {
      // UPDATE existing product
      let updatedP = null;
      let apiSuccess = false;
      try {
        const res = await fetch(`/api/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminKey}` },
          body: JSON.stringify(product)
        });
        const json = await res.json();
        if (res.ok && json.success) {
          updatedP = json.data;
          apiSuccess = true;
        } else {
          console.warn('API error during product update:', json?.message);
        }
      } catch (err) {
        console.warn('Network error or API server offline. Falling back to local update.', err.message);
      }

      const mapped = apiSuccess && updatedP ? {
        id: updatedP._id,
        name: updatedP.name,
        brand: updatedP.brand || 'Generic',
        category: updatedP.category,
        price: updatedP.price,
        mrp: updatedP.originalPrice,
        discount: updatedP.discount,
        rating: updatedP.rating,
        reviews: Array.isArray(updatedP.reviews) ? updatedP.reviews : [],
        image: updatedP.image,
        images: updatedP.images?.length ? updatedP.images : [updatedP.image],
        stock: updatedP.stock,
        desc: updatedP.description,
      } : {
        ...state.products.find(p => p.id === editingId),
        ...product,
        id: editingId,
        desc: product.description,
        mrp: product.originalPrice,
      };

      dispatch({ type: 'SET_PRODUCTS', products: state.products.map(p => p.id === editingId ? mapped : p) });
      showToast(apiSuccess ? `✅ Product "${form.name}" updated!` : `✅ Product "${form.name}" updated locally!`);
      setEditingId(null);
      setForm({ name:'',brand:'',category:'Electronics',price:'',mrp:'',rating:'',images:[],stock:'',desc:'' });
    } else {
      // CREATE new product
      let newP = null;
      let apiSuccess = false;
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminKey}` },
          body: JSON.stringify(product)
        });
        const json = await res.json();
        if (res.ok && json.success) {
          newP = json.data;
          apiSuccess = true;
        } else {
          console.warn('API error during product creation:', json?.message);
        }
      } catch (err) {
        console.warn('Network error or API server offline. Falling back to local create.', err.message);
      }

      const mappedProduct = apiSuccess && newP ? {
        id: newP._id,
        name: newP.name,
        brand: newP.brand || 'Generic',
        category: newP.category,
        price: newP.price,
        mrp: newP.originalPrice,
        discount: newP.discount,
        rating: newP.rating,
        reviews: Array.isArray(newP.reviews) ? newP.reviews : [],
        image: newP.image,
        images: newP.images?.length ? newP.images : [newP.image],
        stock: newP.stock,
        desc: newP.description,
      } : {
        ...product,
        id: `local-${Date.now()}`,
        reviews: [],
        mrp: product.originalPrice,
        desc: product.description,
      };

      dispatch({ type: 'ADD_PRODUCT', product: mappedProduct });
      showToast(apiSuccess ? `✅ Product "${form.name}" added!` : `✅ Product "${form.name}" added locally!`);
      setForm({ name:'',brand:'',category:'Electronics',price:'',mrp:'',rating:'',images:[],stock:'',desc:'' });
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    let apiSuccess = false;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminKey}` },
      });
      if (res.ok) {
        apiSuccess = true;
      }
    } catch (err) {
      console.warn('Network error or API server offline during delete. Removing locally.', err.message);
    }

    dispatch({ type: 'DELETE_PRODUCT', id });
    showToast(apiSuccess ? 'Product deleted' : 'Product deleted locally');
  };

  const editProduct = (id) => {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    setEditingId(id);
    setForm({ name:p.name, brand:p.brand, category:p.category, price:p.price, mrp:p.mrp, rating:p.rating, images:p.images?.length ? p.images : [p.image], stock:p.stock, desc:p.desc });
    showToast('Edit mode: modify and click "Update Product"');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name:'',brand:'',category:'Electronics',price:'',mrp:'',rating:'',images:[],stock:'',desc:'' });
  };

  return (
    <div className="admin-section active" id="sec-products">
      <div className="add-product-form">
        <h2>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
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
          <div className="form-group full">
            <label>Product Images (up to 5)</label>
            <input className="product-image-input" type="file" accept="image/*" multiple onChange={handleImageSelection} />
            <small className="image-upload-help">Choose images from your device. PNG, JPG, and WEBP up to 2 MB each.</small>
            {form.images.length > 0 && (
              <div className="image-upload-preview">
                {form.images.map((image, index) => (
                  <div className="image-upload-item" key={`${image.slice(0, 24)}-${index}`}>
                    <img src={image} alt={`Product upload ${index + 1}`} />
                    {index === 0 && <span>Primary</span>}
                    <button type="button" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`}>×</button>
                  </div>
                ))}
              </div>
            )}
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
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="form-submit" onClick={addProduct}>
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
          {editingId && (
            <button className="form-submit" onClick={cancelEdit} style={{ background: '#6b7280' }}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div className="admin-table-wrap">
        <h2>All Products (<span id="prod-count-admin">{state.products.length}</span>)</h2>
        <table className="admin-table admin-products-table">
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
        <div className="admin-mobile-product-list">
          {state.products.map(p => (
            <article className="admin-mobile-product-card" key={p.id}>
              <div className="admin-mobile-product-heading">
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>ID: {p.id}</span>
                </div>
              </div>
              <dl className="admin-mobile-product-details">
                <div><dt>Category</dt><dd>{p.category}</dd></div>
                <div><dt>Price</dt><dd>₹{formatNumber(p.price)}</dd></div>
                <div><dt>MRP</dt><dd>₹{formatNumber(p.mrp)}</dd></div>
                <div><dt>Discount</dt><dd className="admin-discount-value">{p.discount}%</dd></div>
                <div><dt>Stock</dt><dd>{p.stock}</dd></div>
                <div><dt>Rating</dt><dd>{p.rating} ★</dd></div>
              </dl>
              <div className="admin-mobile-product-actions">
                <button className="action-btn edit" onClick={() => editProduct(p.id)}>Edit</button>
                <button className="action-btn del" onClick={() => deleteProduct(p.id)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
