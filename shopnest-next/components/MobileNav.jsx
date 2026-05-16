'use client';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabaseClient';

export default function MobileNav() {
  const { state, dispatch, cartCount } = useStore();

  const handleAccountClick = () => {
    if (state.userAuthenticated) {
      // If already authenticated, maybe toggle a user menu or log out.
      // For now, let's just log out or show a toast
      dispatch({ type: 'SHOW_TOAST', message: 'Hello ' + (state.userProfile?.name || 'User') });
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
      <button className="mob-nav-item">
        <div className="mob-icon">▶️</div>
        <span>Play</span>
      </button>
      <button className="mob-nav-item">
        <div className="mob-icon">🏷️</div>
        <span>Top Deals</span>
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
