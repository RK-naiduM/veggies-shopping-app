import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUserEdit, FaCalendarAlt } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api';

gsap.registerPlugin(ScrollTrigger);

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await API.get('/blogs');
        setBlogs(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const renderImageSrc = (imgString) => {
    if (!imgString) return 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'; 
    if (imgString.startsWith('http')) return imgString;
    return `${BACKEND_URL}/images/${imgString}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const compRef = useRef(null);

  useEffect(() => {
    if (loading || blogs.length === 0) return;
    let ctx = gsap.context(() => {
      gsap.fromTo('.header-anim', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
      gsap.fromTo('.blog-card', { y: 60, opacity: 0, scale: 0.95 }, { scrollTrigger: { trigger: '.blog-grid', start: "top 85%" }, y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" });
    }, compRef);
    return () => ctx.revert();
  }, [loading, blogs.length]);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          @keyframes gradientFloat { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .ambient-bg { background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb); background-size: 400% 400%; animation: gradientFloat 15s ease infinite; min-height: 100vh; }
          .blog-grid { perspective: 1200px; }
          .blog-card { transform-style: preserve-3d; transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); cursor: pointer; text-decoration: none; }
          .blog-card:hover { transform: translateY(-15px) rotateX(2deg); box-shadow: 0 25px 50px rgba(0,0,0,0.1) !important; border-color: rgba(39, 174, 96, 0.3) !important; }
          .blog-card:hover .blog-image { transform: scale(1.1); }
          .blog-card:hover .read-more-text { color: #e67e22 !important; transform: translateX(5px); }
        `}
      </style>

      <div style={styles.container}>
        <div className="header-anim" style={styles.headerContainer}>
          <h1 style={styles.pageTitle}>Stories from the Farm</h1>
          <p style={styles.subtitle}>Discover the secrets of organic farming, nutritional insights, and the journey of our harvest.</p>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}><p style={styles.loadingText}>Gathering stories...</p></div>
        ) : blogs.length === 0 ? (
          <div style={styles.emptyContainer}><h2 style={{ color: '#64748b' }}>No stories published yet. Check back soon!</h2></div>
        ) : (
          <div className="blog-grid" style={styles.grid}>
            {blogs.map((blog) => (
              <Link to={`/blog/${blog._id}`} key={blog._id} className="blog-card" style={styles.card}>
                <div style={styles.imageWrapper}>
                  <img src={renderImageSrc(blog.blogImage)} alt={blog.title} className="blog-image" style={styles.image} />
                  <div style={styles.imageOverlay}></div>
                </div>
                <div style={styles.cardContent}>
                  <h2 style={styles.title}>{blog.title}</h2>
                  <p style={styles.snippet}>{blog.content ? blog.content.substring(0, 100) : ''}...</p>
                  
                  <div style={styles.metaData}>
                    <div style={styles.metaItem}><FaUserEdit style={{ color: '#27ae60' }} /><span>{blog.authorName}</span></div>
                    <div style={styles.metaItem}><FaCalendarAlt style={{ color: '#94a3b8' }} /><span>{formatDate(blog.createdAt)}</span></div>
                  </div>

                  <div style={styles.readMoreWrapper}>
                    <span className="read-more-text" style={styles.readMoreText}>
                      Read Full Story <FaArrowRight style={{ marginLeft: '8px', fontSize: '0.8em' }} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: '#0f172a', overflowX: 'clip' },
  container: { maxWidth: '1300px', margin: '0 auto', padding: '60px 20px 100px 20px', boxSizing: 'border-box' },
  headerContainer: { textAlign: 'center', marginBottom: '60px' },
  pageTitle: { fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px', margin: '0 0 15px 0' },
  subtitle: { fontSize: '1.2rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' },
  loadingText: { color: '#64748b', fontSize: '1.2rem', fontWeight: '600' },
  emptyContainer: { textAlign: 'center', padding: '80px 20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '40px', width: '100%' },
  card: { display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', height: '100%' },
  imageWrapper: { width: '100%', height: '240px', position: 'relative', overflow: 'hidden' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)', pointerEvents: 'none' },
  cardContent: { padding: '30px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  title: { fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '0 0 15px 0', lineHeight: '1.3', letterSpacing: '-0.5px' },
  snippet: { fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', margin: '0 0 25px 0', flexGrow: 1 },
  metaData: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px', marginBottom: '20px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#64748b' },
  readMoreWrapper: { marginTop: 'auto' },
  readMoreText: { color: '#27ae60', fontWeight: '800', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', transition: 'all 0.3s ease' }
};

export default BlogPage;