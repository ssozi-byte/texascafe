import { useCallback, useEffect, useState } from 'react';
import { business, menuItems as fallbackMenuItems, offers as fallbackOffers } from '../../data/siteData';
import { deleteJson, fetchJson, postJson, putJson } from '../../services/siteApi';
import { AdminSidebar } from './AdminSidebar';
import { MetricCard } from './MetricCard';

const emptyMenuForm = {
  id: '',
  name: '',
  category: 'Coffee & Hot Drinks',
  price: 'KSh 0',
  description: '',
  image: '',
  featured: false,
};

const emptyOfferForm = {
  id: '',
  title: '',
  description: '',
  valid: '',
};

const fallbackInquiries = [
  { id: 1, name: 'Njeri', phone: '+254 700 000 001', message: 'I would like to reserve a table for Friday evening.', status: 'New' },
  { id: 2, name: 'Samuel', phone: '+254 712 345 678', message: 'Can I order a family meal deal for takeaway?', status: 'Pending' },
  { id: 3, name: 'Asha', phone: '+254 722 111 222', message: 'Do you offer delivery for burgers after 8 PM?', status: 'Responded' },
];

const defaultSummary = {
  totalMenuItems: fallbackMenuItems.length,
  activeOffers: fallbackOffers.length,
  newInquiries: 4,
  dailyRevenue: 'KSh 34,500',
};

const AUTH_STORAGE_KEY = 'texascafe_admin_token';
const permissionOptions = ['menu', 'prices', 'images', 'offers', 'accounts'];
const emptyAccountForm = {
  username: '',
  password: '',
  permissions: ['menu', 'prices', 'images', 'offers'],
};

