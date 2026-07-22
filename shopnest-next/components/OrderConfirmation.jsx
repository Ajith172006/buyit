'use client';
import { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function OrderConfirmation() {
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);
  const [tickDone, setTickDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const order = state.lastOrder;

  useEffect(() => {
    if (state.orderConfirmationOpen) {
      setVisible(false);
      setTickDone(false);
      setContentVisible(false);
      // Stagger animations
      requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 30);
        setTimeout(() => setTickDone(true), 900);
        setTimeout(() => setContentVisible(true), 1100);
      });
    }
  }, [state.orderConfirmationOpen]);

  const handleClose = () => {
    dispatch({ type: 'CLOSE_ORDER_CONFIRMATION' });
  };

  if (!state.orderConfirmationOpen) return null;

  const orderId = order?._id || order?.id || ('ORD-' + Date.now());
  const orderItems = order?.items || [];
  const totalAmount = order?.totalAmount || 0;
  const paymentMethod = order?.paymentMethod || 'Online';
  const shippingName = order?.shippingAddress?.name || 'Customer';
  const shippingAddr = order?.shippingAddress?.street || '';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
      onClick={handleClose}
    >
      {/* Confetti Particles */}
      {tickDone && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${6 + (i % 5) * 3}px`,
                height: `${6 + (i % 4) * 3}px`,
                borderRadius: i % 3 === 0 ? '50%' : '2px',
                background: ['#2874f0','#fb641b','#4caf50','#ffd700','#e91e63','#00bcd4','#9c27b0'][i % 7],
                left: `${(i * 37) % 100}%`,
                top: '-20px',
                animation: `confettiFall ${1.5 + (i % 4) * 0.4}s ease-in ${(i % 6) * 0.12}s forwards`,
                opacity: 0,
                transform: `rotate(${i * 25}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '480px',
          margin: '20px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(40px)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Green success header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a7a4a 0%, #2ecc71 60%, #27ae60 100%)',
            padding: '44px 32px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{ position:'absolute', top:'-30px', left:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
          <div style={{ position:'absolute', bottom:'-20px', right:'-20px', width:'90px', height:'90px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />

          {/* SVG Tick Circle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.25))' }}
            >
              {/* Background circle fill */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="rgba(255,255,255,0.15)"
              />
              {/* Animated border circle */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="4"
                strokeDasharray="289"
                strokeDashoffset={visible ? 0 : 289}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s' }}
              />
              {/* Animated checkmark */}
              <polyline
                points="26,52 42,68 74,34"
                fill="none"
                stroke="#fff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                strokeDashoffset={tickDone ? 0 : 80}
                style={{ transition: 'stroke-dashoffset 0.45s cubic-bezier(0.4,0,0.2,1) 0.7s' }}
              />
            </svg>
          </div>

          <h1
            style={{
              color: '#fff',
              fontSize: '26px',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.5px',
              opacity: tickDone ? 1 : 0,
              transform: tickDone ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease 0.9s',
            }}
          >
            Order Confirmed!
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              margin: '6px 0 0',
              fontSize: '14px',
              opacity: tickDone ? 1 : 0,
              transition: 'opacity 0.4s ease 1.05s',
            }}
          >
            Thank you for shopping with BuyIT 🎉
          </p>
        </div>

        {/* Order Details */}
        <div
          style={{
            padding: '24px',
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.45s ease',
          }}
        >
          {/* Order ID badge */}
          <div
            style={{
              background: '#f0f7ff',
              border: '1px solid #c8dffe',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a3c6e', fontFamily: 'monospace', marginTop: '2px' }}>
                #{typeof orderId === 'string' ? orderId.slice(-12).toUpperCase() : orderId}
              </div>
            </div>
            <div
              style={{
                background: '#e8f5e9',
                color: '#2e7d32',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              ✓ Placed
            </div>
          </div>

          {/* Delivery info */}
          {shippingName && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Delivering To</div>
              <div style={{ fontSize: '14px', color: '#212121', fontWeight: 600 }}>{shippingName}</div>
              {shippingAddr && <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>{shippingAddr}</div>}
            </div>
          )}

          {/* Items */}
          {orderItems.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Items ({orderItems.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orderItems.slice(0, 3).map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fafafa', borderRadius: '8px', padding: '8px 10px' }}>
                    {item.image && (
                      <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px', background: '#fff' }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#212121', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>Qty: {item.quantity || item.qty}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#212121', whiteSpace: 'nowrap' }}>
                      ₹{formatNumber((item.price || 0) * (item.quantity || item.qty || 1))}
                    </div>
                  </div>
                ))}
                {orderItems.length > 3 && (
                  <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', padding: '4px' }}>
                    +{orderItems.length - 3} more item{orderItems.length - 3 > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px dashed #e0e0e0', margin: '16px 0' }} />

          {/* Total & payment */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888' }}>Payment</div>
              <div style={{ fontSize: '13px', color: '#555', fontWeight: 600, textTransform: 'capitalize' }}>{paymentMethod.replace('-', ' ')}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>Total Paid</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#212121' }}>₹{formatNumber(totalAmount)}</div>
            </div>
          </div>

          {/* Estimated delivery */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fff3e0 0%, #fff8f0 100%)',
              border: '1px solid #ffe0b2',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '22px' }}>🚚</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#e65100' }}>Estimated Delivery</div>
              <div style={{ fontSize: '12px', color: '#bf360c' }}>
                {(() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 4);
                  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
                })()}
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #2874f0 0%, #1557c0 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.3px',
              boxShadow: '0 4px 16px rgba(40,116,240,0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(40,116,240,0.45)'; }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(40,116,240,0.35)'; }}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          80%  { opacity: 0.8; }
          100% { opacity: 0; transform: translateY(105vh) rotate(720deg) scale(0.5); }
        }
      `}</style>
    </div>
  );
}
