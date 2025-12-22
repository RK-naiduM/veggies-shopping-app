import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; // <--- 1. IMPORT LOGO

const HomePage = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        
        {/* 2. REPLACED TEXT WITH LOGO IMAGE */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
          <img src={logo} alt="Agro Tech Harvest Logo" style={{ width: '80px', height: 'auto' }} />
          <h1 style={styles.title}>Welcome to Agro Tech Harvest</h1>
        </div>

        <p style={styles.subtitle}>
          Fresh Vegetables & Pure Organic Powders delivered to your doorstep.
        </p>
        {/* <Link to="/category/vegetables" style={styles.ctaButton}>
          Start Shopping
        </Link> */}
      </div>

      {/* Categories Section */}
      <div style={styles.categorySection}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>Shop by Category</h2>
        
        <div style={styles.cardContainer}>
          {/* Card 1: Vegetables */}
          <div style={styles.card}>
            <h3>🥕 Fresh Vegetables</h3>
            <p>Farm fresh organic veggies.</p>
            <Link to="/category/vegetables" style={styles.linkButton}>Browse Veggies</Link>
          </div>

          {/* Card 2: Powders */}
          <div style={styles.card}>
            <h3>🥣 Raw Powders</h3>
            <p>Pure turmeric, chilli, and more.</p>
            <Link to="/category/powders" style={styles.linkButton}>Browse Powders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
  },
  hero: {
    backgroundColor: '#f9f9f9', // Green background
    color: 'white',
    padding: '50px 20px',
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '3rem',
    color: '#27ae60',
    margin: 0 // Removed margin since the flexbox handles spacing
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#27ae60',
    marginBottom: '30px',
    opacity: '0.9'
  },
  ctaButton: {
    backgroundColor: 'white',
    color: '#27ae60',
    padding: '12px 30px',
    borderRadius: '25px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    display: 'inline-block'
  },
  categorySection: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginTop: '30px',
    flexWrap: 'wrap'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '30px',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  linkButton: {
    display: 'inline-block',
    marginTop: '15px',
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none'
  }
};

export default HomePage;