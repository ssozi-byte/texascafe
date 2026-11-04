import { Link } from 'react-router-dom';
import { MenuCard } from '../ui/MenuCard';
import { SectionHeader } from '../ui/SectionHeader';

export function MenuHighlights({ menuItems }) {
  return (
    <section className="menu-section container">
      <SectionHeader
        eyebrow="Our menu"
        title="Fresh favourites for every craving."
        dark
        action={<Link to="/menu" className="button button-secondary">View Full Menu</Link>}
      />
      <div className="menu-grid">
        {menuItems.slice(0, 6).map((item) => (
          <MenuCard key={item.id} item={item} linkTo="/menu" />
        ))}
      </div>
    </section>
  );
}
