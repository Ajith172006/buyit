'use client';
import { useStore } from '@/context/StoreContext';
import { categories } from '@/lib/data';

const catIcons = {
  'Fashion': '👕',
  'Mobiles': '📱',
  'Electronics': '💻',
  'Home': '🛋️',
  'Beauty': '💄',
  'Grocery': '🍎',
  'all': '🛍️'
};

export default function CategoryNav() {
  const { state, dispatch } = useStore();

  return (
    <div id="catnav">
      <div
        className={`cat-tab${state.activeCategory === 'all' ? ' active' : ''}`}
        onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}
      >
        <div className="cat-icon">{catIcons['all']}</div>
        <div className="cat-text">For You</div>
      </div>
      {categories.map(cat => (
        <div
          key={cat}
          className={`cat-tab${state.activeCategory === cat ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
        >
          <div className="cat-icon">{catIcons[cat] || '📦'}</div>
          <div className="cat-text">{cat}</div>
        </div>
      ))}
    </div>
  );
}
