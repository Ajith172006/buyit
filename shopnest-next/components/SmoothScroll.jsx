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
    // Stagger-reveal topbar → catnav → hero on first load
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('#topbar, #mobile-topbar', { y: -24, opacity: 0, duration: 0.5 }, 0)
      .from('#catnav',                 { y: -16, opacity: 0, duration: 0.45 }, 0.08)
      .from('#offers',                 { y: -10, opacity: 0, duration: 0.4 }, 0.13)
      .from('#hero',                   { opacity: 0, duration: 0.6 }, 0.18);


    // Category nav pills pop in
    gsap.from('.cat-tab', {
      opacity: 0,
      y: 14,
      scale: 0.92,
      duration: 0.4,
      ease: 'back.out(1.4)',
      stagger: 0.04,
      delay: 0.25,
    });

    // Offer strip chips slide in from left
    gsap.from('.offer-chip', {
      opacity: 0,
      x: -20,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.05,
      delay: 0.3,
    });

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return <>{children}</>;
}
