import { NavLink } from 'react-router-dom';
import { business, navItems } from '../../data/siteData';

// Footer displayed on every page. It keeps the same business details and quick links across the
// entire application while also supporting a consistent branded close-out.
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <NavLink to="/" className="brand footer-brand">
            <span className="brand-mark">K</span>
            <span>
              <strong>{business.name}</strong>
              <small>{business.shortName}</small>
            </span>
          </NavLink>
          <p>{business.description}</p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul>
            <li>{business.address}</li>
            <li>
              <a href={business.phoneHref}>{business.phone}</a>
            </li>
            <li>
              <a href={business.whatsappHref} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {currentYear} Kim’s Texas Caffe.</span>
        <span>All rights reserved. Developed By Collins Ssozi</span>
        <span>Fresh food, fresh coffee, every day.</span>
      </div>
    </footer>
  );
}
