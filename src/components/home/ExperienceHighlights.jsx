export function ExperienceHighlights({ pillars, stats }) {
  return (
    <section className="experience-section">
      <div className="container experience-wrap">
        <div className="experience-intro">
          <span className="eyebrow eyebrow-dark">Why locals love us</span>
          <h2>Made for everyday cravings and slow coffee mornings.</h2>
          <p>
            From the first espresso to the last bite of dessert, every detail is designed to feel warm,
            generous and genuinely welcoming.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <article className="pillar-card" key={pillar.title}>
              <div className="pillar-icon" aria-hidden="true">{pillar.icon}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
