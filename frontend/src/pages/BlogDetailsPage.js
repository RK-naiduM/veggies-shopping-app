import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import gsap from 'gsap';
import API from '../api';

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  // Fetch current blog AND recent blogs
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // Fetch both concurrently for speed
        const [blogRes, allBlogsRes] = await Promise.all([
          API.get(`/blogs/${id}`),
          API.get('/blogs')
        ]);

        setBlog(blogRes.data);

        // Filter out the current blog, and grab the 4 newest ones
        const recents = allBlogsRes.data
          .filter(b => b._id !== id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
        
        setRecentBlogs(recents);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    
    fetchBlogData();
    // Scroll to top when the ID changes (if user clicks a recent post)
    window.scrollTo(0, 0); 
  }, [id]);

  const renderImageSrc = (imgString) => {
    if (!imgString) return ''; 
    if (imgString.startsWith('http')) return imgString;
    return `${BACKEND_URL}/images/${imgString}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (!blog) return;
    let ctx = gsap.context(() => {
      gsap.fromTo('.anim-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
      gsap.fromTo('.anim-left', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 });
      gsap.fromTo('.anim-right', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 });
    }, compRef);
    return () => ctx.revert();
  }, [blog, id]);

  if (loading) return (
    <div className="ambient-bg" style={styles.loadingContainer}>
      <h3 style={styles.loadingText}>Loading Story...</h3>
    </div>
  );

  if (!blog) return (
    <div className="ambient-bg" style={styles.loadingContainer}>
      <h3 style={styles.loadingText}>Story not found.</h3>
      <Link to="/blog" style={styles.backBtn}>Back to Blogs</Link>
    </div>
  );

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
      {/* --- UPGRADED THEME CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .ambient-bg { background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb); background-size: 400% 400%; animation: gradientFloat 15s ease infinite; min-height: 100vh; }
          
          .back-btn:hover { color: #27ae60 !important; transform: translateX(-5px); }

          /* The Grid Layout: 65% / 35% Split */
          .blog-layout {
            display: grid;
            grid-template-columns: 65fr 35fr;
            gap: 50px;
            align-items: start;
          }

          /* Recent Post Hover Effect */
          .recent-card {
            transition: all 0.3s ease;
          }
          .recent-card:hover {
            background-color: #f8fafc;
            border-radius: 12px;
            transform: translateX(5px);
          }
          .recent-card:hover .recent-title {
            color: #27ae60 !important;
          }

          /* Mobile Stacking */
          @media (max-width: 900px) {
            .blog-layout {
              grid-template-columns: 1fr;
              gap: 40px;
            }
            .anim-right {
               order: -1; /* Puts the author info above the content on mobile */
            }
          }
        `}
      </style>

      <div style={styles.container}>
        
        <Link to="/blog" className="back-btn" style={styles.backBtn}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Stories
        </Link>

        {/* TOP: Blog Title */}
        <h1 className="anim-title" style={styles.title}>{blog.title}</h1>

        <div className="blog-layout">
          
          {/* LEFT COLUMN (65% Width) */}
          <div className="anim-left" style={styles.leftColumn}>
            
            {/* Main Blog Image */}
            <div style={styles.mainImageWrapper}>
              {blog.blogImage ? (
                <img src={renderImageSrc(blog.blogImage)} alt={blog.title} style={styles.mainImage} />
              ) : (
                <div style={styles.noImagePlaceholder}>No Image Provided</div>
              )}
            </div>

            {/* Blog Content */}
            <div style={styles.contentBody}>
              {blog.content}
            </div>

          </div>

          {/* RIGHT COLUMN (35% Width) */}
          <div className="anim-right" style={styles.rightColumn}>
            
            {/* Author Profile Card */}
            <div style={styles.authorCard}>
              <div style={styles.authorImageWrapper}>
                {blog.authorPhoto ? (
                  <img src={renderImageSrc(blog.authorPhoto)} alt={blog.authorName} style={styles.authorImage} />
                ) : (
                  <div style={styles.authorPlaceholder}>{blog.authorName.charAt(0)}</div>
                )}
              </div>
              <h3 style={styles.authorName}>{blog.authorName}</h3>
              <p style={styles.dateText}><FaCalendarAlt style={{marginRight: '6px'}}/> Published on {formatDate(blog.createdAt)}</p>
              <div style={styles.authorBadge}>Author</div>
            </div>

            {/* Some Space */}
            <div style={{ height: '40px' }}></div>

            {/* Recent Posts Section */}
            {recentBlogs.length > 0 && (
              <div style={styles.recentSection}>
                <h3 style={styles.recentHeader}>Recent Posts</h3>
                
                <div style={styles.recentList}>
                  {recentBlogs.map(rb => (
                    <Link to={`/blog/${rb._id}`} key={rb._id} className="recent-card" style={styles.recentCard}>
                      <div style={styles.recentImageWrapper}>
                        {rb.blogImage ? (
                          <img src={renderImageSrc(rb.blogImage)} alt={rb.title} style={styles.recentImage} />
                        ) : (
                          <div style={styles.recentPlaceholder}></div>
                        )}
                      </div>
                      <div style={styles.recentInfo}>
                        <h4 className="recent-title" style={styles.recentTitle}>{rb.title}</h4>
                        <p style={styles.recentDate}>{formatDate(rb.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

// --- DYNAMIC STYLES ---
const styles = {
  pageWrapper: { fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: '#0f172a', overflowX: 'hidden' },
  loadingContainer: { display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  loadingText: { color: '#64748b', fontSize: '1.5rem', fontWeight: '700' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px 100px 20px' },
  
  backBtn: { display: 'inline-flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', fontWeight: '700', fontSize: '1.05rem', marginBottom: '20px', transition: 'all 0.3s ease' },
  title: { fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', color: '#0f172a', lineHeight: '1.1', letterSpacing: '-1px', marginBottom: '40px' },

  // LEFT COLUMN
  leftColumn: { display: 'flex', flexDirection: 'column', gap: '30px' },
  mainImageWrapper: { width: '100%', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' },
  mainImage: { width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', display: 'block' },
  noImagePlaceholder: { width: '100%', height: '300px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 'bold' },
  contentBody: { fontSize: '1.2rem', lineHeight: '1.8', color: '#334155', whiteSpace: 'pre-wrap', fontWeight: '400' },

  // RIGHT COLUMN
  rightColumn: { display: 'flex', flexDirection: 'column' },
  
  // Author Card
  authorCard: { backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  authorImageWrapper: { width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', marginBottom: '15px', border: '4px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },
  authorImage: { width: '100%', height: '100%', objectFit: 'cover' },
  authorPlaceholder: { width: '100%', height: '100%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '2.5rem' },
  authorName: { margin: '0 0 5px 0', fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' },
  dateText: { margin: '0 0 15px 0', color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center' },
  authorBadge: { backgroundColor: '#f0fdf4', color: '#27ae60', padding: '6px 16px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },

  // Recent Posts
  recentSection: { backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: '24px', padding: '25px', border: '1px solid rgba(0,0,0,0.03)' },
  recentHeader: { margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '10px' },
  recentList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  recentCard: { display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none', padding: '10px' },
  recentImageWrapper: { width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 },
  recentImage: { width: '100%', height: '100%', objectFit: 'cover' },
  recentPlaceholder: { width: '100%', height: '100%', backgroundColor: '#e2e8f0' },
  recentInfo: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  recentTitle: { margin: '0 0 5px 0', fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', lineHeight: '1.3' },
  recentDate: { margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }
};

export default BlogDetailsPage;