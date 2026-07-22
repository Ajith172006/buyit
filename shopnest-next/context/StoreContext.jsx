'use client';

import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { initialProducts } from '@/lib/data';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebaseClient';

const StoreContext = createContext(null);

const initialState = {
  products: initialProducts,
  cart: [],
  orders: [], // User's own orders
  adminOrders: [], // All orders for admin
  wishlist: [],
  // UI state
  activeCategory: 'all',
  activeSearch: '',
  priceMin: 0,
  priceMax: 999999,
  minRating: 0,
  minDiscount: 0,
  sortMode: 'default',
  selectedBrands: [],
  // Panels
  cartOpen: false,
  checkoutOpen: false,
  filtersOpen: false,
  detailProductId: null,
  adminOpen: false,
  adminAuthenticated: false,
  adminLoginOpen: false,
  toast: '',
  userAuthenticated: false,
  userLoginOpen: false,
  userProfileOpen: false,
  userProfile: null,
  authLoading: true,
  videoModalOpen: false,
  orderConfirmationOpen: false,
  lastOrder: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(c => c.id === action.id);
      return {
        ...state,
        cart: existing
          ? state.cart.map(c => c.id === action.id ? { ...c, qty: c.qty + 1 } : c)
          : [...state.cart, { ...state.products.find(p => p.id === action.id), qty: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(c => c.id !== action.id) };
    case 'CHANGE_QTY': {
      const updated = state.cart.map(c =>
        c.id === action.id ? { ...c, qty: c.qty + action.delta } : c
      ).filter(c => c.qty > 0);
      return { ...state, cart: updated };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'PLACE_ORDER':
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
        checkoutOpen: false,
        cartOpen: false,
        orderConfirmationOpen: true,
        lastOrder: action.order,
      };
    case 'CLOSE_ORDER_CONFIRMATION':
      return { ...state, orderConfirmationOpen: false, lastOrder: null };
    case 'SET_PRODUCTS':
      return { ...state, products: action.products };
    case 'SET_ADMIN_ORDERS':
      return { ...state, adminOrders: action.orders };
    case 'TOGGLE_BRAND': {
      const updatedBrands = state.selectedBrands.includes(action.brand)
        ? state.selectedBrands.filter(b => b !== action.brand)
        : [...state.selectedBrands, action.brand];
      return { ...state, selectedBrands: updatedBrands };
    }
    case 'TOGGLE_FILTERS':
      return { ...state, filtersOpen: !state.filtersOpen };
    case 'CLEAR_FILTERS':
      return {
        ...state,
        activeCategory: 'all',
        activeSearch: '',
        priceMin: 0,
        priceMax: 999999,
        minRating: 0,
        minDiscount: 0,
        sortMode: 'default',
        selectedBrands: [],
      };
    case 'SET_CATEGORY':
      return { ...state, activeCategory: action.category };
    case 'SET_SEARCH':
      return { ...state, activeSearch: action.search };
    case 'SET_PRICE_FILTER':
      return { ...state, priceMin: action.min, priceMax: action.max };
    case 'SET_RATING_FILTER':
      return { ...state, minRating: action.rating };
    case 'SET_DISCOUNT_FILTER':
      return { ...state, minDiscount: action.discount };
    case 'SET_SORT':
      return { ...state, sortMode: action.mode };
    case 'CLOSE_FILTERS':
      return { ...state, filtersOpen: false };
    case 'TOGGLE_CART':
      return { ...state, cartOpen: !state.cartOpen };
    case 'CLOSE_CART':
      return { ...state, cartOpen: false };
    case 'OPEN_CHECKOUT':
      return { ...state, checkoutOpen: true };
    case 'CLOSE_CHECKOUT':
      return { ...state, checkoutOpen: false };
    case 'SHOW_DETAIL':
      return { ...state, detailProductId: action.id };
    case 'HIDE_DETAIL':
      return { ...state, detailProductId: null };
    case 'SHOW_ADMIN':
      // Only open if already authenticated, otherwise open login modal
      return state.adminAuthenticated
        ? { ...state, adminOpen: true }
        : { ...state, adminLoginOpen: true };
    case 'CLOSE_ADMIN':
      return { ...state, adminOpen: false };
    case 'OPEN_ADMIN_LOGIN':
      return { ...state, adminLoginOpen: true };
    case 'CLOSE_ADMIN_LOGIN':
      return { ...state, adminLoginOpen: false };
    case 'ADMIN_AUTH_SUCCESS':
      return { ...state, adminAuthenticated: true, adminLoginOpen: false, adminOpen: true };
    case 'ADMIN_LOGOUT':
      return { ...state, adminAuthenticated: false, adminOpen: false };
    case 'SHOW_TOAST':
      return { ...state, toast: action.message };
    case 'HIDE_TOAST':
      return { ...state, toast: '' };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.product] };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o => o.id === action.id ? { ...o, status: action.status } : o),
        adminOrders: state.adminOrders.map(o => o.id === action.id ? { ...o, status: action.status } : o),
      };
    case 'OPEN_USER_LOGIN':
      return { ...state, userLoginOpen: true };
    case 'CLOSE_USER_LOGIN':
      return { ...state, userLoginOpen: false };
    case 'USER_LOGIN_SUCCESS':
      return { ...state, userAuthenticated: true, userLoginOpen: false };
    case 'USER_LOGOUT':
      if (typeof window !== 'undefined') {
        localStorage.removeItem('buyit_user_session');
      }
      return { ...state, userAuthenticated: false, userProfile: null, wishlist: [] };
    case 'UPDATE_USER_PROFILE':
      return { ...state, userProfile: action.profile, wishlist: action.profile?.wishlist || state.wishlist };
    case 'HYDRATE_USER':
      return { ...state, userAuthenticated: true, userProfile: action.profile, wishlist: action.profile?.wishlist || [] };
    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.includes(action.id);
      return {
        ...state,
        wishlist: exists ? state.wishlist.filter(id => id !== action.id) : [...state.wishlist, action.id]
      };
    }
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.loading };
    case 'OPEN_USER_PROFILE':
      return { ...state, userProfileOpen: true };
    case 'CLOSE_USER_PROFILE':
      return { ...state, userProfileOpen: false };
    case 'OPEN_VIDEO_MODAL':
      return { ...state, videoModalOpen: true };
    case 'CLOSE_VIDEO_MODAL':
      return { ...state, videoModalOpen: false };
    case 'TOGGLE_VIDEO_MODAL':
      return { ...state, videoModalOpen: !state.videoModalOpen };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Firebase auth state listener hydrates the session on load and clears on sign-out.
  useEffect(() => {
    // Check if we have a locally stored demo/guest session first
    const localProfileStr = typeof window !== 'undefined' ? localStorage.getItem('buyit_user_session') : null;
    let localProfile = null;
    if (localProfileStr) {
      try {
        localProfile = JSON.parse(localProfileStr);
        if (localProfile && localProfile.email) {
          dispatch({ type: 'HYDRATE_USER', profile: localProfile });
        }
      } catch (e) {
        console.error('Error parsing local user profile:', e);
      }
    }

    if (!firebaseAuth) {
      if (!localProfile) dispatch({ type: 'USER_LOGOUT' });
      dispatch({ type: 'SET_AUTH_LOADING', loading: false });
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      dispatch({ type: 'SET_AUTH_LOADING', loading: true });
      if (user?.email) {
        try {
          const res = await fetch(`/api/user?email=${encodeURIComponent(user.email)}`);
          
          if (!res.ok) {
            dispatch({ type: 'OPEN_USER_LOGIN' });
            dispatch({ type: 'SET_AUTH_LOADING', loading: false });
            return;
          }

          const data = await res.json();
          if (data.success && data.data) {
            const p = data.data;
            if (p.phone && p.address) {
              if (typeof window !== 'undefined') {
                localStorage.setItem('buyit_user_session', JSON.stringify(p));
              }
              dispatch({ type: 'HYDRATE_USER', profile: p });
            } else {
              dispatch({ type: 'OPEN_USER_LOGIN' });
            }
          } else {
            dispatch({ type: 'OPEN_USER_LOGIN' });
          }
        } catch (e) {
          console.error('Error fetching user profile:', e);
          dispatch({ type: 'OPEN_USER_LOGIN' });
        }
      } else {
        // Keep the intentionally local demo profile; otherwise clear the account state.
        if (!localProfile) {
          dispatch({ type: 'USER_LOGOUT' });
          if (typeof window !== 'undefined') {
            localStorage.removeItem('buyit_user_session');
          }
        }
      }
      dispatch({ type: 'SET_AUTH_LOADING', loading: false });
    });
    return unsubscribe;
  }, []);

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const mappedProducts = json.data.map(p => ({
              ...p,
              id: p._id,
              name: p.name,
              brand: p.brand || 'Generic',
              category: p.category,
              price: p.price,
              mrp: p.originalPrice || p.price,
              rating: p.rating,
              reviews: Array.isArray(p.reviews) ? p.reviews : [],
              stock: p.stock,
              discount: p.discount,
              desc: p.description,
              image: p.image,
              images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image]
            }));
            dispatch({ type: 'SET_PRODUCTS', products: mappedProducts });
          }
        } else {
          console.warn('Failed to fetch products from backend, falling back to static data.');
        }
      } catch (err) {
        console.warn('Backend server is offline. Using static/local products instead.', err.message);
      }
    }
    fetchProducts();
  }, []);

  // Fetch admin orders when admin is authenticated
  useEffect(() => {
    async function fetchAdminOrders() {
      if (!state.adminAuthenticated) return;
      try {
        const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'changeme-in-production';
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${adminKey}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            // Map the backend orders to the format expected by the admin panel
            const mappedOrders = json.data.map(o => ({
              id: o._id,
              customer: o.userId?.name || 'Guest',
              phone: o.userId?.phone || '',
              items: o.items.reduce((acc, i) => acc + i.quantity, 0),
              total: o.totalAmount,
              payment: o.paymentMethod || 'Online',
              date: new Date(o.createdAt).toLocaleDateString(),
              status: o.orderStatus || 'pending'
            }));
            dispatch({ type: 'SET_ADMIN_ORDERS', orders: mappedOrders });
          }
        }
      } catch (err) {
        console.warn('Error fetching admin orders (backend might be offline):', err.message);
      }
    }
    fetchAdminOrders();
  }, [state.adminAuthenticated]);

  // URL synchronization for modals (product details, user profile, and video play)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check query params on initial mount/page load
    const url = new URL(window.location.href);
    const prodId = url.searchParams.get('product');
    const showProfile = url.searchParams.get('profile') === 'true';
    const showPlay = url.searchParams.get('play') === 'true';
    if (prodId) {
      dispatch({ type: 'SHOW_DETAIL', id: prodId });
    }
    if (showProfile) {
      dispatch({ type: 'OPEN_USER_PROFILE' });
    }
    if (showPlay) {
      dispatch({ type: 'OPEN_VIDEO_MODAL' });
    }

    const handlePopState = () => {
      const currentUrl = new URL(window.location.href);
      const currentProdId = currentUrl.searchParams.get('product');
      const currentShowProfile = currentUrl.searchParams.get('profile') === 'true';
      const currentShowPlay = currentUrl.searchParams.get('play') === 'true';

      if (currentProdId) {
        dispatch({ type: 'SHOW_DETAIL', id: currentProdId });
      } else {
        dispatch({ type: 'HIDE_DETAIL' });
      }

      if (currentShowProfile) {
        dispatch({ type: 'OPEN_USER_PROFILE' });
      } else {
        dispatch({ type: 'CLOSE_USER_PROFILE' });
      }

      if (currentShowPlay) {
        dispatch({ type: 'OPEN_VIDEO_MODAL' });
      } else {
        dispatch({ type: 'CLOSE_VIDEO_MODAL' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const currentParam = url.searchParams.get('product');

    if (state.detailProductId) {
      if (currentParam !== state.detailProductId) {
        url.searchParams.set('product', state.detailProductId);
        window.history.pushState({ detailProductId: state.detailProductId }, '', url.pathname + url.search + url.hash);
      }
    } else {
      if (currentParam !== null) {
        url.searchParams.delete('product');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }
    }
  }, [state.detailProductId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const currentParam = url.searchParams.get('profile');

    if (state.userProfileOpen) {
      if (currentParam !== 'true') {
        url.searchParams.set('profile', 'true');
        window.history.pushState({ userProfileOpen: true }, '', url.pathname + url.search + url.hash);
      }
    } else {
      if (currentParam !== null) {
        url.searchParams.delete('profile');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }
    }
  }, [state.userProfileOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const currentParam = url.searchParams.get('play');

    if (state.videoModalOpen) {
      if (currentParam !== 'true') {
        url.searchParams.set('play', 'true');
        window.history.pushState({ videoModalOpen: true }, '', url.pathname + url.search + url.hash);
      }
    } else {
      if (currentParam !== null) {
        url.searchParams.delete('play');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      }
    }
  }, [state.videoModalOpen]);

  const getFiltered = useCallback(() => {
    let arr = state.products.filter(p => {
      if (state.activeCategory !== 'all' && p.category !== state.activeCategory) return false;
      if (state.activeSearch) {
        const q = state.activeSearch.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      }
      if (p.price < state.priceMin || p.price > state.priceMax) return false;
      if (p.rating < state.minRating) return false;
      if (p.discount < state.minDiscount) return false;
      if (state.selectedBrands.length > 0 && !state.selectedBrands.includes(p.brand)) return false;
      return true;
    });
    if (state.sortMode === 'price_asc') arr.sort((a, b) => a.price - b.price);
    else if (state.sortMode === 'price_desc') arr.sort((a, b) => b.price - a.price);
    else if (state.sortMode === 'rating') arr.sort((a, b) => b.rating - a.rating);
    else if (state.sortMode === 'discount') arr.sort((a, b) => b.discount - a.discount);
    return arr;
  }, [state]);

  const showToast = useCallback((msg) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
  }, []);

  const cartTotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  
  // Remove sampleOrders and use fetched adminOrders
  const allOrders = state.adminOrders;

  return (
    <StoreContext.Provider value={{ state, dispatch, getFiltered, showToast, cartTotal, cartCount, allOrders }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
