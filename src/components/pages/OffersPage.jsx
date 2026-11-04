import { OfferCard } from '../ui/OfferCard';
import { SectionHeader } from '../ui/SectionHeader';

export function OffersPage({ data }) {
  return (
    <section className="page-shell container">
      <SectionHeader eyebrow="Offers" title="Current specials and value deals." dark as="h1" />
      <div className="offers-grid full-offers">
        {data.offers.map((offer) => (
          <OfferCard key={offer.title} offer={offer} />
        ))}
      </div>
    </section>
  );
}
