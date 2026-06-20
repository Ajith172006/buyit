'use client';
import { useStore } from '@/context/StoreContext';
import { categories } from '@/lib/data';

const catImages = {
  'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&auto=format&fit=crop&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=120&auto=format&fit=crop&q=80',
  "Men's Fashion": 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=120&auto=format&fit=crop&q=80',
  "Women's Fashion": 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&auto=format&fit=crop&q=80',
  'Mobiles': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&auto=format&fit=crop&q=80',
  'Appliances': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=120&auto=format&fit=crop&q=80',
  'Furniture': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=120&auto=format&fit=crop&q=80',
  'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=120&auto=format&fit=crop&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=120&auto=format&fit=crop&q=80',
  'Toys': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=120&auto=format&fit=crop&q=80',
  'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&auto=format&fit=crop&q=80',
  'all': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=120&auto=format&fit=crop&q=80'
};

export default function CategoryNav() {
  const { state, dispatch } = useStore();

  return (
    <div id="catnav">
      <div className="catnav-inner-container">
        <div
          className={`cat-tab${state.activeCategory === 'all' ? ' active' : ''}`}
          onClick={() => dispatch({ type: 'SET_CATEGORY', category: 'all' })}
        >
          <div className="cat-img-wrapper">
            <img src={catImages['all']} alt="For You" className="cat-img" />
          </div>
          <div className="cat-text">For You</div>
        </div>
        {categories.map(cat => (
          <div
            key={cat}
            className={`cat-tab${state.activeCategory === cat ? ' active' : ''}`}
            onClick={() => dispatch({ type: 'SET_CATEGORY', category: cat })}
          >
            <div className="cat-img-wrapper">
              <img src={catImages[cat] || catImages['all']} alt={cat} className="cat-img" />
            </div>
            <div className="cat-text">{cat}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
