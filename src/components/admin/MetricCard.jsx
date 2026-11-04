// Reusable metric card used throughout the dashboard. The compact format keeps summary figures easy
// to scan without creating separate component logic for every stat.
export function MetricCard({ label, value, hint, tone = 'brand' }) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}
