import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLeaf, FaExclamationTriangle, FaIndustry, FaUtensils, FaInfoCircle } from 'react-icons/fa';
import gsap from 'gsap';
import API from '../api';

const ProductDetails = ({ addToCart }) => {
  // --- ORIGINAL STATE & LOGIC (UNTOUCHED) ---
  const { id } = useParams();
  const navigate = useNavigate(); // Kept because it's used for the Add to Cart redirect
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get('/products');
        const foundProduct = res.data.find(p => p._id === id);
        setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const formatList = (text) => {
    if (!text) return null;
    return text.split('\n').map((item, index) => (
      <li key={index} className="stagger-anim" style={styles.benefitItem}>
        <FaCheckCircle style={{ color: '#27ae60', marginRight: '12px', flexShrink: 0, fontSize: '1.2em' }} />
        <span>{item}</span>
      </li>
    ));
  };

  const formatBadges = (text) => {
    if (!text) return null;
    return text.split('\n').map((item, index) => (
      <span key={index} className="stagger-anim" style={styles.badge}>
         ✨ {item}
      </span>
    ));
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (!product) return;

    let ctx = gsap.context(() => {
      // 1. Image 3D Reveal
      gsap.fromTo('.image-anim',
        { opacity: 0, x: -50, rotationY: -15, scale: 0.9 },
        { opacity: 1, x: 0, rotationY: 0, scale: 1, duration: 1, ease: "power3.out" }
      );

      // 2. Details Container Fade In
      gsap.fromTo('.details-container',
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // 3. Staggered Text & Block Reveals
      gsap.fromTo('.stagger-anim',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "back.out(1.2)", delay: 0.2 }
      );

    }, compRef);

    return () => ctx.revert();
  }, [product]);


  if (!product) return (
    <div className="ambient-bg" style={styles.loadingContainer}>
      <p style={styles.loadingText}>Loading product details...</p>
    </div>
  );

  // --- LOGIC ---
  const MAX_PER_ORDER = 10; 
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const effectiveLimit = Math.min(product.stock, MAX_PER_ORDER);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
      {/* --- UPGRADED THEME CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
            min-height: 100vh;
          }

          /* Image Hover Polish */
          .image-section {
            perspective: 1000px;
          }
          .product-image {
            transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .image-section:hover .product-image {
            transform: scale(1.02) rotateY(2deg);
            box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
          }

          /* Buttons */
          .qty-btn { transition: all 0.2s; }
          .qty-btn:hover:not(:disabled) { background-color: #f1f5f9; color: #27ae60; }
          
          .add-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .add-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(39, 174, 96, 0.4) !important;
          }
        `}
      </style>

      <div style={styles.container}>
        
        {/* --- LEFT: IMAGE SECTION --- */}
        <div className="image-section image-anim" style={styles.imageSection}>
          <div style={styles.imageWrapper}>
            <img 
              src={renderImageSrc(product.image)} 
              alt={product.name} 
              className="product-image"
              style={styles.image} 
            />
            <div style={styles.imageOverlay}></div>
          </div>
        </div>

        {/* --- RIGHT: DETAILS SECTION --- */}
        <div className="details-container" style={styles.details}>
          
          {/* 1. HEADER & HIGHLIGHTS */}
          <p className="stagger-anim" style={styles.categoryTag}>{product.category}</p>
          <h1 className="stagger-anim" style={styles.title}>{product.name}</h1>
          

          {/* 🔴 NEW: Highlights as Badges */}
          {product.highlights && (
             <div style={styles.badgeContainer}>
               {formatBadges(product.highlights)}
             </div>
          )}
          
          {/* 2. PRICE & STOCK CARD */}
          <div className="stagger-anim" style={styles.priceCard}>
              <div style={{display:'flex', alignItems:'flex-end', gap:'12px', marginBottom: '8px'}}>
                 <h2 style={styles.price}>₹{product.price}</h2>
                 <span style={styles.taxNote}>(Inclusive of all taxes)</span>
              </div>

              <div>
                {isOutOfStock ? (
                  <span style={styles.stockBadgeOut}>Out of Stock</span>
                ) : (
                  <span style={styles.stockBadgeIn}>In Stock {isLowStock && <span style={{color: '#e67e22', marginLeft: '5px'}}>(Only {product.stock} left!)</span>}</span>
                )}
              </div>
          </div>

          {/* 3. ABOUT (Clean Text) */}
          <div className="stagger-anim" style={styles.sectionBlock}>
            <h3 style={styles.sectionTitle}><FaInfoCircle color="#64748b" /> About This Product</h3>
            <p style={styles.text}>{product.description}</p>
            {product.about && <p style={{...styles.text, marginTop:'15px'}}>{product.about}</p>}
          </div>

          {/* 4. KEY BENEFITS (Fancy Checkmark List) */}
          {product.keyBenefits && (
            <div className="stagger-anim" style={styles.sectionBlock}>
              <h3 style={styles.sectionTitle}><FaLeaf color="#27ae60" /> Key Benefits</h3>
              <ul style={styles.benefitList}>
                {formatList(product.keyBenefits)}
              </ul>
            </div>
          )}

          {/* 5. USAGE & MANUFACTURING (Two Column Grid) */}
          <div className="stagger-anim" style={styles.infoGrid}>
              
              {/* Usage Box */}
              {product.usageInfo && (
                <div style={styles.infoBoxBlue}>
                  <h4 style={styles.boxTitle}><FaUtensils color="#3b82f6"/> How to Use</h4>
                  <p style={styles.smallText}>{product.usageInfo}</p>
                  {product.recommendeddosage && (
                     <p style={{...styles.smallText, marginTop: '10px', fontWeight:'700', color: '#0f172a'}}>
                       Dosage: {product.recommendeddosage}
                     </p>
                  )}
                </div>
              )}

              {/* Manufacturing Box */}
              {product.manufacturingInfo && (
                <div style={styles.infoBoxGray}>
                  <h4 style={styles.boxTitle}><FaIndustry color="#64748b"/> Manufacturing</h4>
                  <p style={styles.smallText}>{product.manufacturingInfo}</p>
                </div>
              )}
          </div>

          {/* 6. SAFETY WARNING (Red Alert Box) */}
          {product.safetyInfo && (
            <div className="stagger-anim" style={styles.warningBox}>
              <FaExclamationTriangle style={{ fontSize: '24px', flexShrink:0 }} />
              <div>
                 <strong style={{display:'block', marginBottom:'5px', fontSize: '1rem'}}>Safety Information</strong>
                 <span style={styles.smallTextWarning}>{product.safetyInfo}</span>
              </div>
            </div>
          )}

          {/* --- CONTROLS FOOTER --- */}
          <div className="stagger-anim" style={styles.controls}>
              {!isOutOfStock && (
                <div style={styles.quantityWrapper}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="qty-btn" style={styles.qtyBtn}>-</button>
                  <span style={styles.qtyNum}>{quantity}</span>
                  <button 
                     onClick={() => setQuantity(q => Math.min(effectiveLimit, q + 1))} 
                     className="qty-btn"
                     style={{...styles.qtyBtn, opacity: quantity >= effectiveLimit ? 0.3 : 1, cursor: quantity >= effectiveLimit ? 'not-allowed' : 'pointer'}}
                     disabled={quantity >= effectiveLimit}
                  >+</button>
                </div>
              )}

              <button 
                className="add-btn"
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/cart'); // User is redirected here without changing how your app works
                }}
                disabled={isOutOfStock}
                style={{
                  ...styles.addToCartBtn,
                  background: isOutOfStock ? '#cbd5e1' : '#27ae60',
                  color: isOutOfStock ? '#64748b' : 'white',
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                  boxShadow: isOutOfStock ? 'none' : '0 8px 20px rgba(39, 174, 96, 0.25)'
                }}
              >
                {isOutOfStock ? 'Notify Me When Available' : `Add ${quantity} Item${quantity > 1 ? 's' : ''} to Cart`}
              </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  pageWrapper: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    color: '#0f172a',
    overflowX: 'hidden'
  },
  container: {
    padding: '60px 40px 100px 40px', // Added 20px extra top padding to account for the removed header
    maxWidth: '1300px',
    margin: '0 auto',
    display: 'flex',
    gap: '60px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  imageSection: {
    flex: '1 1 450px',
    position: 'sticky',
    top: '100px'
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
  },
  image: {
    width: '100%',
    display: 'block',
    objectFit: 'cover',
    borderRadius: '24px' // Fallback for wrapper overflow
  },
  imageOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.05), transparent)',
    pointerEvents: 'none'
  },
  details: {
    flex: '1 1 550px',
    paddingTop: '10px'
  },
  categoryTag: {
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    fontSize: '0.85rem',
    color: '#e67e22',
    fontWeight: '800',
    margin: '0 0 10px 0'
  },
  title: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    color: '#0f172a',
    margin: '0 0 20px 0',
    lineHeight: '1.1',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  badgeContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '30px'
  },
  badge: {
    backgroundColor: '#f1f5f9',
    color: '#27ae60',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '700',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
  },
  priceCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '25px',
    borderRadius: '20px',
    marginBottom: '40px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
  },
  price: {
    fontSize: '2.5rem',
    color: '#0f172a',
    margin: 0,
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  taxNote: {
    fontSize: '0.9rem',
    color: '#64748b',
    fontWeight: '500',
    paddingBottom: '8px'
  },
  stockBadgeIn: {
    color: '#27ae60',
    fontWeight: '700',
    fontSize: '1rem',
    display: 'flex', alignItems:'center', gap:'5px',
    marginTop: '10px'
  },
  stockBadgeOut: {
    color: '#ef4444',
    fontWeight: '800',
    fontSize: '1rem',
    marginTop: '10px',
    display: 'inline-block'
  },
  sectionBlock: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    color: '#0f172a',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '800',
    borderBottom: '2px solid rgba(0,0,0,0.05)',
    paddingBottom: '12px'
  },
  text: {
    lineHeight: '1.8',
    color: '#475569',
    fontSize: '1.05rem'
  },
  benefitList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '15px',
    fontSize: '1.05rem',
    color: '#334155',
    lineHeight: '1.6',
    fontWeight: '500'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  infoBoxBlue: {
    background: '#f0f9ff',
    padding: '25px',
    borderRadius: '20px',
    border: '1px solid #e0f2fe'
  },
  infoBoxGray: {
    background: '#f8fafc',
    padding: '25px',
    borderRadius: '20px',
    border: '1px solid #f1f5f9'
  },
  boxTitle: {
    fontSize: '1.1rem',
    margin: '0 0 15px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#0f172a',
    fontWeight: '800'
  },
  smallText: {
    fontSize: '0.95rem',
    color: '#475569',
    margin: 0,
    lineHeight: '1.6'
  },
  warningBox: {
    background: '#fef2f2',
    color: '#b91c1c',
    padding: '25px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '40px',
    border: '1px solid #fee2e2'
  },
  smallTextWarning: {
    fontSize: '0.95rem',
    color: '#991b1b',
    lineHeight: '1.6',
    display: 'block'
  },
  controls: {
    display: 'flex',
    gap: '20px',
    paddingTop: '30px',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    alignItems: 'stretch', 
    flexWrap: 'wrap'
  },
  quantityWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '50px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
  },
  qtyBtn: {
    background: 'transparent',
    border: 'none',
    padding: '0 25px',
    height: '100%',
    fontSize: '1.4rem',
    cursor: 'pointer',
    color: '#0f172a',
    fontWeight: '600'
  },
  qtyNum: {
    padding: '0 15px',
    fontWeight: '800',
    fontSize: '1.2rem',
    color: '#0f172a',
    minWidth: '40px',
    textAlign: 'center'
  },
  addToCartBtn: {
    flex: 1,
    minWidth: '200px',
    padding: '18px 30px',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '800',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100%'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1.3rem',
    fontWeight: '600'
  }
};

export default ProductDetails;