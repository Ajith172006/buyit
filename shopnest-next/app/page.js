'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useStore } from '@/context/StoreContext';

import Topbar from '@/components/Topbar';
import CategoryNav from '@/components/CategoryNav';
import HeroBanner from '@/components/HeroBanner';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import CartPanel from '@/components/CartPanel';
import CheckoutModal from '@/components/CheckoutModal';
import ProductDetail from '@/components/ProductDetail';
import AdminPanel from '@/components/admin/AdminPanel';
import AdminLoginModal from '@/components/admin/AdminLoginModal';
import UserAuthModal from '@/components/UserAuthModal';
import UserProfileModal from '@/components/UserProfileModal';
import Toast from '@/components/Toast';
import MobileNav from '@/components/MobileNav';
import HorizontalProducts from '@/components/HorizontalProducts';
import OfferStrip from '@/components/OfferStrip';
import VideoModal from '@/components/VideoModal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HomePage() {
  const container = useRef();
  const { state } = useStore();

  // Refresh ScrollTrigger when products/filters change so positions stay accurate
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(id);
  }, [state.products, state.activeCategory, state.activeSearch, state.selectedBrands]);

  useGSAP(() => {
    // ── Page entrance animations ───────────────────────────────────────────
    gsap.from('#catnav', {
      y: -16,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.out'
    });

    gsap.from('.cat-tab', {
      opacity: 0,
      y: 14,
      scale: 0.92,
      duration: 0.4,
      ease: 'back.out(1.4)',
      stagger: 0.04,
      delay: 0.08,
    });

    gsap.from('#offers', {
      y: -10,
      opacity: 0,
      duration: 0.4,
      ease: 'power3.out'
    });

    gsap.from('.offer-chip', {
      opacity: 0,
      x: -20,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.05,
      delay: 0.12,
    });

    gsap.from('#hero', {
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      delay: 0.18
    });

    // ── Hero parallax ──────────────────────────────────────────────────────
    gsap.to('#hero', {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,           // scrub:1 = 1s lag — silkier than scrub:true
      },
    });

    gsap.to('.deal-card', {
      y: 70,
      opacity: 0,
      scale: 0.92,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });

    // ── Content section entrance ───────────────────────────────────────────
    gsap.from('#product-grid', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#product-grid',
        start: 'top 98%',
        toggleActions: 'play none none none',
      },
    });

    if (typeof document !== 'undefined' && document.querySelector('#filters')) {
      gsap.from('#filters', {
        x: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#content',
          start: 'top 98%',
          toggleActions: 'play none none none',
        },
      });
    }

  }, { scope: container });

  return (
    <div ref={container}>
      <Topbar />
      <CategoryNav />
      <OfferStrip />
      <HeroBanner />
      <HorizontalProducts />
      <div id="content">
        <FilterSidebar />
        <ProductGrid />
      </div>
      <CartPanel />
      <CheckoutModal />
      <ProductDetail />
      <AdminPanel />
      <AdminLoginModal />
      <UserAuthModal />
      <UserProfileModal />
      <VideoModal />
      <Toast />
      <MobileNav />
    </div>
  );
}
