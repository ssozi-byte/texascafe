export function MenuCard({ item, onView, linkTo }) {
  return (
    <article className="menu-card">
      <img src={item.image} alt={item.name} loading="lazy" />
      <div className="menu-card-body">
        <div className="menu-meta-row">
          <span className="menu-category">{item.category}</span>
          {item.featured && <span className="menu-badge">Popular</span>}
        </div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-price-row">
          <strong>{item.price}</strong>
          {onView && <button type="button" onClick={() => onView(item)}>View details</button>}
          {linkTo && <a href={linkTo}>Quick view</a>}
        </div>
      </div>
    </article>
  );
}
