// Story page highlighting the café’s atmosphere, customer promise and local neighbourhood identity.
export function AboutPage({ data }) {
  return (
    <section className="page-shell container page-copy">
      <span className="eyebrow eyebrow-dark">About</span>
      <h1>Neighbourhood warmth, flavour and everyday ease.</h1>
      <p>{data.business.description}</p>
      <p>We’re designed for quick coffee runs, family meals, casual catch-ups and the comforting rhythm of a neighbourhood restaurant where good food is always close at hand.</p>
      <div className="info-grid">
        <div className="info-panel">
          <h3>Our focus</h3>
          <p>Friendly service, generous portions and menu items made for daily cravings.</p>
        </div>
        <div className="info-panel">
          <h3>Location</h3>
          <p>Next to Magunas, Ndenderu, with easy access for local residents and nearby communities.</p>
        </div>
        <div className="info-panel">
          <h3>Opening hours</h3>
          <p>Open daily from 8:00 AM to 11:00 PM.</p>
        </div>
      </div>
    </section>
  );
}
