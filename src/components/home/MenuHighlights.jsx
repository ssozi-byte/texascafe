import { useState } from 'react';
import { MenuCard } from '../ui/MenuCard';
import { SectionHeader } from '../ui/SectionHeader';

export function MenuHighlights({ menuItems }) {
  const [selected, setSelected] = useState(null);
  const featured = menuItems.filter((item) => item.featured);

  const orderHref = selected
    ? `https://wa.me/254796999547?text=Hi%2C%20I%27d%20like%20to%20order%3A%20${encodeURIComponent(selected.name)}%20(${encodeURIComponent(selected.price)})`
    : 'https://wa.me/254796999547';

  return (
    <section className="menu-section container" id="menu-section">
      <SectionHeader eyebrow="Our menu" title="Fresh favourites for every craving." dark />
      <div className="menu-grid">
        {featured.map((item) => (
          <MenuCard key={item.id} item={item} onView={setSelected} />
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close" onClick={() => setSelected(null)}>×</button>
            <div className="modal-img-wrap">
              <img src={selected.image} alt={selected.name} />
            </div>
            <div className="modal-copy">
              <span className="menu-category">{selected.category}</span>
              <h3>{selected.name}</h3>
              <p>{selected.description}</p>
              <strong>{selected.price}</strong>
              <a href={orderHref} className="button button-primary modal-order-btn" target="_blank" rel="noreferrer">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
