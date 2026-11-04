import { Link } from 'react-router-dom';

export function AboutSnippet({ business }) {
  return (
    <section className="about-section container">
      <div className="about-copy">
        <span className="eyebrow eyebrow-dark">About us</span>
        <h2>Neighbourhood comfort with big flavour.</h2>
        <p>{business.description}</p>
        <p>From early morning coffee to late-evening meals, our menu is designed to serve the everyday cravings of the local community and nearby residents in Ruaka and beyond.</p>
        <Link to="/about" className="button button-primary">Learn more</Link>
      </div>
      <div className="about-image-wrap">
        <img
          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80"
          alt="The café interior and dining area"
        />
      </div>
    </section>
  );
}
