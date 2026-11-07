export function MenuCard({ item, onView }) {
  const orderHref = `https://wa.me/254796999547?text=Hi%2C%20I%27d%20like%20to%20order%3A%20${encodeURIComponent(item.name)}%20(${encodeURIComponent(item.price)})`;

  return (
    <article className="menu-card">
      <div className="menu-card-img-wrap" onClick={() => onView && onView(item)} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onView && onView(item)}>
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="menu-card-body">
        <div className="menu-meta-row">
          <span className="menu-category">{item.category}</span>
          {item.featured && <span className="menu-badge">Popular</span>}
        </div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-price-row">
          <strong>{item.price}</strong>
        </div>
        <a
          href={orderHref}
          className="button button-primary menu-card-order-btn"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Order Now
        </a>
      </div>
    </article>
  );
}
