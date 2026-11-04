export function OfferCard({ offer }) {
  return (
    <article className="offer-card">
      <span className="offer-tag">Offer</span>
      <h3>{offer.title}</h3>
      <p>{offer.description}</p>
      <small>{offer.valid}</small>
    </article>
  );
}
