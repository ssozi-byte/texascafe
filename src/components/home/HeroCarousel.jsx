import { useEffect, useState } from 'react';

export function HeroCarousel({ slides, whatsappHref }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide] || slides[0];

  return (
    <section className="hero-section">
      <div className="hero-carousel" aria-label="Featured promotions">
        <div
          className="hero-slide"
          style={{ backgroundImage: `linear-gradient(rgba(17,17,17,0.35),rgba(17,17,17,0.55)),url(${current.image})` }}
        >
          <div className="container hero-content">
            <span className="eyebrow">Ndenderu, Kiambu</span>
            <h1>{current.title}</h1>
            <p>{current.subtitle}</p>
            <div className="cta-row">
              <a
                href="#menu-section"
                className="button button-primary"
                aria-label="Explore Menu"
                onClick={(e) => { e.preventDefault(); document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Explore Menu
              </a>
              <a href={whatsappHref} className="button button-secondary hero-wa-btn" target="_blank" rel="noreferrer">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="hero-controls" aria-label="Hero slide controls">
          <button type="button" aria-label="Previous slide"
            onClick={() => setActiveSlide((c) => (c - 1 + slides.length) % slides.length)}>←</button>
          <div className="hero-dots" aria-label="Slide indicators">
            {slides.map((slide, index) => (
              <button key={slide.title} type="button"
                className={index === activeSlide ? 'dot active' : 'dot'}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setActiveSlide(index)} />
            ))}
          </div>
          <button type="button" aria-label="Next slide"
            onClick={() => setActiveSlide((c) => (c + 1) % slides.length)}>→</button>
        </div>
      </div>
    </section>
  );
}
