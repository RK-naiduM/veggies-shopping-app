import React, { useState, useEffect } from 'react';
import API from '../api';
// We can use your existing icons, plus a couple standard emojis for payments
// 💰 for Paid, ⏳ for Pending

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
             console.error("No token found");
             return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        const res = await API.get('/orders', config);
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Handle Delivery Status Change (Original)
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };

      await API.put(`/orders/${id}/status`, { status: newStatus }, config);

      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
      
      alert(`Order updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  // 3. --- NEW: Handle Payment Status Change ---
  const handlePaymentStatusChange = async (id, newPaymentStatus) => {
    // Optional: Add a confirmation dialog before marking as paid
    if (!window.confirm(`Are you sure you want to mark this COD order as ${newPaymentStatus}?`)) {
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };

      // Calls the new route we built in the backend
      await API.put(`/orders/${id}/payment-status`, { paymentStatus: newPaymentStatus }, config);

      // Update UI instantly
      setOrders(orders.map(order => 
        order._id === id ? { ...order, paymentStatus: newPaymentStatus } : order
      ));
      
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Failed to update payment status");
    }
  };

  // Helper: Get Color based on Delivery Status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';   // Orange
      case 'Processing': return '#3498db'; // Blue
      case 'Shipped': return '#9b59b6';    // Purple
      case 'Delivered': return '#27ae60';  // Green
      case 'Cancelled': return '#e74c3c';  // Red
      default: return '#7f8c8d';
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Admin Dashboard 🛡️</h2>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Date</th>
              {/* --- NEW HEADERS --- */}
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Payment Status</th>
              {/* ----------------- */}
              <th style={styles.th}>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={styles.row}>
                <td style={styles.td}>#{order._id.slice(-6)}</td>
                <td style={styles.td}>
                  <strong>{order.customerName}</strong><br/>
                  <span style={{ fontSize: '12px', color: '#777' }}>{order.user?.email || 'Guest'}</span>
                </td>
                <td style={styles.td}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '13px' }}>
                      {item.quantity} x {item.name}
                    </div>
                  ))}
                </td>
                <td style={styles.td}>₹{order.totalAmount}</td>
                <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                
                {/* --- NEW: PAYMENT METHOD COLUMN --- */}
                <td style={styles.td}>
                  <span style={styles.methodBadge}>
                    {order.paymentMethod || 'COD'}
                  </span>
                </td>

                {/* --- NEW: PAYMENT STATUS COLUMN --- */}
                <td style={styles.td}>
                  {/* If it's paid, show a green label */}
                  {order.paymentStatus === 'Paid' ? (
                    <span style={styles.paidBadge}>💰 Paid</span>
                  ) : (
                    /* If pending, show a button to mark it as paid */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={styles.pendingBadge}>⏳ Pending</span>
                        {order.paymentMethod === 'COD' && (
                            <button 
                                onClick={() => handlePaymentStatusChange(order._id, 'Paid')}
                                style={styles.markPaidBtn}
                            >
                                Mark Paid
                            </button>
                        )}
                    </div>
                  )}
                </td>
                
                {/* --- THE DELIVERY STATUS DROPDOWN (Original) --- */}
                <td style={styles.td}>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{
                      ...styles.select,
                      borderColor: getStatusColor(order.status),
                      color: getStatusColor(order.status)
                    }}
                  >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Processing">⚙️ Processing</option>
                    <option value="Shipped">🚚 Shipped</option>
                    <option value="Delivered">✅ Delivered</option>
                    <option value="Cancelled">❌ Cancelled</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Internal CSS
const styles = {
  container: { padding: '30px', maxWidth: '1400px', margin: '0 auto' }, // Widened slightly for new columns
  tableContainer: { overflowX: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  headerRow: { backgroundColor: '#2c3e50', color: 'white' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '15px', verticalAlign: 'middle' },
  select: {
    padding: '8px',
    borderRadius: '5px',
    border: '2px solid #ddd',
    fontWeight: 'bold',
    cursor: 'pointer',
    outline: 'none',
    backgroundColor: 'white'
  },
  // --- NEW STYLES ---
  methodBadge: {
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#475569',
    border: '1px solid #cbd5e1'
  },
  paidBadge: {
    color: '#15803d',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  pendingBadge: {
    color: '#b45309',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  markPaidBtn: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '4px'
  }
};

export default AdminPage;