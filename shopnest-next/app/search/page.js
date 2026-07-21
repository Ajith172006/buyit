'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import Topbar from '@/components/Topbar';
import CartPanel from '@/components/CartPanel';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import CheckoutModal from '@/components/CheckoutModal';
import UserAuthModal from '@/components/UserAuthModal';
import UserProfileModal from '@/components/UserProfileModal';
import VideoModal from '@/components/VideoModal';
import Toast from '@/components/Toast';
import MobileNav from '@/components/MobileNav';

export default function SearchPage() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const nextQuery = new URLSearchParams(window.location.search).get('q') || '';
    setQuery(nextQuery);
    dispatch({ type: 'SET_SEARCH', search: nextQuery });
  }, [dispatch]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return state.products.filter((product) =>
      [product.name, product.brand, product.category, product.desc]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [query, state.products]);

  return (
    <>
      <Topbar />
      <main className="search-results-page">
        <div className="search-results-heading">
          <button className="search-back" onClick={() => window.history.back()}>← Back</button>
          <div>
            <p>Search results</p>
            <h1>{query ? `“${query}”` : 'Search products'}</h1>
          </div>
          <span>{results.length} {results.length === 1 ? 'product' : 'products'}</span>
        </div>
        {results.length > 0 ? (
          <div id="product-grid" className="search-results-grid">
            {results.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="search-empty">
            <span>🔎</span>
            <h2>No products found</h2>
            <p>Try a product name, brand, or category.</p>
          </div>
        )}
      </main>
      <CartPanel />
      <CheckoutModal />
      <ProductDetail />
      <UserAuthModal />
      <UserProfileModal />
      <VideoModal />
      <Toast />
      <MobileNav />
    </>
  );
}
