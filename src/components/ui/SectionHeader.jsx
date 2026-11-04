export function SectionHeader({ eyebrow, title, action, dark = false, left = false, as: Tag = 'h2' }) {
  return (
    <div className={`section-header${left ? ' section-header-left' : ''}`}>
      <div>
        <span className={`eyebrow${dark ? ' eyebrow-dark' : ''}`}>{eyebrow}</span>
        <Tag>{title}</Tag>
      </div>
      {action}
    </div>
  );
}
