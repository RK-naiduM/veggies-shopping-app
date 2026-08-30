import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaTractor, FaHeart, FaCheckCircle } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import pranayImg from '../assets/pranay.webp'; 
import abhishekImg from '../assets/abhishek.webp'; 

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
  const compRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      gsap.fromTo('.hero-anim', 
        { y: 60, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }, 
        { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.1 }
      );

      gsap.to('.hero-bg-parallax', {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: '.hero-container',
          start: "top top",
          end: "bottom top",
          scrub: true 
        }
      });

      gsap.utils.toArray('.scroll-fade-up').forEach(section => {
        gsap.fromTo(section,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 85%" },
            y: 0, opacity: 1, duration: 1, ease: "power3.out"
          }
        );
      });

      gsap.fromTo('.founder-card',
        { y: 60, opacity: 0, scale: 0.9, rotationX: -10 },
        {
          scrollTrigger: { trigger: '.founders-grid', start: "top 80%" },
          y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)"
        }
      );

      gsap.fromTo('.principle-item',
        { x: -30, opacity: 0 },
        {
          scrollTrigger: { trigger: '.principles-grid', start: "top 85%" },
          x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out"
        }
      );

      gsap.fromTo('.vision-card',
        { y: 80, opacity: 0, rotationY: 15 },
        {
          scrollTrigger: { trigger: '.values-section', start: "top 80%" },
          y: 0, opacity: 1, rotationY: 0, duration: 0.8, stagger: 0.15, ease: "power3.out"
        }
      );

    }, compRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <div ref={compRef} style={styles.container}>
      
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

          .founder-card {
            perspective: 1000px;
            transform-style: preserve-3d;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .founder-card:hover {
            transform: translateY(-10px);
          }
          .founder-card:hover img {
            transform: scale(1.05) translateZ(20px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important;
            border-color: #27ae60 !important;
          }

          .vision-card {
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .vision-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0,0,0,0.1) !important;
            border-color: rgba(39, 174, 96, 0.3) !important;
          }
          .vision-card:hover .vision-icon {
            transform: scale(1.2) rotate(5deg);
            color: #e67e22 !important;
          }

          .principle-item {
            transition: all 0.3s ease;
          }
          .principle-item:hover {
            transform: translateX(10px);
            background-color: #fff !important;
            box-shadow: 0 8px 20px rgba(39, 174, 96, 0.15) !important;
          }

          .cta-btn:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 15px 30px rgba(230, 126, 34, 0.5) !important;
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="hero-container" style={styles.heroWrapper}>
        <div className="hero-bg-parallax" style={styles.heroBg}></div>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <h1 className="hero-anim" style={styles.title}>A Journey Born from Struggle, Belief & Purpose</h1>
          <p className="hero-anim" style={styles.subtitle}>
            Founded by Pranay Muthumula Veera & Abhishek Bandla
          </p>
        </div>
      </div>

      <div className="ambient-bg" style={{ paddingBottom: '80px' }}>
        <div style={styles.content}>
          
          <section className="scroll-fade-up" style={styles.section}>
            <h2 style={styles.heading}>Our Roots</h2>
            <p style={styles.text}>
              Agro Tech Harvest is not just a brand; it is a journey. We, <strong>Pranay Muthumula Veera and Abhishek Bandla</strong>, were raised in a simple rural family where hard work was a way of life.
            </p>

            <div className="founders-grid" style={styles.foundersGrid}>
              
              <div className="founder-card" style={styles.founderCard}>
                  <img 
                      src={pranayImg} 
                      alt="Pranay Muthumula Veera" 
                      style={styles.founderImg}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }}
                  />
                  <h3 style={styles.founderName}>Pranay Muthumula Veera</h3>
                  <p style={styles.founderRole}>Co-Founder</p>
              </div>

              <div className="founder-card" style={styles.founderCard}>
                  <img 
                      src={abhishekImg} 
                      alt="Abhishek Bandla" 
                      style={styles.founderImg} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }}
                  />
                  <h3 style={styles.founderName}>Abhishek Bandla</h3>
                  <p style={styles.founderRole}>Co-Founder</p>
              </div>

            </div>

            <p style={styles.text}>
              The idea behind Agro Tech Harvest came as we observed the food market. One truth became impossible to ignore: many products labelled as "healthy" were actually filled with chemicals and preservatives. 
            </p>
            
            <div className="scroll-fade-up" style={styles.quoteBox}>
              "The most powerful question arose: Can we provide nutrition in its purest, most natural form?"
            </div>

            <p style={styles.text}>
              This question became our turning point, transforming a vision into reality. The journey was not easy, but we stood by our principles.
            </p>
          </section>

          <section className="scroll-fade-up" style={styles.sectionAlt}>
            <h2 style={styles.heading}>Our Unchanging Principles</h2>
            <p style={{marginBottom: '40px', color: '#64748b', fontSize: '1.1rem'}}>We are open to challenge because we have nothing to hide.</p>
            
            <div className="principles-grid" style={styles.principlesGrid}>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> No Compromise on Quality</div>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> No Chemicals</div>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> No Preservatives</div>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> No Added Sugars</div>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> Only Pure Fruits & Veg</div>
               <div className="principle-item" style={styles.principleItem}><FaCheckCircle color="#27ae60" size="1.2em"/> 100% Lab Tested</div>
            </div>
          </section>

          <section className="scroll-fade-up" style={styles.section}>
            <h2 style={styles.heading}>Why "Agro Tech Harvest"?</h2>
            <div style={styles.nameBreakdown}>
               <p style={styles.nameBreakdownText}><strong style={{color: '#e67e22'}}>Agro Tech</strong> = Integration of Agriculture with Technology</p>
               <p style={styles.nameBreakdownText}><strong style={{color: '#27ae60'}}>Harvest</strong> = The hard work of farmers</p>
            </div>
            <p style={styles.text}>
              Our mission is simple: To bring nature's goodness directly from farms to Homes without any manipulation.
            </p>
            
            <p style={styles.text}>
              We carefully produce raw powders from Banana, carrot, beetroot, lemon, moringa, and more. Each product is made with a specific purpose and loaded with health benefits.
            </p>
          </section>

          <section className="values-section" style={styles.valuesSection}>
            <div className="vision-card" style={styles.card}>
              <FaUsers className="vision-icon" style={styles.icon} />
              <h3 style={styles.cardTitle}>Rural Employment</h3>
              <p style={styles.cardText}>To create employment opportunities in rural areas and empower local communities.</p>
            </div>
            <div className="vision-card" style={styles.card}>
              <FaTractor className="vision-icon" style={styles.icon} />
              <h3 style={styles.cardTitle}>Support Farmers</h3>
              <p style={styles.cardText}>Supporting our backbone—the farmers—by ensuring they get fair value for their produce.</p>
            </div>
            <div className="vision-card" style={styles.card}>
              <FaHeart className="vision-icon" style={styles.icon} />
              <h3 style={styles.cardTitle}>Accessible Nutrition</h3>
              <p style={styles.cardText}>Making healthy, chemical-free nutrition accessible to every single Indian kitchen.</p>
            </div>
          </section>

          <section className="scroll-fade-up" style={{marginTop: '80px', textAlign: 'center'}}>
            <h2 style={{color: '#0f172a', marginBottom: '25px', fontSize: '2.5rem', fontWeight: '800'}}>Our Identity</h2>
            <p style={styles.text}>
              At Agro Tech Harvest, we are not chasing profits. Our aim is to build an organic firm that provides 100% nature-given foods. We stand for <strong style={{color: '#27ae60'}}>Trust, Purity, and Honesty</strong>.
              <br /><br />
              This is not just a business—it is our identity and commitment to healthier families and a better future.
            </p>
          </section>

        </div>
      </div>

      <div style={styles.footer}>
        <div className="scroll-fade-up">
          <h3 style={{ fontSize: '2rem', marginBottom: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            We invite you to be a part of this journey from our family to yours.
          </h3>
          <Link to="/all-products" className="cta-btn" style={styles.ctaBtn}>Explore Our Products</Link>
        </div>
      </div>

    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    color: '#0f172a',
    lineHeight: '1.6',
    backgroundColor: '#fff',
    overflowX: 'hidden'
  },
  heroWrapper: {
    position: 'relative',
    width: '100%',
    minHeight: '600px', 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  heroBg: {
    position: 'absolute',
    top: '-10%', left: 0, width: '100%', height: '120%', 
    backgroundImage: 'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)', 
    zIndex: 2
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    textAlign: 'center',
    padding: '0 25px',
    color: 'white',
    maxWidth: '900px'
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
    marginBottom: '20px',
    fontWeight: '800',
    letterSpacing: '-1px',
    textShadow: '0 10px 30px rgba(0,0,0,0.5)',
    lineHeight: 1.1
  },
  subtitle: {
    fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
    margin: '0 auto',
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    textShadow: '0 5px 15px rgba(0,0,0,0.5)'
  },
  content: {
    maxWidth: '1200px', 
    margin: '0 auto',
    padding: '80px 20px 0 20px',
  },
  section: {
    marginBottom: '80px',
    textAlign: 'center',
  },
  sectionAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    padding: '60px 40px',
    borderRadius: '24px',
    textAlign: 'center',
    marginBottom: '80px',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
  },
  heading: {
    color: '#0f172a',
    fontSize: '2.5rem',
    marginBottom: '30px',
    fontWeight: '800',
    letterSpacing: '-1px',
    borderBottom: '4px solid #e67e22',
    display: 'inline-block',
    paddingBottom: '10px'
  },
  text: {
    fontSize: '1.15rem',
    color: '#475569',
    maxWidth: '850px',
    margin: '0 auto 25px auto',
    lineHeight: '1.8'
  },
  foundersGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '60px', 
    margin: '60px 0',
    flexWrap: 'wrap'
  },
  founderCard: {
    textAlign: 'center',
    width: '240px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  founderImg: {
    display: 'block',
    margin: '0 auto 20px auto', 
    width: '200px',
    height: '280px',
    borderRadius: '20px', 
    objectFit: 'cover',
    border: '6px solid white',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    backgroundColor: '#eee',
    transition: 'all 0.4s ease'
  },
  founderName: {
    fontSize: '1.3rem',
    color: '#0f172a',
    margin: '5px 0',
    fontWeight: '800'
  },
  founderRole: {
    color: '#64748b',
    fontSize: '1rem',
    margin: 0,
    fontWeight: '600'
  },
  quoteBox: {
    fontSize: '1.5rem',
    fontStyle: 'italic',
    color: '#0f172a',
    fontWeight: '600',
    margin: '60px auto',
    padding: '30px 40px',
    borderLeft: '6px solid #e67e22',
    backgroundColor: 'white',
    borderRadius: '0 16px 16px 0',
    maxWidth: '800px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
  },
  principlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    maxWidth: '900px',
    margin: '0 auto'
  },
  principleItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '700',
    color: '#0f172a',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
  },
  nameBreakdown: {
    backgroundColor: '#fffbeb', 
    padding: '25px 35px',
    borderRadius: '20px',
    display: 'inline-block',
    marginBottom: '40px',
    textAlign: 'left',
    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)'
  },
  nameBreakdownText: {
    margin: '10px 0',
    fontSize: '1.2rem',
    color: '#334155'
  },
  valuesSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    marginTop: '60px',
  },
  card: {
    flex: '1',
    minWidth: '300px',
    padding: '40px 30px',
    backgroundColor: 'white',
    boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
    borderRadius: '24px',
    textAlign: 'center',
    border: '1px solid rgba(0,0,0,0.03)',
  },
  icon: {
    fontSize: '45px',
    color: '#27ae60',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  },
  cardTitle: {
    fontSize: '1.4rem',
    color: '#0f172a',
    marginBottom: '15px',
    fontWeight: '800'
  },
  cardText: {
    color: '#64748b',
    fontSize: '1.05rem',
    lineHeight: '1.6'
  },
  footer: {
    textAlign: 'center',
    padding: '100px 20px',
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)', 
    color: 'white',
  },
  ctaBtn: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '18px 45px',
    backgroundColor: '#e67e22',
    color: 'white',
    textDecoration: 'none',
    fontWeight: '800',
    borderRadius: '50px',
    fontSize: '1.15rem',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)'
  }
};

export default AboutUsPage;