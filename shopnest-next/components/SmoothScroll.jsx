'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Register ScrollTrigger once
    gsap.registerPlugin(ScrollTrigger);

    // ── Lenis smooth scroll config ─────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,                                    // slightly longer glide
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // expo-out — fast start, silky stop
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,                               // native touch on mobile is already smooth
      touchMultiplier: 1.8,
      wheelMultiplier: 1.1,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll position into ScrollTrigger every frame
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker for perfectly synced 60/120fps rendering
    function onFrame(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0); // prevent stutter after tab switch

    // ── Page entrance animations ───────────────────────────────────────────
    // Stagger-reveal topbar on first load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#topbar, #mobile-topbar', { y: -24, opacity: 0, duration: 0.5 }, 0);

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return <>{children}</>;
}
