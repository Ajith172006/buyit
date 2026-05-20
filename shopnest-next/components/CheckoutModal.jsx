'use client';
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function CheckoutModal() {
  const { state, dispatch, cartTotal, showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');
  const [payment, setPayment] = useState('Online Payment (UPI/Card/Netbanking)');
  
  useEffect(() => {
    if (state.checkoutOpen && state.userProfile) {
      setName(state.userProfile.name || '');
      setPhone(state.userProfile.phone || '');
      if (state.userProfile.savedAddresses && state.userProfile.savedAddresses.length > 0) {
        const defaultAddr = state.userProfile.savedAddresses.find(a => a.isDefault) || state.userProfile.savedAddresses[0];
        setAddr(`${defaultAddr.doorNo}, ${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}`);
      } else {
        setAddr(state.userProfile.address || '');
      }
    }
  }, [state.checkoutOpen, state.userProfile]);

  const placeOrder = () => {
    if (!name.trim()) { showToast('Please fill in your name'); return; }
    const order = {
      id: 'SN' + Date.now(),
      customer: name,
      phone,
      items: state.cart.length,
      total: cartTotal,
      payment,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'pending',
    };
    dispatch({ type: 'PLACE_ORDER', order });
    showToast('🎉 Order placed! Order ID: ' + order.id);
  };

  if (!state.checkoutOpen) return null;

  return (
    <>
      <div id="overlay" className="show" onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} />
      <div id="checkout-modal" className="open">
        <h2>🛒 Checkout</h2>
        <div className="checkout-form">
          <div style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '12px', fontSize: '13px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontWeight: 700, marginBottom: '8px' }}>Order Summary</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Items ({state.cart.length})</span> <span>₹{formatNumber(cartTotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>Delivery Fee</span> <span style={{ color: '#10b981' }}>FREE</span></div>
            <hr style={{ margin: '8px 0', borderColor: '#e5e7eb' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '15px' }}><span>Total</span> <span>₹{formatNumber(cartTotal)}</span></div>
          </div>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="text" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
          
          {state.userProfile?.savedAddresses?.length > 0 ? (
            <select value={addr} onChange={e => setAddr(e.target.value)}>
              {state.userProfile.savedAddresses.map((a, i) => (
                <option key={i} value={`${a.doorNo}, ${a.street}, ${a.city}, ${a.state} - ${a.pincode}`}>
                  {a.label}: {a.doorNo}, {a.street}, {a.city}
                </option>
              ))}
              <option value="">Enter New Address Below</option>
            </select>
          ) : null}

          <input type="text" placeholder="Delivery Address" value={addr} onChange={e => setAddr(e.target.value)} />
          
          <select value={payment} onChange={e => setPayment(e.target.value)}>
            <option>Online Payment (UPI/Card/Netbanking)</option>
            <option>Cash on Delivery</option>
            <option>EMI</option>
          </select>
          <button className="place-order-btn" onClick={placeOrder}>
            Place Order ₹{formatNumber(cartTotal)}
          </button>
          <button className="cancel-checkout" onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })}>
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
