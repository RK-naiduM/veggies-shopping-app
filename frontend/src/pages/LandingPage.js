import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLeaf, FaFlask, FaCertificate, FaBan, FaArrowRight, 
  FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import farmBg1 from '../assets/farm-bg.png';
import farmBg2 from '../assets/farm-bg-2.png'; 
import farmBg3 from '../assets/farm-bg-3.png';
import API from '../api'; 

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const [currentBg, setCurrentBg] = useState(0);
  const heroImages = [farmBg1, farmBg2, farmBg3];

  // Product State
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Blog State
  const [blogs, setBlogs] = useState([]);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    // Fetch both Products and Blogs simultaneously
    const fetchData = async () => {
      try {
        const [prodRes, blogRes] = await Promise.all([
          API.get('/products'),
          API.get('/blogs')
        ]);

        // Process Products
        const productList = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.products || [];
        const powderList = productList.filter(p => p.category && p.category.toLowerCase() === 'powders');
        setProducts(powderList);
        setIsLoading(false);

        // Process Blogs
        setBlogs(blogRes.data);
        setIsLoadingBlogs(false);

      } catch (err) {
        console.error("Failed to load data", err);
        setIsLoading(false);
        setIsLoadingBlogs(false);
      }
    };
    fetchData();
    
    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(bgInterval); 
    };
  }, [heroImages.length]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const itemsToShow = isMobile ? 1 : 3;
  
  // Product Carousel Controls
  const nextSlide = () => {
    if (currentIndex + itemsToShow < products.length) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(0); 
  };

  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    else setCurrentIndex(Math.max(0, products.length - itemsToShow)); 
  };

  // Blog Carousel Controls
  const nextBlogSlide = () => {
    if (currentBlogIndex + itemsToShow < blogs.length) setCurrentBlogIndex(currentBlogIndex + 1);
    else setCurrentBlogIndex(0); 
  };

  const prevBlogSlide = () => {
    if (currentBlogIndex > 0) setCurrentBlogIndex(currentBlogIndex - 1);
    else setCurrentBlogIndex(Math.max(0, blogs.length - itemsToShow)); 
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsToShow);
  const visibleBlogs = blogs.slice(currentBlogIndex, currentBlogIndex + itemsToShow);
  const styles = getStyles(isMobile);

  const compRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.hero-anim', 
        { y: 80, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, stagger: 0.2, ease: "power4.out", delay: 0.2 }
      );

      gsap.to('.hero-bg-parallax', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: { trigger: '.hero-wrapper', start: "top top", end: "bottom top", scrub: true }
      });

      gsap.utils.toArray('.section-title-anim').forEach(title => {
        gsap.fromTo(title,
          { scale: 0.8, opacity: 0, y: 30 },
          { scrollTrigger: { trigger: title, start: "top 85%" }, scale: 1, opacity: 1, y: 0, duration: 1, ease: "back.out(1.5)" }
        );
      });

      // Product Carousel Animation
      if (products.length > 0) {
        gsap.fromTo('.product-overlapping-card',
          { y: 100, opacity: 0, rotationX: -15 }, 
          { scrollTrigger: { trigger: '.product-carousel-track', start: "top 80%" }, y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
      }

      // Blog Carousel Animation
      if (blogs.length > 0) {
        gsap.fromTo('.blog-overlapping-card',
          { y: 100, opacity: 0, rotationX: -15 }, 
          { scrollTrigger: { trigger: '.blog-carousel-track', start: "top 80%" }, y: 0, opacity: 1, rotationX: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        );
      }

      gsap.fromTo('.trust-badge',
        { rotationY: 90, opacity: 0 },
        { scrollTrigger: { trigger: '.trust-grid', start: "top 80%" }, rotationY: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out" }
      );

      gsap.fromTo('.story-section-content',
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: '.story-section', start: "top 75%" }, y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }, compRef);

    return () => ctx.revert(); 
  }, [isLoading, products.length, isLoadingBlogs, blogs.length]); 

  return (
    <div ref={compRef} style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .ambient-bg { background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb); background-size: 400% 400%; animation: gradientFloat 15s ease infinite; }

          .hero-cta-btn { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; }
          .hero-cta-btn:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 15px 30px rgba(230, 126, 34, 0.5) !important; }
          
          .carousel-track { perspective: 1000px; }
          .overlapping-card { transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
          .overlapping-card:hover { transform: translateY(-15px) rotateX(2deg) rotateY(2deg); }
          .overlapping-card:hover .image-tile img { transform: scale(1.15) translateY(-5px); }
          .overlapping-card:hover .desc-tile { transform: translateY(-10px) translateZ(30px); box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important; }

          .carousel-arrow { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important; }
          .carousel-arrow:hover { background-color: #27ae60 !important; color: white !important; transform: translateY(-50%) scale(1.2) !important; box-shadow: 0 10px 20px rgba(39, 174, 96, 0.4) !important; }
          
          .trust-badge { transition: transform 0.3s ease; }
          .trust-badge:hover { transform: translateY(-10px); }
          .trust-badge:hover .icon-circle { background-color: #27ae60 !important; color: white !important; transform: scale(1.1) rotate(10deg); box-shadow: 0 15px 30px rgba(39, 174, 96, 0.3) !important; }
          .icon-circle { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        `}
      </style>

      {/* --- HERO SECTION --- */}
      <div className="hero-wrapper" style={styles.heroWrapper}>
        <div className="hero-bg-parallax" style={{ position: 'absolute', top: '-10%', left: 0, width: '100%', height: '120%', zIndex: 1 }}>
          {heroImages.map((img, index) => (
            <div 
              key={index}
              style={{
                ...styles.heroBgLayer, backgroundImage: `url(${img})`, opacity: currentBg === index ? 1 : 0,
                transform: currentBg === index ? 'scale(1.05)' : 'scale(1)', transition: 'opacity 1.5s ease-in-out, transform 8s ease-out',
              }}
            />
          ))}
        </div>
        
        <div style={styles.heroDarkOverlay}></div>

        <div style={styles.heroContent}>
            <h1 className="hero-anim" style={styles.heroTitle}>Agro Tech Harvest</h1>
            <p className="hero-anim" style={styles.heroText}>Premium Dehydrated Raw Powders Crafted by Nature.</p>
            <div className="hero-anim" style={{ padding: '10px' }}>
              <Link to="/signup" className="hero-cta-btn" style={styles.ctaButton}>Explore the Harvest</Link>
            </div>
        </div>
      </div>

      {/* --- 1. OVERLAPPING PRODUCT CAROUSEL SECTION --- */}
      <div className="ambient-bg" style={{...styles.section, paddingBottom: isMobile ? '40px' : '60px'}}>
        <div style={styles.sectionHeader}>
          <h2 className="section-title-anim" style={styles.sectionTitle}>✨ Our Premium Selections</h2>
          <p className="section-title-anim" style={styles.sectionSubtitle}>Carefully dehydrated to preserve peak nutritional value.</p>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', color: '#888', fontWeight: '500' }}>Loading our fresh harvest...</p>
        ) : products.length > 0 ? (
          <div style={styles.carouselContainer}>
            {products.length > itemsToShow && (
              <button onClick={prevSlide} className="carousel-arrow" style={{...styles.arrowBtn, left: isMobile ? '0px' : '-25px'}}><FaChevronLeft /></button>
            )}

            <div className="carousel-track product-carousel-track" style={styles.carouselTrack}>
              {visibleProducts.map((product) => (
                <div key={product._id} className="overlapping-card product-overlapping-card" style={styles.overlappingCard}>
                  <div className="image-tile" style={styles.imageTile}>
                    <img src={renderImageSrc(product.image)} alt={product.name} style={styles.imageTileImg} />
                    <div style={styles.imageOverlay}></div>
                  </div>
                  <div className="desc-tile" style={styles.descTile}>
                    <h3 style={styles.descTitle}>{product.name}</h3>
                    <p style={styles.descText}>{product.description ? product.description.substring(0, 50) : 'Premium organic powder...'}...</p>
                    <Link to={`/product/${product._id}`} style={styles.tileBtn}>View Details</Link>
                  </div>
                </div>
              ))}
            </div>

            {products.length > itemsToShow && (
              <button onClick={nextSlide} className="carousel-arrow" style={{...styles.arrowBtn, right: isMobile ? '0px' : '-25px'}}><FaChevronRight /></button>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No products found at the moment.</p>
        )}

        <div className="section-title-anim" style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/all-products" style={styles.discoverBtn}>
            View All Products <FaArrowRight style={{marginLeft: '10px'}}/>
          </Link>
        </div>
      </div>

      {/* --- 2. OVERLAPPING BLOG CAROUSEL SECTION --- */}
      <div style={{...styles.section, backgroundColor: '#f4f4f4', paddingTop: isMobile ? '40px' : '60px', paddingBottom: isMobile ? '60px' : '80px'}}>
        <div style={styles.sectionHeader}>
          <h2 className="section-title-anim" style={styles.sectionTitle}>📖 Stories from the Farm</h2>
          <p className="section-title-anim" style={styles.sectionSubtitle}>Discover nutritional insights and our organic journey.</p>
        </div>

        {isLoadingBlogs ? (
          <p style={{ textAlign: 'center', color: '#888', fontWeight: '500' }}>Loading stories...</p>
        ) : blogs.length > 0 ? (
          <div style={styles.carouselContainer}>
            {blogs.length > itemsToShow && (
              <button onClick={prevBlogSlide} className="carousel-arrow" style={{...styles.arrowBtn, left: isMobile ? '0px' : '-25px'}}><FaChevronLeft /></button>
            )}

            <div className="carousel-track blog-carousel-track" style={styles.carouselTrack}>
              {visibleBlogs.map((blog) => (
                <div key={blog._id} className="overlapping-card blog-overlapping-card" style={styles.overlappingCard}>
                  <div className="image-tile" style={styles.imageTile}>
                    {/* Using a fallback image just in case an old test blog is missing an image */}
                    <img src={renderImageSrc(blog.blogImage || 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')} alt={blog.title} style={styles.imageTileImg} />
                    <div style={styles.imageOverlay}></div>
                  </div>
                  <div className="desc-tile" style={styles.descTile}>
                    <h3 style={{...styles.descTitle, fontSize: '1.2rem'}}>{blog.title.length > 35 ? blog.title.substring(0, 35) + '...' : blog.title}</h3>
                    <p style={styles.descText}>{blog.content ? blog.content.substring(0, 50) : 'Read our latest insights...'}...</p>
                    <Link to={`/blog/${blog._id}`} style={{...styles.tileBtn, color: '#27ae60'}}>Read Article</Link>
                  </div>
                </div>
              ))}
            </div>

            {blogs.length > itemsToShow && (
              <button onClick={nextBlogSlide} className="carousel-arrow" style={{...styles.arrowBtn, right: isMobile ? '0px' : '-25px'}}><FaChevronRight /></button>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#888' }}>No stories found at the moment.</p>
        )}

        <div className="section-title-anim" style={{ textAlign: 'center', marginTop: '80px' }}>
          <Link to="/blog" style={{...styles.discoverBtn, backgroundColor: '#0f172a', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)'}}>
            View All Stories <FaArrowRight style={{marginLeft: '10px'}}/>
          </Link>
        </div>
      </div>

      {/* --- TRUST BADGES SECTION (Height Reduced) --- */}
      <div style={styles.trustSection}>
        <div>
          <h2 className="section-title-anim" style={styles.sectionTitle}>Our Promise of Purity</h2>
        </div>
        <div className="trust-grid" style={styles.trustGrid}>
            <div className="trust-badge" style={styles.trustBadge}>
                <div className="icon-circle" style={styles.iconCircle}><FaFlask /></div>
                <h3 style={styles.trustTitle}>Lab Tested</h3>
                <p style={styles.trustText}>Every batch tested</p>
            </div>
            <div className="trust-badge" style={styles.trustBadge}>
                <div className="icon-circle" style={styles.iconCircle}><FaCertificate /></div>
                <h3 style={styles.trustTitle}>FSSAI Certified</h3>
                <p style={styles.trustText}>100% Safe</p>
            </div>
            <div className="trust-badge" style={styles.trustBadge}>
                <div className="icon-circle" style={styles.iconCircle}><FaLeaf /></div>
                <h3 style={styles.trustTitle}>100% Organic</h3>
                <p style={styles.trustText}>Nature only</p>
            </div>
            <div className="trust-badge" style={styles.trustBadge}>
                <div className="icon-circle" style={styles.iconCircle}><FaBan /></div>
                <h3 style={styles.trustTitle}>Non-GMO</h3>
                <p style={styles.trustText}>Authentic seeds</p>
            </div>
        </div>
      </div>

      {/* --- STORY SECTION --- */}
      <div className="story-section" style={styles.storySection}>
          <div className="story-section-content">
            <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', marginBottom: '20px', fontWeight: '800' }}>Discover Our Roots</h2>
            <p style={{maxWidth: '650px', margin: '0 auto 40px', lineHeight: '1.8', fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)'}}>
              Learn about Pranay & Abhishek's journey from a simple rural family to creating Agro Tech Harvest.
            </p>
            <Link to="/about" style={styles.storyBtn}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e67e22'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1.05)'}}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e67e22'; e.currentTarget.style.transform = 'scale(1)'}}
            >
                Read Our Story <FaArrowRight style={{marginLeft: '10px'}}/>
            </Link>
          </div>
      </div>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
            <button onClick={() => setShowContact(false)} style={styles.closeBtn}>×</button>
            <h2 style={{ color: '#27ae60', marginBottom: '25px', fontWeight: '800' }}>Contact Us</h2>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📍</span> <p style={{margin: 0, fontWeight: '600'}}>Suryapet, Telangana</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📞</span> <p style={{margin: 0, fontWeight: '600'}}>+91-9705116060</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>✉️</span> <p style={{margin: 0, fontWeight: '600', wordBreak: 'break-all'}}>Agrotecharvest@gmail.com</p>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

const getStyles = (isMobile) => ({
  container: { 
    fontFamily: "'Outfit', 'Segoe UI', sans-serif", width: '100%', overflowX: 'clip', backgroundColor: '#fff', color: '#0f172a'
  },
  heroWrapper: {
    position: 'relative', width: '100%', minHeight: isMobile ? '500px' : '700px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: '#000', 
  },
  heroBgLayer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center' },
  heroDarkOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)', zIndex: 2 },
  heroContent: { position: 'relative', zIndex: 3, textAlign: 'center', color: 'white', padding: isMobile ? '0 25px' : '0 50px' },
  heroTitle: { fontSize: isMobile ? '3rem' : '5.5rem', marginBottom: '20px', lineHeight: 1.05, fontWeight: '800', letterSpacing: '-2px', textShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  heroText: { fontSize: isMobile ? '1.1rem' : '1.5rem', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: '400', color: 'rgba(255,255,255,0.9)', textShadow: '0 5px 15px rgba(0,0,0,0.5)' },
  ctaButton: { padding: '18px 45px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.15rem', textDecoration: 'none', borderRadius: '50px', fontWeight: '800', display: 'inline-block' },

  section: { padding: isMobile ? '80px 20px' : '120px 40px', maxWidth: '100%', margin: '0 auto', boxSizing: 'border-box' },
  sectionHeader: { textAlign: 'center', marginBottom: '70px' },
  sectionTitle: { color: '#0f172a', fontSize: isMobile ? '2.2rem' : '3rem', fontWeight: '800', letterSpacing: '-1px', margin: '0 0 15px 0' },
  sectionSubtitle: { color: '#64748b', fontSize: '1.2rem', margin: 0, fontWeight: '400' },

  carouselContainer: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' },
  carouselTrack: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '45px', width: '100%', maxWidth: '1200px' },
  arrowBtn: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: '55px', height: '55px', borderRadius: '50%', backgroundColor: 'white', color: '#0f172a', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', cursor: 'pointer', zIndex: 10 },
  
  overlappingCard: { position: 'relative', height: '500px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' },
  imageTile: { position: 'absolute', top: 0, left: 0, width: '100%', height: '80%', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 1 },
  imageTileImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)', zIndex: 2 },
  
  descTile: { position: 'absolute', bottom: 0, width: '90%', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderRadius: '24px', padding: '30px 20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', zIndex: 3, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' },
  descTitle: { margin: '0 0 12px 0', color: '#0f172a', fontSize: '1.4rem', fontWeight: '800' },
  descText: { margin: '0 0 25px 0', color: '#64748b', fontSize: '1rem', lineHeight: '1.6' },
  tileBtn: { display: 'inline-block', padding: '12px 28px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#e67e22', textDecoration: 'none', borderRadius: '50px', fontSize: '0.95rem', fontWeight: '800', transition: 'all 0.3s ease' },
  
  discoverBtn: { padding: '16px 40px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '50px', fontWeight: '800', fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', boxShadow: '0 10px 25px rgba(39, 174, 96, 0.3)', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' },

  // 🔴 FIXED: Height and padding of the Trust Section are now reduced
  trustSection: { backgroundColor: '#ffffff', padding: isMobile ? '50px 20px' : '70px 20px', textAlign: 'center', borderTop: '1px solid #f1f5f9' },
  trustGrid: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: isMobile ? '30px' : '50px', maxWidth: '1200px', margin: '40px auto 0' },
  trustBadge: { flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  iconCircle: { width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px', color: '#27ae60', marginBottom: '20px' },
  trustTitle: { margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' },
  trustText: { margin: 0, color: '#64748b', fontSize: '1rem', fontWeight: '500' },

  storySection: { background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', color: 'white', textAlign: 'center', padding: isMobile ? '80px 25px' : '120px 20px', position: 'relative', overflow: 'hidden' },
  storyBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#e67e22', textDecoration: 'none', fontWeight: '800', fontSize: '1.2rem', border: '2px solid #e67e22', padding: '15px 40px', borderRadius: '50px', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { backgroundColor: 'white', padding: isMobile ? '35px 25px' : '50px', borderRadius: '30px', position: 'relative', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' },
  closeBtn: { position: 'absolute', top: '20px', right: '25px', background: 'none', border: 'none', fontSize: '30px', cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px', textAlign: 'left', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }
});

export default LandingPage;