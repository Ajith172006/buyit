'use client';
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';

const demoVideos = [
  {
    id: 'vid-1',
    title: 'iPhone 15 Pro Max Titanium Camera Test 📸',
    brand: 'Apple',
    productId: '65d1a2b3c4d5e6f7a8b9c001',
    productName: 'Apple iPhone 15 Pro Max 256GB',
    price: 134900,
    likes: '14.2k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-with-green-screen-41544-large.mp4',
    poster: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    tags: ['#iPhone15Pro', '#Apple', '#Unboxing'],
  },
  {
    id: 'vid-2',
    title: 'Samsung 65" 4K QLED Smart TV Cinematic View 🍿',
    brand: 'Samsung',
    productId: '65d1a2b3c4d5e6f7a8b9c002',
    productName: 'Samsung 65" 4K QLED Smart TV',
    price: 64999,
    likes: '8.7k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-television-screen-43097-large.mp4',
    poster: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80',
    tags: ['#Samsung4K', '#SmartTV', '#HomeTheater'],
  },
  {
    id: 'vid-3',
    title: 'Sony WH-1000XM5 Active Noise Cancelling Experience 🎧',
    brand: 'Sony',
    productId: '65d1a2b3c4d5e6f7a8b9c003',
    productName: 'Sony WH-1000XM5 Headphones',
    price: 24990,
    likes: '19.4k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-listening-to-music-with-headphones-41480-large.mp4',
    poster: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
    tags: ['#SonyXM5', '#NoiseCancelling', '#AudioGrade'],
  },
  {
    id: 'vid-4',
    title: 'Nike Air Max 270 Comfort & Running Performance 👟',
    brand: 'Nike',
    productId: '65d1a2b3c4d5e6f7a8b9c004',
    productName: 'Nike Air Max 270 Running Shoes',
    price: 7495,
    likes: '23.1k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-tying-his-running-shoes-before-jogging-42407-large.mp4',
    poster: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    tags: ['#NikeAirMax', '#SneakerHead', '#RunningGear'],
  },
  {
    id: 'vid-5',
    title: 'MacBook Air M3 Liquid Retina Display & Speed 💻',
    brand: 'Apple',
    productId: '65d1a2b3c4d5e6f7a8b9c005',
    productName: 'MacBook Air M3 13-inch 8GB 256GB',
    price: 114900,
    likes: '31.8k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-42886-large.mp4',
    poster: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    tags: ['#MacBookAirM3', '#AppleSilicon', '#CreatorLaptop'],
  },
  {
    id: 'vid-6',
    title: 'OnePlus 12R 5G 100W SUPERVOOC Charge Test 📲',
    brand: 'OnePlus',
    productId: '65d1a2b3c4d5e6f7a8b9c010',
    productName: 'OnePlus 12R 5G 256GB',
    price: 39999,
    likes: '16.5k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-game-41548-large.mp4',
    poster: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    tags: ['#OnePlus12R', '#100WCharging', '#FlagshipKiller'],
  },
  {
    id: 'vid-7',
    title: 'Instant Pot Duo 7-in-1 Smart Cooking Demo 🍲',
    brand: 'Instant Pot',
    productId: '65d1a2b3c4d5e6f7a8b9c014',
    productName: 'Instant Pot Duo 7-in-1 5.7L',
    price: 8499,
    likes: '9.3k',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-preparing-food-in-a-kitchen-42790-large.mp4',
    poster: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    tags: ['#InstantPot', '#SmartKitchen', '#ChefMode'],
  },
];

export default function VideoModal() {
  const { state, dispatch, showToast } = useStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [isDebounced, setIsDebounced] = useState(false);

  if (!state.videoModalOpen) return null;

  const activeVideo = demoVideos[currentIdx];

  const triggerDebouncedScroll = (action) => {
    if (isDebounced) return;
    setIsDebounced(true);
    action();
    setTimeout(() => setIsDebounced(false), 400);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % demoVideos.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + demoVideos.length) % demoVideos.length);
  };

  const handleWheel = (e) => {
    if (e.deltaY > 25) {
      triggerDebouncedScroll(handleNext);
    } else if (e.deltaY < -25) {
      triggerDebouncedScroll(handlePrev);
    }
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    if (diff > 40) {
      triggerDebouncedScroll(handleNext);
    } else if (diff < -40) {
      triggerDebouncedScroll(handlePrev);
    }
    setTouchStart(null);
  };

  const toggleLike = (vidId) => {
    setLiked((prev) => ({ ...prev, [vidId]: !prev[vidId] }));
    if (!liked[vidId]) {
      showToast('Liked video! ❤️');
    }
  };

  const handleViewProduct = () => {
    dispatch({ type: 'CLOSE_VIDEO_MODAL' });
    dispatch({ type: 'SHOW_DETAIL', id: activeVideo.productId });
  };

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 3500,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
            <span style={{ fontSize: '20px' }}>🎬</span>
            <span style={{ fontWeight: 800, fontSize: '15px', fontStyle: 'italic', letterSpacing: '-0.3px' }}>
              BuyIt <span style={{ color: '#ffe500' }}>Reels ✦</span>
            </span>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLOSE_VIDEO_MODAL' })}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div style={{ position: 'relative', flex: 1, backgroundColor: '#000' }}>
          <video
            key={activeVideo.id}
            src={activeVideo.videoUrl}
            poster={activeVideo.poster}
            controls
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />

          {/* Side Overlay Actions */}
          <div
            style={{
              position: 'absolute',
              right: '16px',
              bottom: '100px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              zIndex: 10,
            }}
          >
            {/* Like button */}
            <button
              onClick={() => toggleLike(activeVideo.id)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: liked[activeVideo.id] ? '#ef4444' : '#fff',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              {liked[activeVideo.id] ? '❤️' : '🤍'}
            </button>
            <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, marginTop: '-14px' }}>
              {activeVideo.likes}
            </span>

            {/* Share button */}
            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(window.location.href);
                showToast('Link copied to clipboard! 📋');
              }}
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#fff',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              🔗
            </button>

            {/* Prev Video */}
            <button
              onClick={handlePrev}
              title="Previous Reel"
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ▲
            </button>

            {/* Next Video */}
            <button
              onClick={handleNext}
              title="Next Reel"
              style={{
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ▼
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '20px 16px',
              background: 'linear-gradient(0deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 70%, transparent 100%)',
              color: '#fff',
              zIndex: 9,
            }}
          >
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {activeVideo.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', lineHeight: 1.3 }}>
              {activeVideo.title}
            </h3>

            {/* Product Card Tag */}
            <div
              onClick={handleViewProduct}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.25)',
                cursor: 'pointer',
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, textTransform: 'uppercase' }}>
                  Featured Product
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                  {activeVideo.productName}
                </div>
                <div style={{ fontSize: '12px', color: '#fde68a', fontWeight: 800 }}>
                  ₹{activeVideo.price.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                style={{
                  backgroundColor: '#2874f0',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Buy Now 🛍️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
