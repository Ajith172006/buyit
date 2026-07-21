'use client';
import { useStore } from '@/context/StoreContext';

export default function MobileNav() {
  const { state, dispatch, cartCount } = useStore();

  const handleAccountClick = () => {
    if (state.userAuthenticated) {
      dispatch({ type: 'OPEN_USER_PROFILE' });
    } else {
      dispatch({ type: 'OPEN_USER_LOGIN' });
    }
  };

  return (
    <div id="mobile-bottom-nav">
      <button className="mob-nav-item active" onClick={() => window.scrollTo(0,0)}>
        <div className="mob-icon">🏠</div>
        <span>Home</span>
      </button>
      <button className="mob-nav-item" onClick={() => dispatch({ type: 'OPEN_VIDEO_MODAL' })}>
        <div className="mob-icon">▶️</div>
        <span>Play</span>
      </button>
      <button className="mob-nav-item" onClick={handleAccountClick}>
        <div className="mob-icon">👤</div>
        <span>Account</span>
      </button>
      <button className="mob-nav-item cart-nav-btn" onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
        <div className="mob-icon">
          🛒
          {cartCount > 0 && <div className="mob-cart-badge">{cartCount}</div>}
        </div>
        <span>Cart</span>
      </button>
    </div>
  );
}
