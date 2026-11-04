import { OfferCard } from '../ui/OfferCard';
import { SectionHeader } from '../ui/SectionHeader';

export function OffersSnippet({ offers }) {
  return (
    <section className="offers-section">
      <div className="container">
        <SectionHeader eyebrow="Special offers" title="Great value, every day." left />
        <div className="offers-grid">
          {offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
