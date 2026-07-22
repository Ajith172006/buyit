'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { firebaseAuth } from '@/lib/firebaseClient';
import { signOut } from 'firebase/auth';
import { formatNumber } from '@/lib/utils';
import ProductCard from './ProductCard';

export default function UserProfileModal() {
  const { state, dispatch, showToast } = useStore();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ doorNo: '', street: '', city: '', district: '', state: '', pincode: '' });

  useEffect(() => {
    if (state.userProfileOpen && state.userProfile && activeTab === 'orders') {
      fetchOrders();
    }
  }, [state.userProfileOpen, activeTab]);

  const fetchOrders = async () => {
    if (state.userProfile?.id?.startsWith('demo-')) {
      setOrders([]);
      return;
    }

    setLoadingOrders(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/?$/, '') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/orders/user/${state.userProfile.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setOrders(json.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingOrders(false);
  };

  const handleLogout = async () => {
    if (firebaseAuth) await signOut(firebaseAuth);
    localStorage.removeItem('buyit_user_session');
    dispatch({ type: 'USER_LOGOUT' });
    dispatch({ type: 'CLOSE_USER_PROFILE' });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.doorNo || !newAddress.street || !newAddress.city || !newAddress.district || !newAddress.state || !newAddress.pincode) {
      showToast('Please fill all address fields');
      return;
    }
    
    // Optimistic UI update or fetch from backend...
    // Since the API requires email to update user, we'll send it
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.userProfile.email,
          address: newAddress
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Address added successfully!');
        setShowAddAddress(false);
        setNewAddress({ doorNo: '', street: '', city: '', district: '', state: '', pincode: '' });
        dispatch({ type: 'UPDATE_USER_PROFILE', profile: data.data });
      } else {
        showToast('Failed to add address');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!state.userProfileOpen) return null;

  return (
    <div id="user-profile-panel" className="admin-panel-overlay" style={{ zIndex: 3000 }}>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>👤 My Profile <span>{state.userProfile?.name}</span></h1>
        </div>
        <div className="admin-header-actions">
          <button className="admin-logout-btn" onClick={handleLogout}>🔓 Logout</button>
          <button className="close-admin" onClick={() => dispatch({ type: 'CLOSE_USER_PROFILE' })}>✕ Close</button>
        </div>
      </div>
      <nav className="profile-mobile-tabs" aria-label="Profile sections">
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
        <button className={activeTab === 'wishlist' ? 'active' : ''} onClick={() => setActiveTab('wishlist')}>Wishlist</button>
        <button className={activeTab === 'address' ? 'active' : ''} onClick={() => setActiveTab('address')}>Addresses</button>
      </nav>
      
      <div className="admin-body">
        <div className="admin-sidebar">
          <div 
            className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="icon">🛍</span> My Orders
          </div>
          <div 
            className={`admin-menu-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span className="icon">❤️</span> My Wishlist
          </div>
          <div 
            className={`admin-menu-item ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            <span className="icon">🏠</span> Address Book
          </div>
        </div>

        <div className="admin-content" data-lenis-prevent>
          {activeTab === 'orders' && (
            <div className="admin-section active">
              <h2>My Order History</h2>
              <div className="admin-table-wrap" style={{ marginTop: '20px' }}>
                {loadingOrders ? (
                  <p>Loading your orders...</p>
                ) : orders.length === 0 ? (
                  <p>You haven't placed any orders yet.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td>{o._id.substring(0,8).toUpperCase()}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td>{o.items.length} items</td>
                          <td>₹{formatNumber(o.totalAmount)}</td>
                          <td>
                            <span className={`status-badge ${o.orderStatus}`}>
                              {o.orderStatus.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="admin-section active">
              <h2>My Wishlist</h2>
              <div style={{ marginTop: '20px' }}>
                {(!state.wishlist || state.wishlist.length === 0) ? (
                  <p>Your wishlist is empty.</p>
                ) : (
                  <div id="product-grid">
                    {state.products
                      .filter(p => state.wishlist.includes(p.id))
                      .map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="admin-section active">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>My Saved Addresses</h2>
                <button className="form-submit" style={{ marginTop: 0 }} onClick={() => setShowAddAddress(!showAddAddress)}>
                  {showAddAddress ? 'Cancel' : '➕ Add New Address'}
                </button>
              </div>

              {showAddAddress && (
                <div className="add-product-form">
                  <h3>Add a New Address</h3>
                  <form onSubmit={handleAddAddress} className="form-grid" style={{ marginTop: '15px' }}>
                    <div className="form-group"><label>Door No / Flat</label><input type="text" value={newAddress.doorNo} onChange={e => setNewAddress({...newAddress, doorNo: e.target.value})} /></div>
                    <div className="form-group"><label>Street / Area</label><input type="text" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} /></div>
                    <div className="form-group"><label>City</label><input type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} /></div>
                    <div className="form-group"><label>District</label><input type="text" value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} /></div>
                    <div className="form-group"><label>State</label><input type="text" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} /></div>
                    <div className="form-group"><label>Pincode</label><input type="text" value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} /></div>
                    <div className="form-group full"><button type="submit" className="form-submit">Save Address</button></div>
                  </form>
                </div>
              )}

              <div className="admin-table-wrap">
                {(!state.userProfile?.savedAddresses || state.userProfile.savedAddresses.length === 0) ? (
                  <p>You have no saved addresses yet.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Label</th>
                        <th>Address Details</th>
                        <th>Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.userProfile.savedAddresses.map((addr, i) => (
                        <tr key={i}>
                          <td><strong>{addr.label}</strong></td>
                          <td>
                            {addr.doorNo}, {addr.street}<br/>
                            {addr.city}, {addr.district}<br/>
                            {addr.state} - {addr.pincode}
                          </td>
                          <td>
                            {addr.isDefault ? <span className="status-badge delivered">Yes</span> : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
