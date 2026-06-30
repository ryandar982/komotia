import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PromoBanner.css';

// Semua gambar iklan dari folder images/iklan/
const allAds = [
  { id: 1, src: '/asset/images/iklan/1.jpg', alt: 'Promo Komotia 1' },
  { id: 2, src: '/asset/images/iklan/2.jpg', alt: 'Promo Komotia 2' },
  { id: 3, src: '/asset/images/iklan/3.jpg', alt: 'Promo Komotia 3' },
  { id: 4, src: '/asset/images/iklan/4.jpg', alt: 'Promo Komotia 4' },
  { id: 5, src: '/asset/images/iklan/5.jpg', alt: 'Promo Komotia 5' },
];

// Bagi jadi slide-slide: 1 banner besar + 2 banner kecil per slide
function buildSlides(ads) {
  const slides = [];
  let i = 0;
  while (i < ads.length) {
    const main = ads[i];
    const sub1 = ads[(i + 1) % ads.length];
    const sub2 = ads[(i + 2) % ads.length];
    slides.push({ main, subs: [sub1, sub2] });
    i += 1; // Setiap slide geser 1 supaya variasi lebih banyak
  }
  return slides;
}

export default function PromoBanner() {
  const slides = buildSlides(allAds);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState('next');
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalSlides = slides.length;

  // Auto-slide
  const startAutoSlide = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      goNext();
    }, 5000);
  }, [totalSlides]);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [startAutoSlide]);

  const goNext = () => {
    setDirection('next');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
      setIsTransitioning(false);
    }, 300);
    startAutoSlide();
  };

  const goPrev = () => {
    setDirection('prev');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
      setIsTransitioning(false);
    }, 300);
    startAutoSlide();
  };

  const goTo = (index) => {
    if (index === current) return;
    setDirection(index > current ? 'next' : 'prev');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setIsTransitioning(false);
    }, 300);
    startAutoSlide();
  };

  // Touch / Swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  const slide = slides[current];

  return (
    <section className="promo-banner-section">
      <div className="promo-banner-container">
        {/* Header */}
        <div className="promo-banner-header">
          <div className="promo-header-left">
            <h2>Promo & Penawaran</h2>
          </div>
          <div className="promo-header-right">
            <span className="promo-counter">{current + 1} / {totalSlides}</span>
            <button className="promo-nav-btn" onClick={goPrev} aria-label="Sebelumnya">
              <ChevronLeft size={20} />
            </button>
            <button className="promo-nav-btn" onClick={goNext} aria-label="Selanjutnya">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Banner Content */}
        <div
          className={`promo-banner-content ${isTransitioning ? `slide-out-${direction}` : 'slide-in'}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Banner Besar */}
          <div className="promo-main-banner">
            <img src={slide.main.src} alt={slide.main.alt} loading="lazy" />
            <div className="promo-banner-overlay">
              <span className="promo-badge">Promo</span>
            </div>
          </div>

          {/* 2 Banner Kecil */}
          <div className="promo-sub-banners">
            {slide.subs.map((sub, idx) => (
              <div className="promo-sub-banner" key={`${current}-${idx}`}>
                <img src={sub.src} alt={sub.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="promo-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`promo-dot ${idx === current ? 'active' : ''}`}
              onClick={() => goTo(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
