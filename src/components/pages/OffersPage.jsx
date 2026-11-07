import { OfferCard } from '../ui/OfferCard';

export function OffersPage({ data }) {
  return (
    <div className="offers-page">
      <div className="page-hero" style={{ backgroundImage: 'linear-gradient(rgba(17,17,17,0.45),rgba(17,17,17,0.6)),url(/images/hero-slide-1.jpg)' }}>
        <div className="container page-hero-content">
          <span className="eyebrow">Special offers</span>
          <h1>Current specials and value deals.</h1>
          <p>Limited-time offers crafted to give you more for less.</p>
        </div>
      </div>
      <section className="page-shell container">
        <div className="offers-grid full-offers">
          {data.offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>
      </section>
    </div>
  );
}
