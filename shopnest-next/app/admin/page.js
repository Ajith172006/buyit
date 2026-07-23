'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminLoginForm from '@/components/admin/AdminLoginForm';


/* ─── Settings Tab ─────────────────────────────────────────────── */
function AdminSettings() {
  const { showToast } = useStore();
  return (
    <div className="admin-section active" id="sec-settings">
      <div className="add-product-form">
        <h2>⚙ Store Settings</h2>
        <div className="form-grid">
          <div className="form-group"><label>Store Name</label><input type="text" defaultValue="BuyIt" /></div>
          <div className="form-group"><label>Currency</label><select><option>INR (₹)</option><option>USD ($)</option></select></div>
          <div className="form-group"><label>Free Delivery Above</label><input type="number" defaultValue="499" /></div>
          <div className="form-group"><label>GST Rate (%)</label><input type="number" defaultValue="18" /></div>
          <div className="form-group full"><label>Store Description</label><textarea rows={2} defaultValue="India's fastest growing online marketplace" /></div>
        </div>
        <button className="form-submit" onClick={() => showToast('Settings saved!')}>Save Settings</button>
      </div>
    </div>
  );
}

/* ─── Admin Dashboard Page ─────────────────────────────────────── */
function AdminDashboardPage({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard onViewOrders={() => setActiveTab('orders')} />;
      case 'products':  return <AdminProducts />;
      case 'orders':    return <AdminOrders />;
      case 'customers': return <AdminCustomers />;
      case 'analytics': return <AdminAnalytics />;
      case 'settings':  return <AdminSettings />;
      default:          return null;
    }
  };

  return (
    <div id="admin-panel" style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-title" style={{ gap: 10 }}>
          <button
            className="admin-mobile-toggle"
            type="button"
            aria-label="Open admin navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            ☰
          </button>
          <Link href="/" style={{ color: '#a5b4fc', fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
            ← Store
          </Link>
          <h1>🛍 BuyIt Admin <span>DASHBOARD</span></h1>
        </div>
        <div className="admin-header-actions">
          <button className="admin-logout-btn" onClick={onLogout}>🔓 Logout</button>
        </div>
      </div>

      {/* Body */}
      <div className="admin-body">
        <div className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          {tabs.map(t => (
            <div
              key={t.key}
              className={`admin-menu-item${activeTab === t.key ? ' active' : ''}`}
              onClick={() => selectTab(t.key)}
            >
              <span className="icon">{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
        <div className="admin-content" data-lenis-prevent>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* ─── Route Entry Point ────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = loading

  // Check localStorage on mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const saved = localStorage.getItem(AUTH_KEY);
      setAuthed(saved === '1');
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  // Loading state (prevents flash of login on refresh if already authed)
  if (authed === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0a28', color: '#a5b4fc', fontSize: 16 }}>
        Loading…
      </div>
    );
  }

  if (!authed) return <AdminLoginForm onSuccess={() => setAuthed(true)} />;
  return <AdminDashboardPage onLogout={handleLogout} />;
}
