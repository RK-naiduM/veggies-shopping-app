import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import API from '../api'; 

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [powders, setPowders] = useState([]);

  // --- 1. RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchPowders = async () => {
      try {
        const { data } = await API.get('/products');
        // Filter only powders as per requirements
        const powderList = data.filter(p => p.category.toLowerCase() === 'powders');
        setPowders(powderList);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchPowders();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '24px' }}>Agro Tech Harvest</h1>
        </div>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/about" style={{...styles.navLink, textDecoration: 'none'}}>About Us</Link>
          <button onClick={() => setShowContact(true)} style={styles.navBtn}>Contact Us</button>
        </nav>

        <div style={styles.authContainer}>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
      </header>

      {/* --- HERO --- */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Pure. Organic. Fresh.</h1>
        <p style={styles.heroText}>
          Experience the finest authentic raw powders, delivered directly from the farm to your doorstep.
        </p>
        <Link to="/signup" style={styles.ctaButton}>Join the Harvest</Link>
      </div>

      {/* --- PRODUCT GRID SECTION (No Arrows, Just List) --- */}
      <div style={styles.section}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px' }}>
          ✨ Our Premium Selections
        </h2>
        
        {/* THE GRID CONTAINER */}
        <div style={styles.productGrid}>
          {powders.length > 0 ? (
            powders.map((product) => (
              <div key={product._id} style={styles.productCard}>
                <img src={product.image} alt={product.name} style={styles.productImage} />
                
                <h3 style={styles.productTitle}>{product.name}</h3>
                
                {/* Optional: Add price if you want it to look exactly like the image provided */}
                {/* <p style={{color: '#27ae60', fontWeight: 'bold', margin: '5px 0'}}>₹{product.price}</p> */}

                <p style={styles.productDesc}>
                  {product.description.substring(0, 50)}...
                </p>
                
                <div style={styles.productFooter}>
                  <Link to={`/product/${product._id}`} style={styles.cardBtn}>View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
              Loading products...
            </p>
          )}
        </div>
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
                <span style={{ fontSize: '24px' }}>📍</span> <p>Suryapet, Telangana</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📞</span> <p>+91-9705116060</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>✉️</span> <p>Agrotecharvest@gmail.com</p>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- DYNAMIC STYLES FUNCTION ---
const getStyles = (isMobile) => ({
  container: { fontFamily: 'Arial, sans-serif', width: '100%', overflowX: 'hidden' },
  
  // Header
  header: {
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: isMobile ? '20px' : '0 40px', 
    minHeight: '80px', 
    backgroundColor: 'white', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', 
    position: 'relative', 
    zIndex: 100,
    gap: isMobile ? '15px' : '0'
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { 
    display: 'flex', 
    gap: '25px', 
    alignItems: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  authContainer: { marginTop: isMobile ? '10px' : '0' },
  navLink: { textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  navBtn: { background: 'none', border: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  loginBtn: { marginRight: '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  
  // Hero
  hero: { 
      textAlign: 'center', 
      padding: isMobile ? '40px 15px' : '50px 20px', 
      backgroundColor: '#f9f9f9', 
      color: '#333' 
  },
  heroTitle: { fontSize: isMobile ? '2.5rem' : '3.5rem', marginBottom: '20px' },
  heroText: { fontSize: isMobile ? '1rem' : '1.2rem', maxWidth: '600px', margin: '0 auto 40px' },
  ctaButton: { padding: '15px 40px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.2rem', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', display: 'inline-block' },

  // --- GRID SECTION STYLES (NEW) ---
  section: {
    padding: '60px 20px',
    backgroundColor: 'white',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  productGrid: {
    display: 'grid',
    // Logic: 1 column on mobile, exactly 3 columns on desktop
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
    gap: '30px', // Space between cards
    width: '100%',
    padding: '10px'
  },
  productCard: {
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)', // Slightly stronger shadow like the image
    backgroundColor: 'white',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Ensures all cards in a row are same height
    minHeight: '350px'
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover', // Ensures image covers area without stretching
    borderRadius: '8px',
    marginBottom: '15px'
  },
  productTitle: { fontSize: '18px', color: '#34495e', margin: '0 0 10px 0', fontWeight: 'bold' },
  productDesc: { fontSize: '14px', color: '#777', marginBottom: '15px', flexGrow: 1 }, // flexGrow pushes button down
  productFooter: { marginTop: 'auto' },
  cardBtn: { 
    display: 'block',
    width: '100%',
    padding: '10px 0', 
    backgroundColor: '#3498db', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '5px', 
    fontSize: '14px', 
    fontWeight: 'bold' 
  },

  // About Section
  about: { padding: '60px 20px', textAlign: 'center' },
  features: { 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      alignItems: 'center',
      justifyContent: 'center', 
      gap: '30px', 
      marginTop: '30px' 
  },
  featureBox: { 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '10px', 
      width: isMobile ? '100%' : '200px', 
      maxWidth: '300px',
      fontSize: '1.2rem',
      boxSizing: 'border-box'
  },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', position: 'relative', width: isMobile ? '100%' : '400px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', textAlign: 'left', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }
});

export default LandingPage;