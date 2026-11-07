export function OfferCard({ offer }) {
  const orderHref = `https://wa.me/254796999547?text=Hi%2C%20I%27d%20like%20to%20claim%20this%20offer%3A%20${encodeURIComponent(offer.title)}`;

  return (
    <article className="offer-card">
      <span className="offer-tag">Offer</span>
      <h3>{offer.title}</h3>
      <p>{offer.description}</p>
      <small>{offer.valid}</small>
      <a href={orderHref} className="button button-primary offer-cta" target="_blank" rel="noreferrer">
        Claim on WhatsApp
      </a>
    </article>
  );
}
