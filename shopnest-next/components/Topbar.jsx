'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import Link from 'next/link';

export default function Topbar() {
  const { state, dispatch, cartCount } = useStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const locationText = state.userProfile?.address
    ? `HOME ${state.userProfile.address}`
    : 'Select delivery location';

  const handleLogoClick = () => {
    dispatch({ type: 'SET_CATEGORY', category: 'all' });
    dispatch({ type: 'SET_SEARCH', search: '' });
    router.push('/');
  };

  const handleProfileClick = () => {
    if (state.userAuthenticated) {
      dispatch({ type: 'OPEN_USER_PROFILE' });
    } else {
      dispatch({ type: 'OPEN_USER_LOGIN' });
    }
    setMenuOpen(false);
  };

  const openSearch = () => {
    const query = state.activeSearch.trim();
    if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const suggestions = state.activeSearch.trim().length > 0
    ? state.products.filter((product) =>
        [product.name, product.brand, product.category]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(state.activeSearch.trim().toLowerCase()))
      ).slice(0, 6)
    : [];

  const selectSuggestion = (product) => {
    dispatch({ type: 'SET_SEARCH', search: product.name });
    dispatch({ type: 'SHOW_DETAIL', id: product.id });
    setSearchFocused(false);
  };

  const renderSuggestions = () => searchFocused && suggestions.length > 0 && (
    <div className="search-suggestions" role="listbox" aria-label="Product suggestions">
      {suggestions.map((product) => (
        <button className="search-suggestion" type="button" key={product.id} role="option" onMouseDown={(event) => event.preventDefault()} onClick={() => selectSuggestion(product)}>
          <img src={product.image} alt="" />
          <span><strong>{product.name}</strong><small>{product.brand} · {product.category}</small></span>
          <b>₹{product.price?.toLocaleString('en-IN')}</b>
        </button>
      ))}
      <button className="search-all-results" type="button" onMouseDown={(event) => event.preventDefault()} onClick={openSearch}>
        View all results for “{state.activeSearch.trim()}”
      </button>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP TOPBAR --- */}
      <div id="topbar" className="desktop-only">
        <div className="topbar-inner-container">
          <div className="logo" onClick={handleLogoClick}>
            <span className="logo-brand">BuyIt</span>
            <span className="logo-sub">Explore <span className="plus-color">Plus ✦</span></span>
          </div>
          <div className="search-bar">
            <input
              type="text"
              id="search-input"
              placeholder="Search for products, brands and more..."
              value={state.activeSearch}
              onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={e => { if (e.key === 'Enter') openSearch(); }}
            />
            <button onClick={openSearch} aria-label="Search products">🔍</button>
            {renderSuggestions()}
          </div>
          
          <div className="nav-actions">
            <Link href="/seller" className="become-seller-link">
              Become a Seller
            </Link>
            <Link href="/admin" className="become-seller-link" style={{ marginRight: '12px' }}>
              Admin
            </Link>
            {state.authLoading ? (
              <button className="nav-btn" disabled>
                ⏳ Loading...
              </button>
            ) : state.userAuthenticated ? (
              <button className="nav-btn" onClick={() => {
                dispatch({ type: 'OPEN_USER_PROFILE' });
                setMenuOpen(false);
              }}>
                👤 {state.userProfile?.name?.split(' ')[0] || 'User'} ▾
              </button>
            ) : (
              <button className="nav-btn-login" onClick={() => {
                dispatch({ type: 'OPEN_USER_LOGIN' });
                setMenuOpen(false);
              }}>
                Login
              </button>
            )}


            <button
              className="nav-btn nav-btn-play"
              onClick={() => {
                dispatch({ type: 'OPEN_VIDEO_MODAL' });
                setMenuOpen(false);
              }}
              aria-label="Open BuyIt Play"
            >
              ▶ Play
            </button>

            <button className="nav-btn-cart" onClick={() => {
              dispatch({ type: 'TOGGLE_CART' });
              setMenuOpen(false);
            }}>
              🛒 Cart <span id="cart-count">{cartCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE TOPBAR --- */}
      <div id="mobile-topbar" className="mobile-only">
        <div className="mobile-header-top">
          <div className="mobile-logo" onClick={handleLogoClick}>
            <div className="ml-icon">🛍</div>
            <div className="ml-text">BuyIt</div>
          </div>
          <button className="top-right-profile-btn mobile-profile-btn" onClick={handleProfileClick} title="My Account">
            {state.userAuthenticated ? (
              <div className="avatar-circle">
                {state.userProfile?.name?.charAt(0).toUpperCase() || '👤'}
              </div>
            ) : (
              <span className="profile-icon">👤</span>
            )}
          </button>
        </div>
        
        <div className="mobile-location-bar">
          <div className="loc-icon">🏠</div>
          <div className="loc-text"><strong>HOME</strong> {state.userProfile?.address || 'Select delivery location'}</div>
          <div className="loc-arrow">⌄</div>
        </div>

        <div className="mobile-search-container">
          <div className="ms-box">
            <span className="ms-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={state.activeSearch}
              onChange={e => dispatch({ type: 'SET_SEARCH', search: e.target.value })}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={e => { if (e.key === 'Enter') openSearch(); }}
            />
            <span className="ms-camera">📷</span>
            <span className="ms-scan">🔳</span>
            {renderSuggestions()}
          </div>
        </div>
      </div>
    </>
  );
}
