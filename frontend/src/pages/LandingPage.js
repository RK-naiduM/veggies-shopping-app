import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import API from '../api'; 

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inventory, setInventory] = useState({ vegetables: [], powders: [] });

  // This fetches REAL data from your database every time the page loads
  useEffect(() => {
    const fetchForDropdown = async () => {
      try {
        const { data } = await API.get('/products');
        
        // Grouping logic
        const veg = data.filter(p => p.category.toLowerCase() === 'vegetables');
        const pow = data.filter(p => p.category.toLowerCase() === 'powders');
        
        setInventory({ vegetables: veg, powders: pow });
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };
    fetchForDropdown();
  }, []);

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '24px' }}>Agro Tech Harvest</h1>
        </div>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          
          {/* DROPDOWN CONTAINER */}
          <div 
            style={styles.dropdownContainer}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            {/* Added padding to this span to make the target area bigger */}
            <span style={{ ...styles.navLink, cursor: 'default', padding: '15px 0' }}>
              Products ▾
            </span>
            
            {showDropdown && (
              <div style={styles.dropdownMenu}>
                <div style={styles.dropdownColumn}>
                  <h4 style={styles.colTitle}>🥦 Vegetables</h4>
                  {inventory.vegetables.length > 0 ? inventory.vegetables.map(p => (
                    <div key={p._id} style={styles.dropItem}>
                      <strong>{p.name}</strong>
                      <span style={styles.dropDesc}>{p.description.substring(0, 30)}...</span>
                    </div>
                  )) : <p style={{fontSize: '12px'}}>No vegetables yet.</p>}
                </div>
                
                <div style={styles.divider}></div>

                <div style={styles.dropdownColumn}>
                  <h4 style={styles.colTitle}>🥡 Raw Powders</h4>
                  {inventory.powders.length > 0 ? inventory.powders.map(p => (
                    <div key={p._id} style={styles.dropItem}>
                      <strong>{p.name}</strong>
                      <span style={styles.dropDesc}>{p.description.substring(0, 30)}...</span>
                    </div>
                  )) : <p style={{fontSize: '12px'}}>No powders yet.</p>}
                </div>
              </div>
            )}
          </div>

          <Link to="/about" style={{...styles.navBtn, textDecoration: 'none'}}>About Us</Link>
          <button onClick={() => setShowContact(true)} style={styles.navBtn}>Contact Us</button>
        </nav>

        <div>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
      </header>

      {/* --- HERO --- */}
      <div style={styles.hero}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Pure. Organic. Fresh.</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
          We connect you directly to the farm. Experience the finest organic vegetables and authentic raw powders, delivered with care.
        </p>
        <Link to="/signup" style={styles.ctaButton}>Join the Harvest</Link>
      </div>

      {/* --- ABOUT --- */}
      <div style={styles.about}>
        <h2>Why Choose Us?</h2>
        <div style={styles.features}>
          <div style={styles.featureBox}>🌱 100% Organic</div>
          <div style={styles.featureBox}>🚜 Farm to Table</div>
          <div style={styles.featureBox}>🚀 Fast Delivery</div>
        </div>
      </div>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowContact(false)} style={styles.closeBtn}>×</button>
            <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>Contact Us</h2>
            <div style={styles.contactRow}>
              <span style={{ fontSize: '24px' }}>📍</span> 
              <p>123 Green Street, Farmers Market</p>
            </div>
            <div style={styles.contactRow}>
              <span style={{ fontSize: '24px' }}>📞</span> 
              <p>+1 234 567 890</p>
            </div>
            <div style={styles.contactRow}>
              <span style={{ fontSize: '24px' }}>✉️</span> 
              <p>support@Agrotechharvest.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- UPDATED STYLES FOR SMOOTH HOVER ---
const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', // Reduced vertical padding so the nav fits tighter
    height: '80px', // Fixed height helps with alignment
    backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    position: 'relative', 
    zIndex: 100
  },
  
  nav: { display: 'flex', gap: '25px', alignItems: 'center', height: '100%' },
  navLink: { textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  navBtn: { background: 'none', border: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  
  loginBtn: { marginRight: '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  
  // --- FIXED DROPDOWN STYLES ---
  dropdownContainer: { 
    position: 'relative', 
    height: '100%', 
    display: 'flex', 
    alignItems: 'center',
    cursor: 'pointer'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%', // Sticks exactly to the bottom of the header
    left: '-50%', 
    transform: 'translateX(-25%)', // Centers it better
    backgroundColor: 'white',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    border: '1px solid #eee',
    borderRadius: '0 0 8px 8px', // Round only bottom corners
    padding: '20px',
    display: 'flex',
    gap: '20px',
    width: '500px',
    zIndex: 1000
  },
  dropdownColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' },
  colTitle: { borderBottom: '2px solid #27ae60', paddingBottom: '5px', marginBottom: '10px', color: '#2c3e50' },
  divider: { width: '1px', backgroundColor: '#eee' },
  dropItem: { display: 'flex', flexDirection: 'column', fontSize: '14px', marginBottom: '8px' },
  dropDesc: { fontSize: '12px', color: '#777' },

  // Hero
  hero: {
    textAlign: 'center', 
    padding: '50px 20px', 
    backgroundColor: '#f9f9f9', 
    color: '#333'
  },
  ctaButton: {
    padding: '15px 40px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.2rem',
    textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold'
  },
  
  about: { padding: '60px 20px', textAlign: 'center' },
  features: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' },
  featureBox: { padding: '30px', border: '1px solid #ddd', borderRadius: '10px', width: '200px', fontSize: '1.2rem' },

  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 2000
  },
  modalContent: {
    backgroundColor: 'white', padding: '40px', borderRadius: '10px',
    position: 'relative', width: '400px', textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  closeBtn: {
    position: 'absolute', top: '10px', right: '15px',
    background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer'
  },
  contactRow: {
    display: 'flex', alignItems: 'center', gap: '15px',
    marginBottom: '15px', textAlign: 'left',
    padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px'
  }
};

export default LandingPage;