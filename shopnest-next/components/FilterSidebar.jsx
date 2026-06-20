'use client';
import { useStore } from '@/context/StoreContext';

export default function FilterSidebar() {
  const { state, dispatch } = useStore();

  const brands = [...new Set(state.products.map(p => p.brand).filter(Boolean))];

  if (!state.filtersOpen) return null;

  return (
    <div id="filters" className="open">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Filters</h3>
        <button 
          onClick={() => dispatch({ type: 'CLEAR_FILTERS' })}
          style={{ background: 'none', border: 'none', color: '#007AFF', cursor: 'pointer', fontSize: '13px' }}
        >
          Clear All
        </button>
      </div>

      {brands.length > 0 && (
        <div className="filter-section">
          <h4>Brand</h4>
          {brands.slice(0, 8).map(brand => (
            <label key={brand} className="filter-check">
              <input 
                type="checkbox" 
                checked={state.selectedBrands.includes(brand)}
                onChange={() => dispatch({ type: 'TOGGLE_BRAND', brand })}
              />
              {brand}
            </label>
          ))}
        </div>
      )}

      <div className="filter-section">
        <h4>Price Range</h4>
        <label className="filter-check">
          <input type="radio" name="price" checked={state.priceMin === 0 && state.priceMax === 500} onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 0, max: 500 })} />
          Under ₹500
        </label>
        <label className="filter-check">
          <input type="radio" name="price" checked={state.priceMin === 500 && state.priceMax === 2000} onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 500, max: 2000 })} />
          ₹500 – ₹2,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" checked={state.priceMin === 2000 && state.priceMax === 10000} onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 2000, max: 10000 })} />
          ₹2,000 – ₹10,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" checked={state.priceMin === 10000 && state.priceMax === 999999} onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 10000, max: 999999 })} />
          Above ₹10,000
        </label>
        <label className="filter-check">
          <input type="radio" name="price" checked={state.priceMin === 0 && state.priceMax === 999999} onChange={() => dispatch({ type: 'SET_PRICE_FILTER', min: 0, max: 999999 })} />
          All Prices
        </label>
      </div>

      <div className="filter-section">
        <h4>Rating</h4>
        <label className="filter-check">
          <input type="radio" name="rating" checked={state.minRating === 4} onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 4 })} />
          ★ 4 &amp; above
        </label>
        <label className="filter-check">
          <input type="radio" name="rating" checked={state.minRating === 3} onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 3 })} />
          ★ 3 &amp; above
        </label>
        <label className="filter-check">
          <input type="radio" name="rating" checked={state.minRating === 0} onChange={() => dispatch({ type: 'SET_RATING_FILTER', rating: 0 })} />
          All Ratings
        </label>
      </div>

      <div className="filter-section">
        <h4>Discount</h4>
        <label className="filter-check">
          <input type="radio" name="disc" checked={state.minDiscount === 50} onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 50 })} />
          50% or more
        </label>
        <label className="filter-check">
          <input type="radio" name="disc" checked={state.minDiscount === 30} onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 30 })} />
          30% or more
        </label>
        <label className="filter-check">
          <input type="radio" name="disc" checked={state.minDiscount === 0} onChange={() => dispatch({ type: 'SET_DISCOUNT_FILTER', discount: 0 })} />
          All
        </label>
      </div>
    </div>
  );
}
