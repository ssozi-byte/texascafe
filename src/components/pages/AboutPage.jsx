export function AboutPage({ data }) {
  return (
    <div className="about-page">

      <div className="about-hero" style={{ backgroundImage: 'linear-gradient(rgba(17,17,17,0.5),rgba(17,17,17,0.6)),url(/images/cafe-interior-01.jpg)' }}>
        <div className="container about-hero-content">
          <span className="eyebrow">Our story</span>
          <h1>Neighbourhood warmth, flavour and everyday ease.</h1>
          <p>{data.business.description}</p>
          <a href={data.business.whatsappHref} className="button button-primary" target="_blank" rel="noreferrer">
            Order on WhatsApp
          </a>
        </div>
      </div>

      <section className="about-story container">
        <div className="about-story-copy">
          <span className="eyebrow eyebrow-dark">Who we are</span>
          <h2>More than a café — a community spot.</h2>
          <p>Kim's Texas Caffe was built for the everyday rhythm of Ndenderu. Whether you're grabbing a quick coffee before work, sitting down for a family meal or catching up with friends over a cold juice, we've got a seat and a plate for you.</p>
          <p>From early morning coffee to late-evening meals, our menu is designed to serve the everyday cravings of the local community and nearby residents in Ruaka and beyond.</p>
        </div>
        <div className="about-story-img">
          <img src="/images/cafe-interior-02.jpg" alt="Café dining area" />
        </div>
      </section>

      <section className="about-stats">
        <div className="container about-stats-grid">
          <div className="about-stat">
            <strong>8 AM</strong>
            <span>Opens every day</span>
          </div>
          <div className="about-stat">
            <strong>11 PM</strong>
            <span>Closes every night</span>
          </div>
          <div className="about-stat">
            <strong>18+</strong>
            <span>Menu items</span>
          </div>
          <div className="about-stat">
            <strong>6</strong>
            <span>Food categories</span>
          </div>
        </div>
      </section>

      <section className="about-values container">
        <div className="info-grid">
          <div className="info-panel">
            <div className="info-panel-icon">☕</div>
            <h3>Our focus</h3>
            <p>Friendly service, generous portions and menu items made for daily cravings.</p>
          </div>
          <div className="info-panel">
            <div className="info-panel-icon">📍</div>
            <h3>Location</h3>
            <p>Next to Magunas, Ndenderu — easy access for local residents and nearby communities.</p>
          </div>
          <div className="info-panel">
            <div className="info-panel-icon">🕐</div>
            <h3>Opening hours</h3>
            <p>{data.business.hours}</p>
          </div>
        </div>
      </section>

      <section className="about-img-strip">
        <img src="/images/cafe-food-spread.jpg" alt="Food spread at Kim's Texas Caffe" />
        <img src="/images/cafe-interior-03.jpg" alt="Café interior" />
        <img src="/images/mixed-grill.jpg" alt="Mixed grill platter" />
        <img src="/images/cappuccino.jpg" alt="Fresh cappuccino" />
      </section>

      <section className="about-cta">
        <div className="container about-cta-inner">
          <h2>Ready to eat? We're open now.</h2>
          <p>{data.business.address}</p>
          <div className="cta-row">
            <a href={data.business.whatsappHref} className="button button-primary" target="_blank" rel="noreferrer">Order on WhatsApp</a>
            <a href={data.business.phoneHref} className="button button-secondary">{data.business.phone}</a>
          </div>
        </div>
      </section>

    </div>
  );
}
