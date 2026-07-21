'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function ProductCard({ product: p }) {
  const { state, dispatch, showToast } = useStore();

  const isWishlisted = state.wishlist?.includes(p.id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!state.userAuthenticated) {
      showToast('Please login to wishlist items.');
      dispatch({ type: 'OPEN_USER_LOGIN' });
      return;
    }
    dispatch({ type: 'TOGGLE_WISHLIST', id: p.id });
    
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.userProfile.email, productId: p.id })
      });
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  return (
    <div
      className="product-card"
      onClick={() => dispatch({ type: 'SHOW_DETAIL', id: p.id })}
    >
      <div 
        onClick={handleWishlist}
        style={{
          position: 'absolute', top: '10px', right: '10px', fontSize: '20px', 
          cursor: 'pointer', zIndex: 10, transition: 'transform 0.2s',
          color: isWishlisted ? '#ef4444' : '#9ca3af'
        }}
        title="Wishlist"
      >
        {isWishlisted ? '❤️' : '🤍'}
      </div>

      {p.discount >= 30 && <div className="badge">{p.discount}% OFF</div>}

      <div className="p-img">
        <img
          src={p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'}
          alt={p.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'; }}
        />
      </div>

      <div className="p-brand">{p.brand}</div>
      <div className="p-name">{p.name}</div>

      <div className="p-rating">
        <span className="stars">{p.rating} ★</span>
        <span className="count">({formatNumber(Array.isArray(p.reviews) ? p.reviews.length : (p.reviews || 0))})</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
        <span className="p-price">₹{formatNumber(p.price)}</span>
        <span className="p-mrp">₹{formatNumber(p.mrp)}</span>
        <span className="p-disc">{p.discount}% off</span>
      </div>
    </div>
  );
}
