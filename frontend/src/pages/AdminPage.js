import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        //const res = await axios.get('http://localhost:5000/api/orders', config);
        const res = await API.get('/orders');
        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // 2. Handle Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };

      // Send update to backend
      //await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, config);
      await API.put(`/orders/${id}/status`, { status: newStatus });

      // Update UI instantly without reloading
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
      
      alert(`Order #${id.slice(-6)} status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const lowStockItems = orders.flatMap(o => o.items).filter(i => false);

  // Helper: Get Color based on Status
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
              <th style={styles.th}>Status</th> {/* The Dropdown Column */}
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
                <td style={styles.td}>${order.totalAmount}</td>
                <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                
                {/* --- THE STATUS DROPDOWN --- */}
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
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto' },
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
  }
};

export default AdminPage;