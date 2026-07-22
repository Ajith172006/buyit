'use client';
import { useStore } from '@/context/StoreContext';
import { useRouter, usePathname } from 'next/navigation';

export default function MobileNav() {
  const { state, dispatch, cartCount } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleAccountClick = () => {
    if (state.userAuthenticated) {
      dispatch({ type: 'OPEN_USER_PROFILE' });
    } else {
      dispatch({ type: 'OPEN_USER_LOGIN' });
    }
  };

  return (
    <div id="mobile-bottom-nav">
      <button className={`mob-nav-item${pathname === '/' ? ' active' : ''}`} onClick={() => {
        if (pathname === '/') {
          window.scrollTo(0, 0);
        } else {
          router.push('/');
          dispatch({ type: 'SET_CATEGORY', category: 'all' });
          dispatch({ type: 'SET_SEARCH', search: '' });
        }
      }}>
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
