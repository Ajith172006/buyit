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
      requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 30);
        setTimeout(() => setTickDone(true), 900);
        setTimeout(() => setContentVisible(true), 1100);
      });
    }
  }, [state.orderConfirmationOpen]);

  const handleClose = () => dispatch({ type: 'CLOSE_ORDER_CONFIRMATION' });

  if (!state.orderConfirmationOpen) return null;

  const orderId      = order?._id || order?.id || ('ORD-' + Date.now());
  const orderItems   = order?.items || [];
  const totalAmount  = order?.totalAmount || 0;
  const paymentMethod = order?.paymentMethod || 'Online';
  const shippingName = order?.shippingAddress?.name || '';
  const shippingAddr = order?.shippingAddress?.street || '';

  const estimatedDelivery = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  })();

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
          80%  { opacity: 0.7; }
          100% { opacity: 0; transform: translateY(110vh) rotate(720deg) scale(0.4); }
        }
        @keyframes oc-fadeIn {
          from { opacity: 0; transform: scale(0.88) translateY(32px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .oc-card {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 460px;
          margin: 12px;
          overflow: hidden;
          box-shadow: 0 24px 72px rgba(0,0,0,0.38);
          max-height: 92vh;
          overflow-y: auto;
          scrollbar-width: none;
          animation: oc-fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .oc-card::-webkit-scrollbar { display: none; }

        .oc-header {
          background: linear-gradient(135deg, #1a7a4a 0%, #2ecc71 60%, #27ae60 100%);
          padding: 36px 24px 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .oc-body {
          padding: 20px;
        }
        @media (min-width: 480px) {
          .oc-header { padding: 44px 32px 32px; }
          .oc-body   { padding: 24px; }
        }

        .oc-badge {
          background: #f0f7ff;
          border: 1px solid #c8dffe;
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .oc-items-row {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fafafa;
          border-radius: 8px;
          padding: 8px 10px;
        }
        .oc-item-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 4px;
          background: #fff;
          flex-shrink: 0;
        }
        .oc-item-name {
          font-size: 13px;
          color: #212121;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
          min-width: 0;
        }
        .oc-delivery-box {
          background: linear-gradient(135deg, #fff3e0 0%, #fff8f0 100%);
          border: 1px solid #ffe0b2;
          border-radius: 10px;
          padding: 11px 14px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .oc-cta {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #2874f0 0%, #1557c0 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 16px rgba(40,116,240,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .oc-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(40,116,240,0.45);
        }
        .oc-cta:active { transform: translateY(0); }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
          padding: '12px',
          boxSizing: 'border-box',
        }}
      >
        {/* Confetti */}
        {tickDone && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  width: `${5 + (i % 5) * 3}px`,
                  height: `${5 + (i % 4) * 3}px`,
                  borderRadius: i % 3 === 0 ? '50%' : '2px',
                  background: ['#2874f0','#fb641b','#4caf50','#ffd700','#e91e63','#00bcd4','#9c27b0'][i % 7],
                  left: `${(i * 37) % 100}%`,
                  top: '-24px',
                  animation: `confettiFall ${1.4 + (i % 4) * 0.35}s ease-in ${(i % 7) * 0.1}s forwards`,
                }}
              />
            ))}
          </div>
        )}

        {/* Card */}
        <div className="oc-card" onClick={e => e.stopPropagation()}>

          {/* Green Header */}
          <div className="oc-header">
            {/* BG circles */}
            <div style={{ position:'absolute', top:'-28px', left:'-28px', width:'110px', height:'110px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', bottom:'-18px', right:'-18px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }} />

            {/* SVG Tick */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
              <svg width="92" height="92" viewBox="0 0 100 100" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.22))' }}>
                <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,0.15)" />
                {/* Animated ring */}
                <circle
                  cx="50" cy="50" r="46"
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="4"
                  strokeDasharray="289"
                  strokeDashoffset={visible ? 0 : 289}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 0.65s cubic-bezier(0.4,0,0.2,1) 0.1s' }}
                />
                {/* Animated tick */}
                <polyline
                  points="26,52 42,68 74,34"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="80"
                  strokeDashoffset={tickDone ? 0 : 80}
                  style={{ transition: 'stroke-dashoffset 0.42s cubic-bezier(0.4,0,0.2,1) 0.65s' }}
                />
              </svg>
            </div>

            <h1 style={{
              color:'#fff', fontSize:'clamp(20px, 5vw, 26px)', fontWeight:800,
              margin:0, letterSpacing:'-0.5px',
              opacity: tickDone ? 1 : 0,
              transform: tickDone ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease 0.85s',
            }}>
              Order Confirmed! 🎉
            </h1>
            <p style={{
              color:'rgba(255,255,255,0.88)', margin:'6px 0 0', fontSize:'13px',
              opacity: tickDone ? 1 : 0,
              transition: 'opacity 0.4s ease 1s',
            }}>
              Thank you for shopping with BuyIT
            </p>
          </div>

          {/* Body */}
          <div
            className="oc-body"
            style={{
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? 'translateY(0)' : 'translateY(14px)',
              transition: 'all 0.4s ease',
            }}
          >
            {/* Order ID */}
            <div className="oc-badge">
              <div>
                <div style={{ fontSize:'10px', color:'#999', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px' }}>Order ID</div>
                <div style={{ fontSize:'12px', fontWeight:700, color:'#1a3c6e', fontFamily:'monospace', marginTop:'2px', wordBreak:'break-all' }}>
                  #{typeof orderId === 'string' ? orderId.slice(-14).toUpperCase() : orderId}
                </div>
              </div>
              <div style={{ background:'#e8f5e9', color:'#2e7d32', padding:'4px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, flexShrink:0 }}>
                ✓ Placed
              </div>
            </div>

            {/* Delivery address */}
            {shippingName && (
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'10px', color:'#999', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'5px' }}>Delivering To</div>
                <div style={{ fontSize:'14px', color:'#212121', fontWeight:600 }}>{shippingName}</div>
                {shippingAddr && <div style={{ fontSize:'12px', color:'#666', marginTop:'2px', wordBreak:'break-word' }}>{shippingAddr}</div>}
              </div>
            )}

            {/* Items */}
            {orderItems.length > 0 && (
              <div style={{ marginBottom:'14px' }}>
                <div style={{ fontSize:'10px', color:'#999', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'7px' }}>
                  Items ({orderItems.length})
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                  {orderItems.slice(0, 3).map((item, i) => (
                    <div key={i} className="oc-items-row">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="oc-item-img"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div className="oc-item-name">{item.name}</div>
                        <div style={{ fontSize:'11px', color:'#999' }}>Qty: {item.quantity || item.qty}</div>
                      </div>
                      <div style={{ fontSize:'13px', fontWeight:700, color:'#212121', whiteSpace:'nowrap' }}>
                        ₹{formatNumber((item.price || 0) * (item.quantity || item.qty || 1))}
                      </div>
                    </div>
                  ))}
                  {orderItems.length > 3 && (
                    <div style={{ fontSize:'12px', color:'#888', textAlign:'center', padding:'3px' }}>
                      +{orderItems.length - 3} more item{orderItems.length - 3 > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ borderTop:'1px dashed #e8e8e8', margin:'14px 0' }} />

            {/* Total & payment */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
              <div>
                <div style={{ fontSize:'11px', color:'#999' }}>Payment Method</div>
                <div style={{ fontSize:'13px', color:'#555', fontWeight:600, textTransform:'capitalize', marginTop:'2px' }}>
                  {paymentMethod.replace(/-/g, ' ')}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'11px', color:'#999' }}>Total Paid</div>
                <div style={{ fontSize:'22px', fontWeight:800, color:'#212121', lineHeight:1 }}>₹{formatNumber(totalAmount)}</div>
              </div>
            </div>

            {/* Estimated delivery */}
            <div className="oc-delivery-box">
              <span style={{ fontSize:'22px', flexShrink:0 }}>🚚</span>
              <div>
                <div style={{ fontSize:'12px', fontWeight:700, color:'#e65100' }}>Estimated Delivery</div>
                <div style={{ fontSize:'12px', color:'#bf360c', marginTop:'2px' }}>{estimatedDelivery}</div>
              </div>
            </div>

            {/* CTA */}
            <button className="oc-cta" onClick={handleClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
