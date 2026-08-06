import React, { useEffect, useRef } from 'react'; 
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/logo.png'; 
import farmBg from '../assets/farm-bg.png'; 

gsap.registerPlugin(ScrollTrigger);

const ShopPage = () => {
  const compRef = useRef(null);

  // --- GSAP HIGH-MOTION LOGIC ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Cinematic Hero Text Reveal (Masking effect)
      gsap.fromTo('.hero-anim', 
        { y: 60, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
      );

      // 2. Parallax Hero Background
      gsap.to('.hero-bg-parallax', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero-container',
          start: "top top",
          end: "bottom top",
          scrub: true 
        }
      });

      // 3. Staggered 3D Card Reveal
      gsap.fromTo('.category-card',
        { y: 80, opacity: 0, rotationY: 15, scale: 0.95 },
        {
          scrollTrigger: { trigger: '.grid-container', start: "top 85%" },
          y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)"
        }
      );

      // 4. Section Title Fade Up
      gsap.fromTo('.section-title-anim',
        { y: 30, opacity: 0 },
        {
          scrollTrigger: { trigger: '.category-section', start: "top 85%" },
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out"
        }
      );

    }, compRef);

    return () => ctx.revert(); 
  }, []);

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
            min-height: 100vh;
          }

          /* 3D Category Card Hover */
          .grid-container {
            perspective: 1200px;
          }
          .category-card {
            transform-style: preserve-3d;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
          }
          .category-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.08) !important;
            border-color: rgba(39, 174, 96, 0.3) !important;
          }
          .category-card:hover .card-icon {
            transform: scale(1.2) rotate(5deg);
          }
          .category-card:hover .link-button {
            background-color: #27ae60 !important;
            color: white !important;
            box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3) !important;
            transform: translateY(-2px);
          }
        `}
      </style>

      {/* Hero Section (Parallax + Mask Reveal) */}
      <div className="hero-container" style={styles.hero}>
        <div className="hero-bg-parallax" style={styles.heroBg}></div>
        <div style={styles.heroOverlay}></div>
        
        <div style={styles.heroContent}>
            <div className="hero-anim" style={styles.logoWrapper}>
                <img src={logo} alt="Agro Tech Harvest Logo" style={styles.logo} />
            </div>
            <h1 className="hero-anim" style={styles.title}>Welcome Back!</h1>
            <p className="hero-anim" style={styles.subtitle}>
              Fresh Vegetables & Pure Organic Powders delivered to your doorstep.
            </p>
        </div>
      </div>

      {/* Categories Section */}
      <div className="category-section" style={styles.categorySection}>
        <h2 className="section-title-anim" style={styles.sectionHeader}>Start Shopping</h2>
        
        <div className="grid-container" style={styles.gridContainer}>
          
          {/* Card 1: Vegetables */}
          {/* <div className="category-card" style={styles.card}>
            <div className="card-icon" style={styles.icon}>🥕</div>
            <h3 style={styles.cardTitle}>Fresh Vegetables</h3>
            <p style={styles.cardDesc}>Daily harvested organic veggies.</p>
            <Link to="/category/vegetables" className="link-button" style={styles.linkButton}>
              Browse Veggies <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.9em' }}/>
            </Link>
          </div> */}

          {/* Card 2: Powders */}
          <div className="category-card" style={styles.card}>
            <div className="card-icon" style={styles.icon}>🥣</div>
            <h3 style={styles.cardTitle}>Raw Powders</h3>
            <p style={styles.cardDesc}>Pure turmeric, chilli, and more.</p>
            <Link to="/category/powders" className="link-button" style={styles.linkButton}>
              Browse Powders <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.9em' }}/>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  container: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    paddingBottom: '80px',
    width: '100%',
    overflowX: 'hidden'
  },
  hero: {
    position: 'relative',
    textAlign: 'center',
    color: 'white', 
    padding: 'clamp(80px, 15vh, 120px) 20px', 
    marginBottom: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  heroBg: {
    position: 'absolute',
    top: '-10%', left: 0, width: '100%', height: '120%', 
    backgroundImage: `url(${farmBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)', // Premium dark overlay
    zIndex: 2
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    maxWidth: '800px',
    width: '100%'
  },
  logoWrapper: {
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '20px'
  },
  logo: {
      width: 'clamp(60px, 15vw, 80px)', 
      height: 'auto',
      backgroundColor: 'rgba(255,255,255,0.95)', 
      borderRadius: '20px', // Adjusted to match new app border radiuses
      padding: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
    color: 'white', 
    margin: '0 0 15px 0',
    fontWeight: '800',
    letterSpacing: '-1px',
    textShadow: '0 10px 30px rgba(0,0,0,0.5)',
    lineHeight: '1.1'
  },
  subtitle: {
    fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
    color: 'rgba(255,255,255,0.9)', 
    textShadow: '0 5px 15px rgba(0,0,0,0.5)',
    maxWidth: '650px',
    margin: '0 auto',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  categorySection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  sectionHeader: { 
      textAlign: 'center', 
      color: '#0f172a', 
      marginBottom: '50px',
      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
      fontWeight: '800',
      letterSpacing: '-0.5px'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
    gap: '40px',
    justifyContent: 'center',
    padding: '10px' 
  },
  card: {
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '24px',
    padding: '40px 30px',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.04)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%', 
  },
  icon: {
      fontSize: '60px',
      marginBottom: '20px',
      transition: 'transform 0.4s ease'
  },
  cardTitle: {
      color: '#0f172a',
      fontSize: '1.8rem',
      fontWeight: '800',
      marginBottom: '10px',
      letterSpacing: '-0.5px'
  },
  cardDesc: {
      color: '#64748b', 
      marginBottom: '30px', 
      lineHeight: '1.6',
      fontSize: '1.1rem',
      flexGrow: 1 
  },
  linkButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto', 
    backgroundColor: '#f8fafc',
    color: '#e67e22',
    border: '1px solid #e2e8f0',
    padding: '15px 0',
    borderRadius: '50px', // Pill shape matching app theme
    textDecoration: 'none',
    fontWeight: '800',
    fontSize: '1.1rem',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

export default ShopPage;