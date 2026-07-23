'use client';
import { useStore } from '@/context/StoreContext';
import { formatNumber } from '@/lib/utils';

export default function AdminOrders() {
  const { allOrders, dispatch, showToast } = useStore();

  const statusClass = (s) =>
    s === 'delivered' ? 'delivered'
    : s === 'shipped' ? 'shipped'
    : s === 'confirmed' ? 'shipped'
    : s === 'pending' ? 'pending'
    : 'cancelled';

  const updateStatus = async (order, status) => {
    const targetId = order.rawId || order.id;
    // Optimistic UI state update so dropdown changes immediately
    dispatch({ type: 'UPDATE_ORDER_STATUS', id: targetId, status });
    showToast(`Order status updated → ${status}`);

    try {
      const adminKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'changeme-in-production';
      await fetch(`/api/orders/${targetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`,
        },
        body: JSON.stringify({ orderStatus: status.toUpperCase() })
      });
    } catch (err) {
      console.warn('API update failed, kept local state update:', err);
    }
  };

  return (
    <div className="admin-section active" id="sec-orders">
      <div className="admin-table-wrap">
        <h2>All Orders (<span id="order-count-admin">{allOrders.length}</span>)</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th><th>Customer</th><th>Phone</th><th>Items</th>
              <th>Total</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontFamily: 'monospace', color: '#7c3aed' }}>{o.id}</td>
                <td>{o.customer}</td>
                <td>{o.phone || '—'}</td>
                <td>{o.items}</td>
                <td>₹{formatNumber(o.total)}</td>
                <td>{o.payment || 'Online'}</td>
                <td>{o.date}</td>
                <td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td>
                <td>
                  <select
                    value={o.status}
                    onChange={e => updateStatus(o, e.target.value)}
                    style={{ fontSize: '11px', padding: '3px 6px', border: '1px solid #ddd', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
