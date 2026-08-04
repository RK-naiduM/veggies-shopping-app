import React, { useState, useEffect } from 'react';
import API from '../api'; // Your configured Axios instance

const AdminBulkOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders when the page loads
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Assuming your API utility attaches your admin token automatically
      const { data } = await API.get('/bulk-orders');
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bulk orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Are you logged in as Admin?');
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Call the PUT route we made in the backend
      await API.put(`/bulk-orders/${id}/status`, { status: newStatus });
      
      // Update the UI immediately without refreshing the page
      setOrders(orders.map(order => 
        order._id === id ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <h2 style={{ fontSize: '28px', color: '#2c3e50', marginBottom: '20px' }}>Manage Bulk Orders</h2>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          {error}
        </div>
      ) : orders.length === 0 ? (
        <p>No bulk orders found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Contact Info</th>
                <th style={styles.th}>Order Details</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td style={styles.td}>
                    <strong>{order.companyName}</strong>
                  </td>
                  <td style={styles.td}>
                    {order.contactPerson}<br/>
                    <a href={`mailto:${order.email}`} style={{ color: '#27ae60' }}>{order.email}</a><br/>
                    {order.phoneNumber}
                  </td>
                  <td style={styles.td}>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '14px', maxWidth: '300px' }}>
                      {order.orderDetails}
                    </p>
                    <small style={{ color: '#7f8c8d', display: 'block', marginTop: '5px' }}>
                      <strong>Ship to:</strong> {order.shippingAddress}
                    </small>
                  </td>
                  <td style={styles.td}>
                    <select 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '8px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        backgroundColor: 
                          order.status === 'Pending' ? '#fff3cd' : 
                          order.status === 'Approved' ? '#d4edda' : 
                          order.status === 'Rejected' ? '#f8d7da' : '#e2e3e5',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  th: { padding: '15px', fontWeight: '600', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', verticalAlign: 'top', color: '#333' }
};

export default AdminBulkOrdersPage;