import React, { useState, useEffect } from 'react';
import API from '../api';
import { FaPhoneAlt, FaMapMarkerAlt, FaStickyNote } from 'react-icons/fa';

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

// 1. Fetch Orders (Updated for Pagination)
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); // Ensure loading shows when switching pages
      try {
        const token = localStorage.getItem('token');
        if (!token) {
             console.error("No token found");
             return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        
        // --- NEW: Send page number in the query string ---
        const res = await API.get(`/orders?page=${currentPage}&limit=10`, config);
        
        // --- NEW: Extract data from the new backend payload structure ---
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage]);

  // 2. Handle Delivery Status Change 
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

  // 3. Handle Payment Status Change 
  const handlePaymentStatusChange = async (id, newPaymentStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newPaymentStatus}?`)) {
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

      await API.put(`/orders/${id}/payment-status`, { paymentStatus: newPaymentStatus }, config);

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
      case 'Pending': return '#f39c12';   
      case 'Processing': return '#3498db'; 
      case 'Shipped': return '#9b59b6';    
      case 'Delivered': return '#27ae60';  
      case 'Cancelled': return '#e74c3c';  
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
              <th style={styles.th}>Customer Info</th>
              <th style={styles.th}>Shipping Address & Notes</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment Method</th>
              <th style={styles.th}>Payment Status</th>
              <th style={styles.th}>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={styles.row}>
                
                {/* ID */}
                <td style={styles.td}>#{order._id.slice(-6)}</td>
                
                {/* CUSTOMER INFO (Now includes Phone) */}
                <td style={styles.td}>
                  <strong>{order.customerName}</strong><br/>
                  <span style={{ fontSize: '12px', color: '#777' }}>{order.user?.email || 'Guest'}</span><br/>
                  <span style={{ fontSize: '12px', color: '#27ae60', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                    <FaPhoneAlt style={{ marginRight: '5px', fontSize: '10px' }}/> 
                    {order.phone || 'N/A'}
                  </span>
                </td>

                {/* SHIPPING DETAILS & NOTES (Structured Format) */}
                <td style={styles.td}>
                  <div style={styles.addressBox}>
                    <FaMapMarkerAlt style={{ color: '#e67e22', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      {/* Backward compatibility for old orders without structured address */}
                      {order.shippingAddress ? (
                        <>
                          {order.shippingAddress.line1}
                          {order.shippingAddress.line2 && <><br/>{order.shippingAddress.line2}</>}
                          <br/>
                          {order.shippingAddress.city}, {order.shippingAddress.state} - <strong>{order.shippingAddress.pincode}</strong>
                        </>
                      ) : (
                        <span>{order.customerAddress || 'No Address Data'}</span>
                      )}
                    </div>
                  </div>
                  
                  {order.orderNotes && (
                    <div style={styles.notesBox}>
                      <FaStickyNote style={{ color: '#b45309', marginRight: '5px', flexShrink: 0 }} />
                      <span>{order.orderNotes}</span>
                    </div>
                  )}
                </td>

                {/* ITEMS */}
                <td style={styles.td}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                      <strong>{item.quantity}x</strong> {item.name}
                    </div>
                  ))}
                </td>
                
                {/* TOTAL */}
                <td style={styles.td}><strong>₹{order.totalAmount}</strong></td>
                
                {/* PAYMENT METHOD */}
                <td style={styles.td}>
                  <span style={styles.methodBadge}>
                    {order.paymentMethod || 'COD'}
                  </span>
                </td>

                {/* PAYMENT STATUS */}
                <td style={styles.td}>
                  {order.paymentStatus === 'Paid' ? (
                    <span style={styles.paidBadge}>💰 Paid</span>
                  ) : (
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
                
                {/* DELIVERY STATUS */}
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

      {/* --- NEW: PAGINATION CONTROLS --- */}
      <div style={styles.paginationContainer}>
        <button 
          style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.5 : 1 }}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        >
          &laquo; Previous
        </button>
        
        <span style={styles.pageInfo}>
          Page <strong>{currentPage}</strong> of <strong>{totalPages || 1}</strong>
        </span>
        
        <button 
          style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.5 : 1 }}
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
};

// Internal CSS
const styles = {
  container: { padding: '30px', maxWidth: '1500px', margin: '0 auto' },
  tableContainer: { overflowX: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  headerRow: { backgroundColor: '#2c3e50', color: 'white', whiteSpace: 'nowrap' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd', fontSize: '14px' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '15px', verticalAlign: 'middle' },
  
  // Custom styling for Address and Notes to keep it clean
  addressBox: { display: 'flex', gap: '8px', fontSize: '12px', color: '#475569', lineHeight: '1.4', minWidth: '180px' },
  notesBox: { display: 'flex', alignItems: 'flex-start', marginTop: '8px', padding: '6px 8px', backgroundColor: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '0 4px 4px 0', fontSize: '11px', color: '#92400e' },
  
  select: {
    padding: '8px',
    borderRadius: '5px',
    border: '2px solid #ddd',
    fontWeight: 'bold',
    cursor: 'pointer',
    outline: 'none',
    backgroundColor: 'white',
    fontSize: '13px'
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '15px',
    marginTop: '20px',
    padding: '10px 0'
  },
  pageBtn: {
    padding: '8px 16px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#475569'
  },
  
  methodBadge: { backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', color: '#475569', border: '1px solid #cbd5e1' },
  paidBadge: { color: '#15803d', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' },
  pendingBadge: { color: '#b45309', fontWeight: 'bold', fontSize: '13px', whiteSpace: 'nowrap' },
  markPaidBtn: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px', whiteSpace: 'nowrap' }
};

export default AdminPage;