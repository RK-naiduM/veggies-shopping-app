import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'; 
import logo from '../assets/logo.png';
import API from '../api'; 

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [powders, setPowders] = useState([]);
  
  // We track the index of the FIRST product on the current page
  const [startIndex, setStartIndex] = useState(0);


  useEffect(() => {
    const fetchPowders = async () => {
      try {
        const { data } = await API.get('/products');
        
        const powderList = data.filter(p => p.category.toLowerCase() === 'powders');
        setPowders(powderList);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchPowders();
  }, []);


  // --- 2. PAGINATION LOGIC (The Magic Part) ---
  const itemsPerPage = 3;

  const nextSlide = () => {
    // If adding 3 goes beyond the list, loop back to 0
    if (startIndex + itemsPerPage >= powders.length) {
      setStartIndex(0);
    } else {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    // If going back 3 is less than 0, loop to the very last page
    if (startIndex - itemsPerPage < 0) {
      // Calculate the starting index of the last possible page
      const lastPageIndex = Math.floor((powders.length - 1) / itemsPerPage) * itemsPerPage;
      setStartIndex(lastPageIndex);
    } else {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  // Get exactly the 3 items we want to show right now
  const visibleProducts = powders.slice(startIndex, startIndex + itemsPerPage);



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
          
          <Link to="/about" style={{...styles.navLink, textDecoration: 'none'}}>About Us</Link>
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
          Experience the finest authentic raw powders, delivered directly from the farm to your doorstep.
        </p>
        <Link to="/signup" style={styles.ctaButton}>Join the Harvest</Link>
      </div>



      {/* --- CAROUSEL SECTION --- */}
      <div style={styles.carouselSection}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px' }}>
          ✨ Our Premium Selections
        </h2>
        
        <div style={styles.carouselWrapper}>
          
          {/* UP ARROW (Previously Left) */}
          <button onClick={prevSlide} style={styles.topArrowBtn}>
            <FaChevronUp />
          </button>

          {/* THE GRID (Now stacking vertically) */}
          <div style={styles.productGrid}>
            
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product) => (
                <div key={product._id} style={styles.productCard}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={styles.productImage} 
                  />
                  
                  <div style={{padding: '0 10px'}}>
                    <h3 style={styles.productTitle}>{product.name}</h3>
                    <p style={styles.productDesc}>
                      {product.description.substring(0, 50)}...
                    </p>
                    
                    <div style={styles.productFooter}>
                      <Link to={`/product/${product._id}`} style={styles.cardBtn}>View</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Loading products...</p>
            )}

          </div>

          {/* DOWN ARROW (Previously Right) */}
          <button onClick={nextSlide} style={styles.bottomArrowBtn}>
            <FaChevronDown />
          </button>

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


const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', height: '80px', backgroundColor: 'white', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative', zIndex: 100
  },
  
  nav: { display: 'flex', gap: '25px', alignItems: 'center' },
  navLink: { textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  navBtn: { background: 'none', border: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  
  loginBtn: { marginRight: '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  

  hero: { textAlign: 'center', padding: '50px 20px', backgroundColor: '#f9f9f9', color: '#333' },
  ctaButton: { padding: '15px 40px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.2rem', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold' },

  // --- NEW CAROUSEL STYLES ---
  carouselSection: {
    padding: '60px 20px',
    backgroundColor: 'white',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  carouselWrapper: {
    position: 'relative',
    padding: '50px 0', // Changed padding to top/bottom for arrows
    display: 'flex',
    flexDirection: 'column', // <--- MAKES IT VERTICAL
    alignItems: 'center',    // Centers items horizontally
    gap: '20px'
  },
  productGrid: {
    display: 'flex',
    flexDirection: 'column', // <--- STACKS CARDS VERTICALLY
    gap: '20px',
    width: '100%',
    alignItems: 'center',    // Centers the cards
  },
  productCard: {
    width: '100%',           
    maxWidth: '500px',       // Limits width so they don't look stretched
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    textAlign: 'center',
    // Optional: Make the card content horizontal (Image left, text right)
    // display: 'flex', 
    // flexDirection: 'row', 
    // alignItems: 'center'
  },
  productImage: {
    width: '100%',           // Or fixed width (e.g., '150px') if using row layout
    height: '250px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  productTitle: {
    fontSize: '18px',
    color: '#34495e',
    margin: '0 0 10px 0',
  },
  productDesc: {
    fontSize: '14px',
    color: '#777',
    marginBottom: '15px',
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'center', // Center the button
    marginTop: 'auto'
  },
  cardBtn: {
    padding: '8px 25px', 
    backgroundColor: '#3498db', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '5px', 
    fontSize: '14px', 
    fontWeight: 'bold'
  },
  
  // SHARED ARROW STYLE
  arrowBtnBase: {
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 10,
    fontSize: '18px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)' // Centers arrow horizontally
  },

  // Combine base style with specific positions
  get topArrowBtn() {
    return { ...this.arrowBtnBase, top: '0' };
  },
  get bottomArrowBtn() {
    return { ...this.arrowBtnBase, bottom: '0' };
  },
  

  about: { padding: '60px 20px', textAlign: 'center' },
  features: { display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' },
  featureBox: { padding: '30px', border: '1px solid #ddd', borderRadius: '10px', width: '200px', fontSize: '1.2rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', position: 'relative', width: '400px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', textAlign: 'left', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }
};

export default LandingPage;