export function VisitBlock({ business }) {
  return (
    <section className="visit-section">
      <div className="container visit-grid">
        <div className="visit-copy">
          <span className="eyebrow">Visit us</span>
          <h2>Find your next favourite spot.</h2>
          <p>{business.address}</p>
          <ul className="info-list">
            <li><strong>Opening hours:</strong> {business.hours}</li>
            <li><strong>Telephone:</strong> <a href={business.phoneHref}>{business.phone}</a></li>
            <li>
              <strong>WhatsApp:</strong>{' '}
              <a href={business.whatsappHref} target="_blank" rel="noreferrer">Chat with us</a>
            </li>
          </ul>
          <a
            className="button button-primary"
            href="https://maps.google.com/?q=Next+to+Magunas+Ndenderu+Kiambu+Kenya"
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
        </div>
        <div className="map-card" aria-label="Map location">
          <iframe
            title="Kim's Texas Caffe location"
            src="https://www.google.com/maps?q=Ndenderu%20Kiambu%20Kenya&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
