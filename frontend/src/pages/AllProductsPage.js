import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import API from '../api'; 

gsap.registerPlugin(ScrollTrigger);

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const productList = Array.isArray(data) ? data : data.products || [];
        const powderList = productList.filter(p => p.category && p.category.toLowerCase() === 'powders');
        setProducts(powderList);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load products", err);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const compRef = useRef(null);

  useEffect(() => {
    if (isLoading) return;

    let ctx = gsap.context(() => {
      if (products.length > 0) {
        gsap.fromTo('.product-card',
          { y: 80, opacity: 0, rotationX: -15, scale: 0.95 },
          {
            scrollTrigger: { trigger: '.product-grid', start: "top 85%" },
            y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.2)"
          }
        );
      }
    }, compRef);

    return () => ctx.revert(); 
  }, [isLoading, products.length]);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.container}>
      
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
          }

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
        `}
      </style>

      {/* Added a clean page title to replace the one lost in the header deletion */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Our Fresh Harvest</h1>
      </div>

      <div style={styles.section}>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>Loading our fresh harvest...</p>
          </div>
        ) : (
          <div className="product-grid" style={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
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
                      <Link to={`/product/${product._id}`} className="card-btn" style={styles.cardBtn}>
                        View Details <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.9em' }} />
                      </Link>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>No products found at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { 
    fontFamily: "'Outfit', 'Segoe UI', sans-serif", 
    width: '100%', 
    minHeight: '100vh',
    color: '#0f172a',
    overflowX: 'clip'
  },
  pageHeader: {
    padding: '60px 20px 0 20px',
    textAlign: 'center'
  },
  pageTitle: { 
    color: '#0f172a', 
    margin: 0, 
    fontSize: '2.5rem', 
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  section: { 
    padding: '40px 20px 80px 20px', 
    maxWidth: '1300px', 
    margin: '0 auto', 
    boxSizing: 'border-box' 
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
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
    height: '260px',
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
    marginTop: 'auto' 
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
  }
};

export default AllProductsPage;