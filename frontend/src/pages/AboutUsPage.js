import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaHandshake, FaGlobeAmericas, FaArrowLeft } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div style={styles.container}>
      
      {/* Navigation Helper */}
      <div style={styles.navBar}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>Cultivating a Healthier Future</h1>
        <p style={styles.subtitle}>
          At Agro Tech Harvest, we believe that good food starts with good soil, honest farmers, and a passion for purity.
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={styles.content}>
        
        {/* Section 1: Our Story */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Our Story</h2>
          <p style={styles.text}>
            Founded with a vision to revolutionize how fresh produce reaches your table, Agro Tech Harvest started as a small initiative to support local organic farmers. 
            We noticed a gap in the market: consumers wanted authentic, chemical-free food, but farmers struggled to reach them directly.
            <br /><br />
            Today, we are a bridge between the farm and your fork, ensuring that every vegetable and powder you buy is traced back to its roots.
          </p>
        </section>

        {/* Section 2: Values Cards */}
        <section style={styles.valuesSection}>
          <div style={styles.card}>
            <FaLeaf style={styles.icon} />
            <h3>100% Organic</h3>
            <p>We strictly strictly source produce grown without synthetic pesticides or GMOs.</p>
          </div>
          <div style={styles.card}>
            <FaHandshake style={styles.icon} />
            <h3>Fair Trade</h3>
            <p>We ensure our farmers receive fair compensation for their hard work and dedication.</p>
          </div>
          <div style={styles.card}>
            <FaGlobeAmericas style={styles.icon} />
            <h3>Sustainable</h3>
            <p>Our packaging and logistics are designed to minimize carbon footprint and waste.</p>
          </div>
        </section>

        {/* Section 3: Our Mission */}
        <section style={styles.sectionAlt}>
          <h2 style={styles.heading}>Our Mission</h2>
          <p style={styles.text}>
            "To empower communities with access to nutrient-dense, safe, and affordable organic food while preserving the environment for future generations."
          </p>
        </section>

      </div>

      {/* Footer Call to Action */}
      <div style={styles.footer}>
        <h3>Ready to taste the difference?</h3>
        <Link to="/signup" style={styles.ctaBtn}>Shop Now</Link>
      </div>

    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    lineHeight: '1.6',
  },
  navBar: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  backLink: {
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px'
  },
  hero: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '20px',
  },
  subtitle: {
    fontSize: '1.2rem',
    maxWidth: '700px',
    margin: '0 auto',
    opacity: '0.9',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  section: {
    marginBottom: '60px',
    textAlign: 'center',
  },
  sectionAlt: {
    backgroundColor: '#f0fdf4', // Light green background
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    marginTop: '60px',
  },
  heading: {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '20px',
    borderBottom: '3px solid #e67e22',
    display: 'inline-block',
    paddingBottom: '10px'
  },
  text: {
    fontSize: '1.1rem',
    color: '#555',
    maxWidth: '800px',
    margin: '0 auto',
  },
  valuesSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginTop: '40px',
  },
  card: {
    flex: '1',
    minWidth: '250px',
    padding: '30px',
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #eee'
  },
  icon: {
    fontSize: '40px',
    color: '#27ae60',
    marginBottom: '15px',
  },
  footer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#333',
    color: 'white',
  },
  ctaBtn: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 30px',
    backgroundColor: '#e67e22',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderRadius: '25px',
    fontSize: '1.1rem',
  }
};

export default AboutUsPage;