export function AdminDashboardPage() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY));
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem(AUTH_STORAGE_KEY)));
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(defaultSummary);
  const [menuItems, setMenuItems] = useState(fallbackMenuItems);
  const [offers, setOffers] = useState(fallbackOffers);
  const [inquiries, setInquiries] = useState(fallbackInquiries);
  const [menuForm, setMenuForm] = useState(emptyMenuForm);
  const [offerForm, setOfferForm] = useState(emptyOfferForm);
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [userPermissions, setUserPermissions] = useState([]);
  const [notice, setNotice] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const canManageAccounts = userPermissions.includes('accounts');
  const canManageMenu = userPermissions.some((permission) => ['menu', 'prices', 'images'].includes(permission));
  const canManageOffers = userPermissions.includes('offers');

  const loadDashboardData = useCallback(async () => {
    try {
      const [summaryData, menuData, offerData, inquiryData, meData] = await Promise.all([
        fetchJson('/api/admin/summary', defaultSummary, token),
        fetchJson('/api/admin/menu', fallbackMenuItems, token),
        fetchJson('/api/admin/offers', fallbackOffers, token),
        fetchJson('/api/admin/inquiries', fallbackInquiries, token),
        fetchJson('/api/admin/me', { username: '', permissions: [] }, token),
      ]);

      setSummary(summaryData);
      setMenuItems(menuData || fallbackMenuItems);
      setOffers(offerData || fallbackOffers);
      setInquiries(inquiryData || fallbackInquiries);
      setUserPermissions(meData?.permissions || []);

      if (meData?.permissions?.includes('accounts')) {
        const accountData = await fetchJson('/api/admin/accounts', [], token);
        setAdminAccounts(accountData || []);
      } else {
        setAdminAccounts([]);
      }
    } catch (error) {
      console.warn('Unable to load admin dashboard data.', error);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadDashboardData();
    }
  }, [isAuthenticated, token, loadDashboardData]);

  async function handleLogin(event) {
    event.preventDefault();

    const response = await postJson('/api/admin/login', loginForm, { error: 'Invalid credentials' }, null);
    if (!response || response.error || !response.token) {
      setLoginError(response?.error || 'Invalid credentials');
      return;
    }

    const newToken = response.token;
    localStorage.setItem(AUTH_STORAGE_KEY, newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    setUserPermissions(response.permissions || []);
    setLoginError('');
    setNotice('Logged in successfully.');
  }

  async function handleLogout() {
    if (token) {
      await postJson('/api/admin/logout', {}, { status: 'logged_out' }, token);
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setIsAuthenticated(false);
    setUserPermissions([]);
    setAdminAccounts([]);
    setNotice('You have been logged out.');
  }

  async function handleMenuSubmit(event) {
    event.preventDefault();

    try {
      const payload = { ...menuForm, price: menuForm.price || 'KSh 0' };
      const shouldUpdate = Boolean(payload.id);
      const response = shouldUpdate
        ? await putJson(`/api/admin/menu/${payload.id}`, payload, [payload], token)
        : await postJson('/api/admin/menu', payload, [payload], token);

      if (shouldUpdate) {
        setMenuItems((current) => current.map((item) => (item.id === payload.id ? response[0] || response : item)));
      } else {
        setMenuItems((current) => [response[0] || response, ...current]);
      }

      setMenuForm(emptyMenuForm);
      setNotice('Menu item saved successfully.');
      setActiveTab('menu');
      await loadDashboardData();
    } catch (error) {
      setNotice('There was a problem saving the menu item.');
      console.error(error);
    }
  }

  async function handleOfferSubmit(event) {
    event.preventDefault();

    try {
      const payload = { ...offerForm };
      const shouldUpdate = Boolean(payload.id);
      const response = shouldUpdate
        ? await putJson(`/api/admin/offers/${payload.id}`, payload, [payload], token)
        : await postJson('/api/admin/offers', payload, [payload], token);

      if (shouldUpdate) {
        setOffers((current) => current.map((item) => (item.id === payload.id ? response[0] || response : item)));
      } else {
        setOffers((current) => [response[0] || response, ...current]);
      }

      setOfferForm(emptyOfferForm);
      setNotice('Offer saved successfully.');
      setActiveTab('offers');
      await loadDashboardData();
    } catch (error) {
      setNotice('There was a problem saving the offer.');
      console.error(error);
    }
  }

  async function handleDeleteMenu(id) {
    try {
      await deleteJson(`/api/admin/menu/${id}`, { id }, { deleted: id }, token);
      setMenuItems((current) => current.filter((item) => item.id !== id));
      setNotice('Menu item removed.');
      await loadDashboardData();
    } catch (error) {
      setNotice('Menu item removal failed.');
      console.error(error);
    }
  }

  async function handleDeleteOffer(id) {
    try {
      await deleteJson(`/api/admin/offers/${id}`, { id }, { deleted: id }, token);
      setOffers((current) => current.filter((item) => item.id !== id));
      setNotice('Offer removed.');
      await loadDashboardData();
    } catch (error) {
      setNotice('Offer removal failed.');
      console.error(error);
    }
  }

  function toggleAccountPermission(permission) {
    setAccountForm((current) => {
      const nextPermissions = new Set(current.permissions);
      if (nextPermissions.has(permission)) {
        nextPermissions.delete(permission);
      } else {
        nextPermissions.add(permission);
      }

      return {
        ...current,
        permissions: [...nextPermissions],
      };
    });
  }

  async function handleAccountSubmit(event) {
    event.preventDefault();

    try {
      const isEditing = Boolean(adminAccounts.some((account) => account.username === accountForm.username));
      const payload = {
        username: accountForm.username,
        permissions: accountForm.permissions,
        ...(accountForm.password ? { password: accountForm.password } : {}),
      };

      const response = isEditing
        ? await putJson(`/api/admin/accounts/${accountForm.username}`, payload, [], token)
        : await postJson('/api/admin/accounts', payload, [], token);

      const nextAccountList = isEditing
        ? adminAccounts.map((account) => (account.username === accountForm.username ? response : account))
        : [response, ...adminAccounts];

      setAdminAccounts(nextAccountList);
      setAccountForm({ ...emptyAccountForm, permissions: [...emptyAccountForm.permissions] });
      setNotice(isEditing ? 'Admin account updated successfully.' : 'Admin account created successfully.');
      setActiveTab('accounts');
      await loadDashboardData();
    } catch (error) {
      setNotice('Unable to update the admin account.');
      console.error(error);
    }
  }

  async function handleDeleteAccount(username) {
    try {
      await deleteJson(`/api/admin/accounts/${username}`, { username }, { deleted: username }, token);
      setAdminAccounts((current) => current.filter((account) => account.username !== username));
      setNotice('Admin account removed.');
      await loadDashboardData();
    } catch (error) {
      setNotice('Admin account removal failed.');
      console.error(error);
    }
  }

  function startEditingAccount(account) {
    setAccountForm({
      username: account.username,
      password: '',
      permissions: [...(account.permissions || [])],
    });
    setActiveTab('accounts');
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard-page">
        <div className="container admin-login-wrap">
          <div className="admin-login-card">
            <div className="admin-brand-block">
              <span className="brand-mark">K</span>
              <div>
                <strong>Kim’s Texas Caffe</strong>
                <small>Secure admin login</small>
              </div>
            </div>

            <form onSubmit={handleLogin} className="admin-login-form">
              <label>
                Username
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                />
              </label>

              {loginError && <div className="admin-login-error">{loginError}</div>}

              <button type="submit" className="button button-primary">Log in</button>
            </form>

            <p className="login-hint">Use the dedicated Texas Caffe admin account issued for the dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="container admin-layout">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} summary={summary} canManageAccounts={canManageAccounts} />

        <main className="admin-main">
          <header className="admin-header">
            <div>
              <p className="admin-eyebrow">Operations</p>
              <h1>Dashboard Overview</h1>
            </div>
            <div className="header-actions">
              <button type="button" className="button button-secondary" onClick={handleLogout}>Log out</button>
              <a className="button button-primary" href={business.whatsappHref} target="_blank" rel="noreferrer">
                Quick Order
              </a>
            </div>
          </header>

          {notice && <div className="admin-notice">{notice}</div>}

          {activeTab === 'overview' && (
            <section className="admin-panel">
              <div className="metrics-grid">
                <MetricCard label="Menu items" value={summary.totalMenuItems} hint="Active dishes on the café menu" />
                <MetricCard label="Active offers" value={summary.activeOffers} hint="Live customer promotions" tone="warm" />
                <MetricCard label="New enquiries" value={summary.newInquiries} hint="Awaiting follow-up" tone="accent" />
                <MetricCard label="Revenue today" value={summary.dailyRevenue} hint="Estimated sales pace" tone="success" />
              </div>

              <div className="admin-grid-two">
                <div className="content-card">
                  <h2>Top selling menu</h2>
                  <ul className="stacked-list">
                    {menuItems.slice(0, 4).map((item) => (
                      <li key={item.id}>
                        <span>{item.name}</span>
                        <strong>{item.price}</strong>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="content-card">
                  <h2>Recent enquiries</h2>
                  <ul className="stacked-list compact">
                    {inquiries.slice(0, 4).map((item) => (
                      <li key={item.id}>
                        <span>{item.name}</span>
                        <small>{item.status}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'menu' && canManageMenu && (
            <section className="admin-panel">
              <div className="admin-grid-two align-start">
                <form className="content-card form-card" onSubmit={handleMenuSubmit}>
                  <h2>{menuForm.id ? 'Edit menu item' : 'Add menu item'}</h2>

                  <label>
                    Name
                    <input
                      value={menuForm.name}
                      onChange={(event) => setMenuForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Cappuccino"
                    />
                  </label>

                  <div className="inline-fields">
                    <label>
                      Category
                      <select
                        value={menuForm.category}
                        onChange={(event) => setMenuForm((current) => ({ ...current, category: event.target.value }))}
                      >
                        <option>Coffee & Hot Drinks</option>
                        <option>Fresh Juices & Cold Drinks</option>
                        <option>Burgers & Quick Bites</option>
                        <option>Main Meals</option>
                        <option>Pizza & Grills</option>
                        <option>Desserts & Treats</option>
                      </select>
                    </label>

                    <label>
                      Price
                      <input
                        value={menuForm.price}
                        onChange={(event) => setMenuForm((current) => ({ ...current, price: event.target.value }))}
                        placeholder="KSh 420"
                      />
                    </label>
                  </div>

                  <label>
                    Description
                    <textarea
                      value={menuForm.description}
                      onChange={(event) => setMenuForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Describe the dish and flavour profile."
                    />
                  </label>

                  <label>
                    Image URL
                    <input
                      value={menuForm.image}
                      onChange={(event) => setMenuForm((current) => ({ ...current, image: event.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </label>

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={menuForm.featured}
                      onChange={(event) => setMenuForm((current) => ({ ...current, featured: event.target.checked }))}
                    />
                    Feature on the storefront
                  </label>

                  <button type="submit" className="button button-primary">
                    {menuForm.id ? 'Update item' : 'Add item'}
                  </button>
                </form>

                <div className="content-card list-card">
                  <h2>Menu catalogue</h2>
                  <div className="mini-list">
                    {menuItems.map((item) => (
                      <div key={item.id} className="mini-row">
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.category}</small>
                        </div>
                        <div className="list-actions">
                          <button type="button" onClick={() => setMenuForm(item)}>Edit</button>
                          <button type="button" className="destructive" onClick={() => handleDeleteMenu(item.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'offers' && canManageOffers && (
            <section className="admin-panel">
              <div className="admin-grid-two align-start">
                <form className="content-card form-card" onSubmit={handleOfferSubmit}>
                  <h2>{offerForm.id ? 'Edit offer' : 'Add offer'}</h2>

                  <label>
                    Title
                    <input
                      value={offerForm.title}
                      onChange={(event) => setOfferForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Midweek Coffee Combo"
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={offerForm.description}
                      onChange={(event) => setOfferForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Outline the offer value and how customers can redeem it."
                    />
                  </label>

                  <label>
                    Validity
                    <input
                      value={offerForm.valid}
                      onChange={(event) => setOfferForm((current) => ({ ...current, valid: event.target.value }))}
                      placeholder="Valid until 30 Nov 2026"
                    />
                  </label>

                  <button type="submit" className="button button-primary">
                    {offerForm.id ? 'Update offer' : 'Create offer'}
                  </button>
                </form>

                <div className="content-card list-card">
                  <h2>Promotions board</h2>
                  <div className="mini-list">
                    {offers.map((offer) => (
                      <div key={offer.id || offer.title} className="mini-row offer-row">
                        <div>
                          <strong>{offer.title}</strong>
                          <small>{offer.valid}</small>
                        </div>
                        <div className="list-actions">
                          <button type="button" onClick={() => setOfferForm(offer)}>Edit</button>
                          <button type="button" className="destructive" onClick={() => handleDeleteOffer(offer.id || offer.title)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'accounts' && canManageAccounts && (
            <section className="admin-panel">
              <div className="admin-grid-two align-start">
                <form className="content-card form-card" onSubmit={handleAccountSubmit}>
                  <h2>{adminAccounts.some((account) => account.username === accountForm.username) ? 'Edit admin account' : 'Create admin account'}</h2>

                  <label>
                    Username
                    <input
                      value={accountForm.username}
                      onChange={(event) => setAccountForm((current) => ({ ...current, username: event.target.value }))}
                      placeholder="manager"
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      value={accountForm.password}
                      onChange={(event) => setAccountForm((current) => ({ ...current, password: event.target.value }))}
                      placeholder={adminAccounts.some((account) => account.username === accountForm.username) ? 'Leave blank to keep current password' : 'Choose a password'}
                    />
                  </label>

                  <div className="permission-list">
                    {permissionOptions.map((permission) => (
                      <label key={permission} className="checkbox-row permission-row">
                        <input
                          type="checkbox"
                          checked={accountForm.permissions.includes(permission)}
                          onChange={() => toggleAccountPermission(permission)}
                        />
                        {permission}
                      </label>
                    ))}
                  </div>

                  <button type="submit" className="button button-primary">
                    {adminAccounts.some((account) => account.username === accountForm.username) ? 'Save changes' : 'Create account'}
                  </button>
                </form>

                <div className="content-card list-card">
                  <h2>Admin accounts</h2>
                  <div className="mini-list">
                    {adminAccounts.map((account) => (
                      <div key={account.username} className="mini-row">
                        <div>
                          <strong>{account.username}</strong>
                          <small>{(account.permissions || []).join(', ') || 'No permissions assigned'}</small>
                        </div>
                        <div className="list-actions">
                          <button type="button" onClick={() => startEditingAccount(account)}>Edit</button>
                          {account.username !== 'admin' && (
                            <button type="button" className="destructive" onClick={() => handleDeleteAccount(account.username)}>Delete</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'inquiries' && (
            <section className="admin-panel">
              <div className="content-card full-width-card">
                <h2>Customer enquiries</h2>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Message</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.phone}</td>
                        <td>{item.message}</td>
                        <td>
                          <span className={`status-pill ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
