import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Upgraded to Link for SPA routing
import { FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; 
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import logo from '../assets/logo.webp';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  // --- GSAP HIGH-MOTION LOGIC ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Staggered reveal for footer columns when scrolling down
      gsap.fromTo('.footer-section-anim',
        { y: 50, opacity: 0 },
        {
          scrollTrigger: { 
            trigger: footerRef.current, 
            start: "top 90%" 
          },
          y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out"
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} style={styles.footer}>
      
      {/* --- UPGRADED THEME CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          /* Footer Link Animations */
          .footer-link {
            color: #94a3b8;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-block;
          }
          .footer-link:hover {
            color: #27ae60 !important;
            transform: translateX(8px); /* Smooth slide right on hover */
          }

          /* Social Icon Bounce */
          .social-icon {
            color: #cbd5e1;
            font-size: 1.5rem;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
          }
          .social-icon:hover {
            color: #e67e22 !important;
            transform: translateY(-8px) scale(1.1);
          }
        `}
      </style>

      <div style={styles.footerContent}>
        
        {/* Column 1: About */}
        <div className="footer-section-anim" style={styles.footerSection}>
            <div style={styles.logoHeader}>
                <img src={logo} alt="Agro Tech Harvest" style={styles.logoImage} />
                <h3 style={styles.brandName}>Agro Tech Harvest</h3>
            </div>
          <p style={styles.descriptionText}>
            Bringing you the freshest organic vegetables and pure raw powders directly from the farm to your table. Experience nature's goodness without compromise.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section-anim" style={styles.footerSection}>
          <h3 style={styles.sectionTitle}>Quick Links</h3>
          <ul style={styles.linkList}>
            <li style={styles.listItem}><Link to="/" className="footer-link">Home</Link></li>
            <li style={styles.listItem}><Link to="/about" className="footer-link">About Us</Link></li>
            <li style={styles.listItem}><Link to="/blog" className="footer-link">Blog</Link></li>
            <li style={styles.listItem}><Link to="/category/vegetables" className="footer-link">Vegetables</Link></li>
            <li style={styles.listItem}><Link to="/category/powders" className="footer-link">Raw Powders</Link></li>
            <li style={styles.listItem}><Link to="/cart" className="footer-link">My Cart</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-section-anim" style={styles.footerSection}>
          <h3 style={styles.sectionTitle}>Contact Us</h3>
          
          <div style={styles.contactItem}>
            <FaMapMarkerAlt style={styles.contactIcon} />
            <p style={styles.contactText}>Suryapet, Telangana</p>
          </div>
          
          <div style={styles.contactItem}>
            <FaPhoneAlt style={styles.contactIcon} />
            <p style={styles.contactText}>+91-9705116060</p>
          </div>
          
          <div style={styles.contactItem}>
            <FaEnvelope style={styles.contactIcon} />
            <p style={styles.contactText}>Agrotecharvest@gmail.com</p>
          </div>
          
          <div style={styles.socialsContainer}>
            <FaFacebook className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
          </div>
        </div>

      </div>

      <div style={styles.footerBottom}>
        &copy; {new Date().getFullYear()} Agro Tech Harvest. All rights reserved.
      </div>
    </footer>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  footer: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', // Premium dark slate gradient
    color: '#f8fafc',
    padding: '80px 40px 20px 40px',
    position: 'relative',
    overflow: 'hidden',
    borderTop: '4px solid #27ae60' // Brand accent border
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '50px',
    marginBottom: '60px'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px'
  },
  logoImage: {
    height: '45px',
    backgroundColor: 'rgba(255,255,255,0.1)', // Subtle backdrop for logo
    padding: '5px',
    borderRadius: '10px'
  },
  brandName: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#ffffff'
  },
  descriptionText: {
    color: '#94a3b8',
    lineHeight: '1.8',
    fontSize: '1.05rem',
    margin: 0
  },
  sectionTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    marginBottom: '25px',
    color: '#ffffff',
    position: 'relative',
    paddingBottom: '10px'
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  listItem: {
    margin: 0
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px'
  },
  contactIcon: {
    color: '#27ae60',
    fontSize: '1.1rem',
    flexShrink: 0
  },
  contactText: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '1.05rem'
  },
  socialsContainer: {
    display: 'flex',
    gap: '20px',
    marginTop: '25px'
  },
  footerBottom: {
    textAlign: 'center',
    paddingTop: '30px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500'
  }
};

export default Footer;