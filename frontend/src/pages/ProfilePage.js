import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaBoxOpen } from 'react-icons/fa';
import API from '../api';

const ProfilePage = ({ user }) => {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchMyOrders = async () => {
        try {
          // We need the token to access the protected route if we added protection
          // For now, assuming public access or basic user access
          //const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
          const res = await API.get(`/orders/user/${user.id}`);
          setMyOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };
      fetchMyOrders();
    }
  }, [user]);

  // --- NEW: COLOR HELPER FUNCTION ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';   // Orange
      case 'Processing': return '#3498db'; // Blue
      case 'Shipped': return '#9b59b6';    // Purple
      case 'Delivered': return '#27ae60';  // Green
      case 'Cancelled': return '#e74c3c';  // Red
      default: return '#7f8c8d'; // Gray
    }
  };

  if (!user) return <h2>Please Login</h2>;

  return (
    <div style={styles.container}>
      
      {/* 1. User Info Card */}
      <div style={styles.profileCard}>
        <div style={{ textAlign: 'center' }}>
          <FaUserCircle style={{ fontSize: '80px', color: '#2c3e50', marginBottom: '10px' }} />
          <h2 style={{ margin: '10px 0' }}>{user.name}</h2>
          <p style={{ color: '#777' }}>{user.email}</p>
          <div style={styles.badge}>Member</div>
        </div>
      </div>

      {/* 2. Order History Section */}
      <div style={styles.ordersSection}>
        <h2 style={{ borderBottom: '2px solid #27ae60', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaBoxOpen /> Order History
        </h2>

        {myOrders.length === 0 ? (
          <p style={{ marginTop: '20px', color: '#888' }}>You haven't placed any orders yet.</p>
        ) : (
          <div style={styles.orderList}>
            {myOrders.map((order) => (
              <div key={order._id} style={styles.orderCard}>
                
                {/* Order Header */}
                <div style={styles.orderHeader}>
                  <span style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6)}</span>
                  <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Items List */}
                <div style={{ margin: '15px 0' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                      <span>{item.name} (x{item.quantity})</span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Total & Status */}
                <div style={styles.orderFooter}>
                  
                  {/* --- UPDATED BADGE WITH DYNAMIC COLORS --- */}
                  <span style={{ 
                    padding: '5px 12px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(order.status) // <--- Color applied here
                  }}>
                    {order.status}
                  </span>

                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                    Total: ${order.totalAmount}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '1000px', 
    margin: '40px auto', 
    padding: '20px',
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap'
  },
  profileCard: {
    flex: 1,
    minWidth: '300px',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    height: 'fit-content',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    backgroundColor: 'white'
  },
  badge: {
    display: 'inline-block',
    marginTop: '15px',
    padding: '5px 15px',
    backgroundColor: '#eafaf1',
    color: '#27ae60',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  ordersSection: {
    flex: 2,
    minWidth: '300px'
  },
  orderList: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  orderCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '10px',
    color: '#555'
  },
  date: {
    fontSize: '12px',
    color: '#999'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    borderTop: '1px solid #eee',
    paddingTop: '15px'
  }
};

export default ProfilePage;