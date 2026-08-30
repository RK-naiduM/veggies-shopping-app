import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSeedling, FaArrowRight, FaLeaf } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api';

gsap.registerPlugin(ScrollTrigger);

const CategoryPage = () => {
  // --- ORIGINAL STATE & LOGIC (UNTOUCHED) ---
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const { categoryName } = useParams(); 
  const [loading, setLoading] = useState(true); 

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); 
        const res = await API.get(`/products/category/${categoryName}`);
        setProducts(res.data);
        setLoading(false); 
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
    setSearchTerm(''); 
  }, [categoryName]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.header-anim',
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );

      // Staggered 3D Card Reveal
      if (filteredProducts.length > 0) {
        gsap.fromTo('.product-card',
          { y: 80, opacity: 0, rotationX: -15, scale: 0.95 },
          {
            scrollTrigger: { trigger: '.product-grid', start: "top 85%" },
            y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)"
          }
        );
      }

      // Empty State Reveal
      if (products.length === 0) {
        gsap.fromTo('.empty-state-anim',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
        );
      }

    }, compRef);

    return () => ctx.revert(); 
  }, [loading, filteredProducts.length, products.length]);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.container}>
      
      {/* --- UPGRADED THEME CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          /* Ambient floating background animation */
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
          }

          /* Input Focus Polish */
          .fancy-input { transition: all 0.3s ease; }
          .fancy-input:focus {
            outline: none;
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
          }

          /* 3D Product Card Hover */
          .product-grid {
            perspective: 1200px;
          }
          .product-card {
            transform-style: preserve-3d;
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .product-card:hover {
            transform: translateY(-12px) rotateX(3deg);
            box-shadow: 0 25px 50px rgba(0,0,0,0.1) !important;
            border-color: rgba(39, 174, 96, 0.3) !important;
          }
          .product-card:hover .product-image {
            transform: scale(1.1);
          }
          .product-card:hover .card-btn {
            background-color: #27ae60 !important;
            color: white !important;
            box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3) !important;
            transform: translateY(-2px);
          }

          /* Empty State Button Hovers */
          .btn-hover { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .btn-hover:hover { transform: translateY(-3px); }
          .primary-btn:hover { box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3) !important; }
          .secondary-btn:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
        `}
      </style>

      <div style={styles.contentWrapper}>
        
        {/* Header Section */}
        <div className="header-anim" style={styles.headerContainer}>
          <h2 style={styles.pageTitle}>
            <FaLeaf style={{ color: '#27ae60', fontSize: '0.9em' }} /> {categoryName}
          </h2>
          
          {products.length > 0 && (
              <input 
              type="text" 
              placeholder={`Search in ${categoryName}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="fancy-input"
              style={styles.searchInput}
              />
          )}
        </div>
        
        {/* Content Section */}
        <div style={styles.section}>
          
          {loading ? (
              <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>Loading fresh {categoryName}...</p>
              </div>
          ) : products.length === 0 ? (
            
            /* 🔴 FANCY "COMING SOON" UI */
            <div className="empty-state-anim" style={styles.emptyStateContainer}>
                <div style={styles.iconCircle}>
                    <FaSeedling size={50} color="#27ae60" />
                </div>
                <h2 style={styles.emptyTitle}>Fresh Harvest Coming Soon!</h2>
                <p style={styles.emptyText}>
                    We are currently sourcing the finest quality <strong style={{color: '#0f172a'}}>{categoryName}</strong> directly from the farms. 
                    <br />Check back shortly for new stock.
                </p>
                
                <div style={styles.suggestionBox}>
                    <p style={{ fontWeight: '600', color: '#64748b', marginBottom: '15px' }}>In the meantime, why not try:</p>
                    <div style={styles.buttonGroup}>
                        <Link to="/shop" className="btn-hover secondary-btn" style={styles.secondaryBtn}>Back to Dashboard</Link>
                        <Link to="/category/powders" className="btn-hover primary-btn" style={styles.primaryBtn}>
                            Explore Powders <FaArrowRight style={{ fontSize: '0.9em' }} />
                        </Link>
                    </div>
                </div>
            </div>

          ) : filteredProducts.length > 0 ? (
            
            /* Normal Product Grid */
            <div className="product-grid" style={styles.productGrid}>
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card" style={styles.productCard}>
                  
                  <div style={styles.imageWrapper}>
                      <img 
                          src={renderImageSrc(product.image)} 
                          alt={product.name} 
                          className="product-image"
                          style={styles.productImage} 
                      />
                      <div style={styles.imageOverlay}></div>
                  </div>
                  
                  <div style={styles.cardContent}>
                    <h3 style={styles.productTitle}>{product.name}</h3>
                    <p style={styles.productDesc}>
                      {product.description ? product.description.substring(0, 60) : 'Premium organic powder...'}...
                    </p>
                    
                    <div style={styles.productFooter}>
                      <p style={styles.price}>₹{product.price}</p>
                      <Link to={`/product/${product._id}`} className="card-btn" style={styles.cardBtn}>
                        View Details <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.9em' }} />
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          ) : (
              /* Search returns no results */
              <div style={styles.loadingContainer}>
                <h3 style={{ color: '#64748b', fontWeight: '600' }}>No products found for "{searchTerm}"</h3>
              </div>
          )}
        </div>

      </div>
    </div>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  container: { 
    fontFamily: "'Outfit', 'Segoe UI', sans-serif", 
    width: '100%', 
    minHeight: '100vh',
    color: '#0f172a',
    overflowX: 'clip'
  },
  contentWrapper: {
    maxWidth: '1300px',
    margin: '0 auto',
    padding: '40px 20px 80px 20px',
    boxSizing: 'border-box'
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    flexWrap: 'wrap',
    gap: '20px'
  },
  pageTitle: {
    color: '#0f172a',
    margin: 0,
    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textTransform: 'capitalize'
  },
  searchInput: {
    padding: '14px 20px',
    width: '100%',
    maxWidth: '350px',
    borderRadius: '50px',
    border: '1px solid #cbd5e1',
    backgroundColor: 'white',
    fontSize: '1rem',
    color: '#0f172a',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
  },
  section: { 
    width: '100%' 
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh',
    width: '100%'
  },
  loadingText: { 
    textAlign: 'center', 
    color: '#64748b', 
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Wide, premium cards
    gap: '40px', 
    width: '100%' 
  },
  productCard: { 
    border: '1px solid rgba(255,255,255,0.8)', 
    borderRadius: '24px', 
    padding: '20px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    cursor: 'pointer'
  },
  imageWrapper: { 
    position: 'relative',
    width: '100%', 
    height: '240px', 
    marginBottom: '20px', 
    overflow: 'hidden', 
    borderRadius: '16px' 
  },
  productImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
    zIndex: 1,
    pointerEvents: 'none'
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: '0 10px'
  },
  productTitle: { 
    fontSize: '1.4rem', 
    color: '#0f172a', 
    margin: '0 0 10px 0', 
    fontWeight: '800' 
  },
  productDesc: { 
    fontSize: '1rem', 
    color: '#64748b', 
    marginBottom: '25px', 
    flexGrow: 1, 
    lineHeight: '1.6' 
  },
  productFooter: { 
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  price: {
    fontSize: '1.6rem', 
    color: '#0f172a', 
    fontWeight: '800',
    margin: '0'
  },
  cardBtn: { 
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    padding: '14px 0', 
    backgroundColor: '#f8fafc', 
    color: '#e67e22', 
    textDecoration: 'none', 
    borderRadius: '50px', 
    fontSize: '1rem', 
    fontWeight: '800', 
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    border: '1px solid #e2e8f0'
  },

  // --- EMPTY STATE STYLES ---
  emptyStateContainer: {
      textAlign: 'center',
      padding: '60px 40px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      maxWidth: '700px',
      width: '100%',
      margin: '40px auto',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
  },
  iconCircle: {
      width: '100px',
      height: '100px',
      backgroundColor: '#f0fdf4', // Soft green tint
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 25px auto',
      boxShadow: '0 10px 25px rgba(39, 174, 96, 0.15)'
  },
  emptyTitle: {
      color: '#0f172a',
      marginBottom: '15px',
      fontSize: '2rem',
      fontWeight: '800',
      letterSpacing: '-0.5px'
  },
  emptyText: {
      color: '#64748b',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      marginBottom: '40px'
  },
  suggestionBox: {
      borderTop: '1px solid rgba(0,0,0,0.05)',
      paddingTop: '30px'
  },
  buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap'
  },
  primaryBtn: {
      backgroundColor: '#27ae60',
      color: 'white',
      padding: '14px 30px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: '800',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)'
  },
  secondaryBtn: {
      backgroundColor: 'white',
      color: '#475569',
      border: '1px solid #cbd5e1',
      padding: '14px 30px',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: '700'
  }
};

export default CategoryPage;