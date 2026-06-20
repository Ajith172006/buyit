'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function CartPanel() {
  const { state, dispatch, cartTotal, showToast } = useStore();
  const { cart, cartOpen } = state;

  const closeAll = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  return (
    <>
      {cartOpen && <div id="overlay" className="show" onClick={closeAll} />}
      <div id="cart-panel" className={cartOpen ? 'open' : ''}>
        <div className="cart-header">
          <h2>My Cart</h2>
          <button className="cart-close" onClick={closeAll}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="ec-icon">🛒</div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>Your cart is empty!</div>
              <div style={{ fontSize: '13px' }}>Add items to get started</div>
            </div>
          ) : (
            cart.map(c => (
              <div className="cart-item" key={c.id}>
                <div className="ci-img">
                  <img src={c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="ci-info">
                  <div className="ci-name">{c.name}</div>
                  <div className="ci-price">₹{formatNumber(c.price * c.qty)}</div>
                  <div className="ci-qty">
                    <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: c.id, delta: -1 })}>−</button>
                    <span>{c.qty}</span>
                    <button onClick={() => dispatch({ type: 'CHANGE_QTY', id: c.id, delta: 1 })}>+</button>
                  </div>
                  <div className="ci-remove" onClick={() => dispatch({ type: 'REMOVE_FROM_CART', id: c.id })}>
                    Remove
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer" style={{ borderTop: '1px solid #e0e0e0', padding: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#878787', textTransform: 'uppercase', marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
              Price Details
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: '#212121' }}>
              <span>Price ({cart.reduce((s, c) => s + c.qty, 0)} items)</span>
              <span>₹{formatNumber(cart.reduce((acc, c) => acc + (c.mrp || c.price) * c.qty, 0))}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: '#388e3c' }}>
              <span>Discount</span>
              <span>-₹{formatNumber(cart.reduce((acc, c) => acc + (c.mrp || c.price) * c.qty, 0) - cartTotal)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '12px', color: '#212121' }}>
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c', fontWeight: 600 }}>FREE</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, padding: '12px 0', borderTop: '1px dashed #e0e0e0', borderBottom: '1px dashed #e0e0e0', marginBottom: '14px', color: '#212121' }}>
              <span>Total Amount</span>
              <span>₹{formatNumber(cartTotal)}</span>
            </div>
            
            <button
              className="checkout-btn"
              style={{
                width: '100%',
                background: '#fb641b',
                color: '#fff',
                border: 'none',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 700,
                borderRadius: '2px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)',
                fontFamily: 'Inter',
                textTransform: 'uppercase'
              }}
              onClick={() => { 
                if (!state.userAuthenticated) {
                  showToast('Please login to proceed to checkout.');
                  dispatch({ type: 'OPEN_USER_LOGIN' });
                  return;
                }
                dispatch({ type: 'CLOSE_CART' }); 
                dispatch({ type: 'OPEN_CHECKOUT' }); 
              }}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
}
