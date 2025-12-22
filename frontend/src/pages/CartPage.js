import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api';

const CartPage = ({ user, cart, setCart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  
  // --- FORM STATE ---
  // Pre-fill name if user is logged in, otherwise empty
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerAddress, setCustomerAddress] = useState('');

  // Update name if user prop loads late
  useEffect(() => {
    if (user && user.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  // 1. Calculate Total (Rounded to 2 decimals)
  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  // 2. SMART INCREMENT FUNCTION (Rule of 10)
  const handleIncrement = (item) => {
    const MAX_LIMIT = 10;
    const currentStock = item.stock; 
    
    // The Limit is whichever is smaller: 10 or the Stock
    const effectiveLimit = Math.min(MAX_LIMIT, currentStock);

    if (item.quantity < effectiveLimit) {
      updateQuantity(item._id, 1);
    } else {
      if (item.quantity >= 10) {
        alert("Limit reached: You can only buy 10 per order.");
      } else {
        alert(`Stock limit reached! Only ${currentStock} available.`);
      }
    }
  };

  const handlePlaceOrder = async () => {
    // Validation: Check if form fields are empty
    if (!customerName || !customerAddress) {
      alert("Please fill in your Name and Shipping Address to place the order.");
      return;
    }

    // Prepare Order Data
    const formattedItems = cart.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      user: user.id,
      customerName,
      customerAddress,
      items: formattedItems,
      totalAmount: Number(totalAmount)
    };

    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      //await axios.post('http://localhost:5000/api/orders', orderData, config);
      await API.post('/orders', orderData);
      
      alert('Order Placed Successfully!');
      setCart([]); // Clear cart
      navigate('/profile'); // Redirect to profile
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  if (cart.length === 0) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Your Cart is Empty 🛒</h2>;

  return (
    <div style={styles.container}>
      
      {/* LEFT SIDE: CART ITEMS */}
      <div style={styles.cartSection}>
        <h2 style={{ marginBottom: '20px' }}>Your Shopping Cart</h2>
        <div style={styles.cartList}>
          {cart.map((item) => (
            <div key={item._id} style={styles.cartItem}>
              <img src={item.image} alt={item.name} style={styles.image} />
              
              <div style={styles.details}>
                <h3>{item.name}</h3>
                <p style={{ color: '#777' }}>${item.price} each</p>
                
                {/* Controls */}
                <div style={styles.controls}>
                  <button onClick={() => updateQuantity(item._id, -1)} style={styles.qtyBtn}>-</button>
                  <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item)} style={styles.qtyBtn}>+</button>
                </div>
              </div>

              <div style={styles.actions}>
                <p style={{ fontWeight: 'bold', fontSize: '18px' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button onClick={() => removeFromCart(item._id)} style={styles.removeBtn}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: SHIPPING FORM & CHECKOUT */}
      <div style={styles.checkoutSection}>
        <div style={styles.summaryCard}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
            Shipping Details
          </h3>
          
          {/* Name Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={styles.input}
            />
          </div>

          {/* Address Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Delivery Address</label>
            <textarea 
              rows="3"
              placeholder="Enter your full address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.divider}></div>

          {/* Totals */}
          <div style={styles.totalRow}>
            <span>Total Amount:</span>
            <span style={{ fontSize: '24px', color: '#2c3e50' }}>${totalAmount}</span>
          </div>

          <button onClick={handlePlaceOrder} style={styles.checkoutBtn}>
            Confirm Order
          </button>
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: { 
    maxWidth: '1100px', 
    margin: '40px auto', 
    padding: '20px', 
    display: 'flex', 
    gap: '30px', 
    flexWrap: 'wrap' // Responsive wrapping
  },
  // Cart Items Section
  cartSection: { flex: 2, minWidth: '300px' },
  cartList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cartItem: { 
    display: 'flex', 
    gap: '20px', 
    border: '1px solid #eee', 
    padding: '20px', 
    borderRadius: '10px', 
    alignItems: 'center',
    backgroundColor: 'white'
  },
  image: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' },
  details: { flex: 1 },
  controls: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' },
  qtyBtn: { 
    padding: '5px 10px', 
    cursor: 'pointer', 
    backgroundColor: '#f0f0f0', 
    border: '1px solid #ccc',
    borderRadius: '3px'
  },
  actions: { textAlign: 'right' },
  removeBtn: { 
    backgroundColor: '#e74c3c', 
    color: 'white', 
    border: 'none', 
    padding: '5px 10px', 
    marginTop: '5px', 
    borderRadius: '3px', 
    cursor: 'pointer' 
  },

  // Checkout Form Section
  checkoutSection: { flex: 1, minWidth: '300px' },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    padding: '25px',
    borderRadius: '10px',
    border: '1px solid #eee',
    position: 'sticky',
    top: '100px' // Stick to top while scrolling
  },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box' // Prevents padding from breaking width
  },
  divider: { height: '1px', backgroundColor: '#ddd', margin: '20px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', marginBottom: '20px' },
  checkoutBtn: { 
    width: '100%',
    padding: '15px', 
    backgroundColor: '#27ae60', 
    color: 'white', 
    fontSize: '18px', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default CartPage;