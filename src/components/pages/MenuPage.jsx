import { useMemo, useState } from 'react';
import { MenuCard } from '../ui/MenuCard';
import { SectionHeader } from '../ui/SectionHeader';

export function MenuPage({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredMenu = useMemo(() => {
    return data.menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, data.menuItems, searchTerm]);

  return (
    <section className="page-shell container">
      <SectionHeader eyebrow="Menu" title="Browse the full menu." dark as="h1" />

      <div className="menu-toolbar">
        <label className="search-box">
          <span>Search</span>
          <input
            type="search"
            aria-label="Search menu items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu..."
          />
        </label>
        <div className="category-pills" aria-label="Menu categories">
          <button type="button" className={categoryFilter === 'All' ? 'pill active' : 'pill'} onClick={() => setCategoryFilter('All')}>
            All
          </button>
          {data.categories.map((category) => (
            <button
              key={category}
              type="button"
              className={categoryFilter === category ? 'pill active' : 'pill'}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="full-menu-grid">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <MenuCard key={item.id} item={item} onView={setSelectedItem} />
          ))
        ) : (
          <div className="empty-state">
            <p>No items match your current search. Try another category or term.</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedItem(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close product details" onClick={() => setSelectedItem(null)}>×</button>
            <img src={selectedItem.image} alt={selectedItem.name} />
            <div className="modal-copy">
              <span className="menu-category">{selectedItem.category}</span>
              <h3>{selectedItem.name}</h3>
              <p>{selectedItem.description}</p>
              <strong>{selectedItem.price}</strong>
              <a href={data.business.whatsappHref} className="button button-primary" target="_blank" rel="noreferrer">
                Order this item
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
