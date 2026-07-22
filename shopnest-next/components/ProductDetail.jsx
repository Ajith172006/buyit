'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { accessoryProducts } from '@/lib/data';

export default function ProductDetail() {
  const { state, dispatch, showToast } = useStore();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [exploreTab, setExploreTab] = useState('brand');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const detailRef = useRef();
  const touchStartX = useRef(null);

  const p = state.products.find(x => x.id === state.detailProductId);

  // Safe gallery images resolution for top-level hooks
  const galleryImages = p
    ? (Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : (Array.isArray(p.gallery) && p.gallery.length > 0
        ? p.gallery
        : [p.image]))
    : [];
  const hasMultipleImages = galleryImages.length > 1;
  const selectGalleryImage = (index) => {
    if (galleryImages.length === 0) return;
    setGalleryIndex((index + galleryImages.length) % galleryImages.length);
  };

  // Reset explore tab and scroll to top whenever a new product is opened
  useEffect(() => {
    setExploreTab('brand');
    setGalleryIndex(0);
    if (detailRef.current) {
      detailRef.current.scrollTo(0, 0);
    }
  }, [state.detailProductId]);

  // Autoplay images every 5 seconds
  useEffect(() => {
    if (!hasMultipleImages) return;
    const interval = setInterval(() => {
      selectGalleryImage(galleryIndex + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [galleryIndex, hasMultipleImages]);

  // Mouse drag handlers for sliding images
  const handleGalleryMouseDown = (event) => {
    if (!hasMultipleImages) return;
    touchStartX.current = event.clientX;
  };

  const handleGalleryMouseUp = (event) => {
    if (!hasMultipleImages || touchStartX.current === null) return;
    const movement = event.clientX - touchStartX.current;
    if (Math.abs(movement) > 40) {
      selectGalleryImage(galleryIndex + (movement < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  const handleGalleryMouseLeave = () => {
    touchStartX.current = null;
  };

  const handleGalleryTouchEnd = (event) => {
    if (!hasMultipleImages || touchStartX.current === null) return;
    const movement = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(movement) > 40) selectGalleryImage(galleryIndex + (movement < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  if (!p || state.detailProductId === null) return null;

  // ── Tab data ──────────────────────────────────────────────────────────────
  const sameBrandProducts = state.products
    .filter(prod => prod.brand === p.brand && prod.id !== p.id)
    .slice(0, 8);

  const sameCategoryProducts = state.products
    .filter(prod => prod.category === p.category && prod.id !== p.id)
    .slice(0, 8);

  const accessories = (accessoryProducts[p.category] || [])
    .filter(a => a.id !== p.id)
    .slice(0, 8);

  const tabItems =
    exploreTab === 'brand' ? sameBrandProducts :
    exploreTab === 'category' ? sameCategoryProducts :
    accessories;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!state.userAuthenticated) {
      showToast('Please login to add items to cart.');
      dispatch({ type: 'OPEN_USER_LOGIN' });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', id: p.id });
    showToast('Added to cart! 🛒');
    dispatch({ type: 'HIDE_DETAIL' });
  };

  const handleBuyNow = () => {
    if (!state.userAuthenticated) {
      showToast('Please login to buy items.');
      dispatch({ type: 'OPEN_USER_LOGIN' });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', id: p.id });
    dispatch({ type: 'HIDE_DETAIL' });
    dispatch({ type: 'OPEN_CHECKOUT' });
  };

  const isWishlisted = state.wishlist?.includes(p.id);

  const handleWishlist = async () => {
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
        body: JSON.stringify({ email: state.userProfile.email, productId: p.id }),
      });
    } catch (err) {
      console.error('Wishlist error', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!state.userAuthenticated) {
      showToast('Please login to review items.');
      dispatch({ type: 'OPEN_USER_LOGIN' });
      return;
    }
    if (!reviewText.trim()) {
      showToast('Please write a review.');
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.userProfile.email,
          productId: p.id,
          rating: reviewRating,
          text: reviewText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Review submitted successfully! ⭐');
        setReviewText('');
        const updated = {
          ...data.data,
          id: data.data._id || data.data.id,
          mrp: data.data.originalPrice || p.mrp,
          desc: data.data.description || p.desc,
        };
        dispatch({
          type: 'SET_PRODUCTS',
          products: state.products.map(prod => (prod.id === p.id ? updated : prod)),
        });
      } else {
        showToast(data.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review error', err);
      showToast('An error occurred');
    }
    setSubmittingReview(false);
  };

  // Breadcrumb: Category › Brand › Product Name
  const breadcrumb = [
    {
      label: p.category,
      action: () => {
        dispatch({ type: 'HIDE_DETAIL' });
        dispatch({ type: 'SET_CATEGORY', category: p.category });
      },
    },
    {
      label: p.brand,
      action: () => {
        dispatch({ type: 'HIDE_DETAIL' });
        dispatch({ type: 'SET_CATEGORY', category: 'all' });
        dispatch({ type: 'SET_SEARCH', search: p.brand });
      },
    },
    { label: p.name, action: null },
  ];

  // Default fallback reviews when no real reviews exist
  const fallbackReviews = [
    { user: 'Amit Sharma', rating: 5, text: 'Amazing product! The build quality is premium and it works flawlessly. Highly satisfied!', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { user: 'Priyanka Sen', rating: 4, text: 'Great value for money. Delivery was fast and the product is exactly as described.', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    { user: 'Rahul Verma', rating: 5, text: 'Fantastic experience. ShopNest delivers outstanding quality every single time.', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
  ];
  const reviewsList = Array.isArray(p.reviews) ? p.reviews : [];
  const displayReviews = reviewsList.length > 0 ? reviewsList : fallbackReviews;

  return (
    <div id="detail-view" ref={detailRef}>

      {/* ── Breadcrumb bar ── */}
      <div className="detail-top">
        <button className="back-btn" onClick={() => dispatch({ type: 'HIDE_DETAIL' })}>
          ← Back
        </button>
        <nav className="detail-breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="detail-breadcrumb-item">
              {i > 0 && <span className="detail-breadcrumb-sep">›</span>}
              {crumb.action ? (
                <button className="detail-breadcrumb-link" onClick={crumb.action}>
                  {crumb.label}
                </button>
              ) : (
                <span className="detail-breadcrumb-current">
                  {crumb.label.length > 30 ? crumb.label.slice(0, 30) + '…' : crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* ── Main product body ── */}
      <div className="detail-body">

        {/* Left: image + thumbnails + action buttons */}
        <div className="detail-img-col">
          <div
            className="product-gallery-main"
            onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
            onTouchEnd={handleGalleryTouchEnd}
            onMouseDown={handleGalleryMouseDown}
            onMouseUp={handleGalleryMouseUp}
            onMouseLeave={handleGalleryMouseLeave}
            style={{ cursor: hasMultipleImages ? 'grab' : 'default', userSelect: 'none' }}
          >
            <img 
              src={galleryImages[galleryIndex]} 
              alt={`${p.name} view ${galleryIndex + 1}`} 
              draggable="false" 
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>

          <div className="product-gallery-thumbs" aria-label="Product image thumbnails">
            {galleryImages.map((image, index) => (
              <button key={`${image}-${index}`} className={`gallery-thumb${galleryIndex === index ? ' active' : ''}`} onClick={() => selectGalleryImage(index)} aria-label={`Show product image ${index + 1}`} aria-current={galleryIndex === index}>
                <img src={image} alt="" />
              </button>
            ))}
          </div>

          <div className="detail-btns">
            <button className="btn-cart" onClick={handleAddToCart}>🛒 ADD TO CART</button>
            <button className="btn-buy" onClick={handleBuyNow}>⚡ BUY NOW</button>
          </div>
        </div>

        {/* Right: product info */}
        <div className="detail-info-col">
          <div className="detail-brand">
            {p.brand}{' '}
            <span style={{ color: '#2874f0', fontSize: '12px', fontWeight: '700' }}>★ Verified Seller</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1>{p.name}</h1>
            <div
              onClick={handleWishlist}
              style={{ fontSize: '28px', cursor: 'pointer', color: isWishlisted ? '#ef4444' : '#9ca3af' }}
              title="Wishlist"
            >
              {isWishlisted ? '❤️' : '🤍'}
            </div>
          </div>

          <div className="detail-rating-bar">
            <span className="stars" style={{ background: '#388e3c', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
              {p.rating} ★
            </span>
            <span style={{ fontSize: '13px', color: '#777' }}>
              {formatNumber(Array.isArray(p.reviews) ? p.reviews.length : (p.reviews || 0))} Ratings &amp; Reviews
            </span>
          </div>

          <div className="detail-price-section">
            <span className="detail-price">₹{formatNumber(p.price)}</span>
            <span className="detail-mrp">₹{formatNumber(p.mrp)}</span>
            <span className="detail-disc">{p.discount}% off</span>
          </div>

          <div style={{ background: '#f1f8e9', padding: '12px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
            <b style={{ color: '#388e3c' }}>Available Offers</b><br />
            <div style={{ marginTop: '6px', color: '#555' }}>🏷 10% instant discount on HDFC Credit Card</div>
            <div style={{ marginTop: '4px', color: '#555' }}>🏷 Get ₹200 off on orders above ₹1999. Use: SAVE200</div>
            <div style={{ marginTop: '4px', color: '#555' }}>🏷 No Cost EMI on select Credit Cards</div>
          </div>

          <div className="detail-features">
            <h3>Highlights</h3>
            <ul>
              <li>{p.desc}</li>
              <li>Stock: {p.stock} units available</li>
              <li>Category: {p.category}</li>
            </ul>
          </div>

          <div style={{ marginTop: '16px', fontSize: '12px', color: '#777', display: 'flex', gap: '16px' }}>
            <span>🚚 Free Delivery</span>
            <span>↩ 7 Day Return</span>
            <span>✓ Top Brand</span>
            <span>🛡 1 Year Warranty</span>
          </div>

          {/* ── Reviews ── */}
          <div style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
            <h3>Customer Reviews</h3>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayReviews.map((r, i) => (
                <div key={i} style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>{r.user}</strong>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(r.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '14px', marginBottom: '6px' }}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                  <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5 }}>{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Write a review ── */}
          {state.userAuthenticated && (
            <form
              onSubmit={handleSubmitReview}
              style={{ marginTop: '24px', background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' }}
            >
              <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>Write a Review</h4>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', marginRight: '10px' }}>Rating:</label>
                <select
                  value={reviewRating}
                  onChange={e => setReviewRating(Number(e.target.value))}
                  style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '13px', fontFamily: 'Inter', outline: 'none', marginBottom: '10px' }}
              />
              <button
                type="submit"
                disabled={submittingReview}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ══ EXPLORE MORE — 3-tab section ══════════════════════════════════════ */}
      <div className="explore-more-section">

        <div className="explore-more-header">
          <h3 className="explore-more-title">Explore More</h3>
          <div className="explore-tabs">
            <button
              className={`explore-tab${exploreTab === 'brand' ? ' active' : ''}`}
              onClick={() => setExploreTab('brand')}
            >
              {p.brand} Products
              {sameBrandProducts.length > 0 && (
                <span className="explore-tab-count">{sameBrandProducts.length}</span>
              )}
            </button>
            <button
              className={`explore-tab${exploreTab === 'category' ? ' active' : ''}`}
              onClick={() => setExploreTab('category')}
            >
              More {p.category}
              {sameCategoryProducts.length > 0 && (
                <span className="explore-tab-count">{sameCategoryProducts.length}</span>
              )}
            </button>
            <button
              className={`explore-tab${exploreTab === 'accessories' ? ' active' : ''}`}
              onClick={() => setExploreTab('accessories')}
            >
              Accessories &amp; Add-ons
              {accessories.length > 0 && (
                <span className="explore-tab-count">{accessories.length}</span>
              )}
            </button>
          </div>
        </div>

        {tabItems.length > 0 ? (
          <div className="explore-grid">
            {tabItems.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="explore-empty">
            <span>😕</span>
            <p>
              No{' '}
              {exploreTab === 'brand'
                ? `other ${p.brand}`
                : exploreTab === 'category'
                ? p.category
                : 'accessory'}{' '}
              products found.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
