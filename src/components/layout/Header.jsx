import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { business, navItems } from '../../data/siteData';

// Shared header for all public pages. It includes brand identity, responsive navigation and the
// primary order CTA used throughout the storefront.
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <NavLink to="/" className="brand" aria-label="Kim’s Texas Caffe home">
          <span className="brand-mark">K</span>
          <span>
            <strong>{business.name}</strong>
            <small>{business.shortName}</small>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <a href={business.whatsappHref} className="button button-primary" target="_blank" rel="noreferrer">
            Order Now
          </a>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileMenuOpen}
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen((current) => !current)}
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-nav">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
