export function FeaturedCategories({ categories }) {
  return (
    <section className="featured-categories container">
      {categories.map((category) => (
        <div key={category} className="category-card">
          <span>{category}</span>
        </div>
      ))}
    </section>
  );
}
