import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const LandingPage = () => {
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Agro Tech Harvest</h1>
        </div>
        <div>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
      </header>

      {/* Hero Content */}
      <div style={styles.hero}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Pure. Organic. Fresh.</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px' }}>
          We connect you directly to the farm. Experience the finest organic vegetables and authentic raw powders, delivered with care.
        </p>
        <Link to="/signup" style={styles.ctaButton}>Join the Harvest</Link>
      </div>

      {/* About Section */}
      <div style={styles.about}>
        <h2>Why Choose Us?</h2>
        <div style={styles.features}>
          <div style={styles.featureBox}>🌱 100% Organic</div>
          <div style={styles.featureBox}>🚜 Farm to Table</div>
          <div style={styles.featureBox}>🚀 Fast Delivery</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  loginBtn: { marginRight: '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  hero: {
    textAlign: 'center', padding: '50px 20px', backgroundColor: '#f9f9f9', color: '#333'
  },
  ctaButton: {
    padding: '15px 40px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.2rem',
    textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold'
  },
  about: { padding: '60px 20px', textAlign: 'center' },
  features: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' },
  featureBox: { padding: '30px', border: '1px solid #ddd', borderRadius: '10px', width: '200px', fontSize: '1.2rem' }
};

export default LandingPage;