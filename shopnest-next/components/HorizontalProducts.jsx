'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function HorizontalProducts() {
  const { state, dispatch } = useStore();
  
  // Just show 4-6 products for this section as a demo
  const products = state.products.slice(0, 6);

  return (
    <div className="hp-section mobile-only">
      <div className="hp-header">
        <h2>Still looking for these?</h2>
      </div>
      <div className="hp-scroll-container">
        {products.map(p => (
          <div key={p.id} className="hp-card" onClick={() => dispatch({ type: 'SHOW_DETAIL', id: p.id })}>
            <div className="hp-img">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="hp-info">
              <div className="hp-name">{p.name}</div>
              <div className="hp-action">View Store</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
