// Sidebar navigation for the admin workspace. It keeps the screen organised into a small set of
// sections so the dashboard stays readable even as more controls are added later.
export function AdminSidebar({ activeTab, onTabChange, summary, canManageAccounts }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'menu', label: 'Menu Manager' },
    { id: 'offers', label: 'Offers' },
    { id: 'inquiries', label: 'Inquiries' },
    ...(canManageAccounts ? [{ id: 'accounts', label: 'Admin Accounts' }] : []),
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand-block">
        <span className="brand-mark">K</span>
        <div>
          <strong>Kim’s Texas Caffe</strong>
          <small>Admin Console</small>
        </div>
      </div>

      <nav className="admin-nav" aria-label="Admin sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'admin-nav-item active' : 'admin-nav-item'}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="admin-summary-box">
        <span>Today</span>
        <strong>{summary.newInquiries}</strong>
        <small>new enquiries</small>
      </div>
    </aside>
  );
}
