import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTimes, FaEdit, FaTrash, FaPenNib } from 'react-icons/fa'; 
import gsap from 'gsap';
import API from '../api';

const AdminBlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    content: ''
  });

  // 🔴 FIXED: State for the two physical files (No more featuredImages array)
  const [authorPhotoFile, setAuthorPhotoFile] = useState(null);
  const [blogImageFile, setBlogImageFile] = useState(null);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  const getUserConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) return null;
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

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

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔴 FIXED: File Handlers
  const handleAuthorPhotoChange = (e) => {
    setAuthorPhotoFile(e.target.files[0]);
  };

  const handleBlogImageChange = (e) => {
    setBlogImageFile(e.target.files[0]);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentBlogId(null);
    setAuthorPhotoFile(null);
    setBlogImageFile(null); // Reset single image state
    setFormData({ title: '', authorName: '', content: '' });
    setShowModal(true);
  };

  const openEditModal = (blog) => {
    setIsEditing(true);
    setCurrentBlogId(blog._id);
    setAuthorPhotoFile(null);
    setBlogImageFile(null); // Reset single image state
    setFormData({
      title: blog.title,
      authorName: blog.authorName,
      content: blog.content
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        await API.delete(`/blogs/${id}`, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        alert("Blog post deleted!");
        fetchBlogs(); 
      } catch (err) {
        console.error(err);
        alert("Failed to delete blog post");
      }
    }
  };

  // 🔴 FIXED: Form Submit uses 'blogImage' to match Backend Multer
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const config = getUserConfig();
      if (!config) return alert("Not authorized");

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('authorName', formData.authorName);
      submitData.append('content', formData.content);

      if (authorPhotoFile) {
        submitData.append('authorPhoto', authorPhotoFile);
      }

      if (blogImageFile) {
        submitData.append('blogImage', blogImageFile);
      }

      if (isEditing) {
        await API.put(`/blogs/${currentBlogId}`, submitData, config);
        alert('Blog updated successfully!');
      } else {
        await API.post('/blogs', submitData, config);
        alert('Blog created successfully!');
      }

      setShowModal(false);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save blog post.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderImageSrc = (imgString) => {
    if (!imgString) return '';
    if (imgString.startsWith('http')) return imgString;
    return `${BACKEND_URL}/images/${imgString}`;
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (loading || blogs.length === 0) return;
    let ctx = gsap.context(() => {
      gsap.fromTo('.page-header-anim', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" });
      gsap.fromTo('.blog-row-anim', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power3.out", delay: 0.2 });
    }, compRef);
    return () => ctx.revert();
  }, [loading, blogs.length]);

  useEffect(() => {
    if (showModal) {
      gsap.fromTo('.modal-content-anim', { scale: 0.95, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" });
      gsap.fromTo('.modal-overlay-anim', { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, [showModal]);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          @keyframes gradientFloat { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .ambient-bg { background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb); background-size: 400% 400%; animation: gradientFloat 15s ease infinite; min-height: 100vh; }
          .fancy-input { transition: all 0.3s ease; }
          .fancy-input:focus { outline: none; border-color: #27ae60 !important; box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important; }
          .action-btn { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .action-btn:hover { transform: translateY(-2px); }
          .create-btn:hover { box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3) !important; transform: translateY(-3px); }
          .edit-btn:hover { background-color: #eef2ff !important; color: #2563eb !important; border-color: #bfdbfe !important; }
          .delete-btn:hover { background-color: #fef2f2 !important; color: #dc2626 !important; border-color: #fecaca !important; }
          .modal-scroll::-webkit-scrollbar { width: 8px; }
          .modal-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
          .modal-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}
      </style>

      <div style={styles.container}>
        <div className="page-header-anim" style={styles.headerContainer}>
          <div>
            <h1 style={styles.pageTitle}><FaPenNib style={{color: '#27ae60', marginRight: '10px'}}/> Blog Management</h1>
            <p style={styles.subtitle}>Write, edit, and manage your farm-to-table stories.</p>
          </div>
          <button className="action-btn create-btn" style={styles.createButton} onClick={openCreateModal}>
            <FaPlus /> Write New Post
          </button>
        </div>

        {showModal && (
          <div className="modal-overlay-anim" style={styles.modalOverlay}>
            <div className="modal-content-anim" style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
                <button onClick={() => setShowModal(false)} style={styles.closeBtn}><FaTimes /></button>
              </div>

              <form onSubmit={handleFormSubmit} style={styles.form}>
                <div className="modal-scroll" style={styles.scrollableDetailsArea}>
                  
                  <label style={styles.label}>Post Title</label>
                  <input name="title" placeholder="E.g., The Secret Behind Our Turmeric..." value={formData.title} onChange={handleFormChange} required className="fancy-input" style={styles.input} />
                  
                  <label style={styles.label}>Author Name</label>
                  <input name="authorName" placeholder="E.g., Pranay M." value={formData.authorName} onChange={handleFormChange} required className="fancy-input" style={styles.input} />

                  <div style={styles.uploadBox}>
                    <label style={styles.label}>Upload Author Photo (Optional)</label>
                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleAuthorPhotoChange} style={styles.fileInput} />
                  </div>

                  <div style={styles.uploadBox}>
                    <label style={styles.label}>Upload Blog Image</label>
                    {/* 🔴 FIXED: Single file upload for blogImage */}
                    <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleBlogImageChange} style={styles.fileInput} required={!isEditing} />
                  </div>

                  <label style={styles.label}>Blog Content</label>
                  {/* 🔴 FIXED: Added flexShrink: 0 and minHeight so it doesn't get squeezed! */}
                  <textarea name="content" placeholder="Start writing your story here..." value={formData.content} onChange={handleFormChange} required className="fancy-input" style={{...styles.input, minHeight: '250px', flexShrink: 0, resize: 'vertical'}} />
                  
                </div>

                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                  <button type="submit" className="action-btn" style={styles.submitBtn}>
                    {isEditing ? 'Save Changes' : 'Publish Post'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {blogs.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3 style={{color: '#64748b'}}>No blog posts found. Time to write your first story!</h3>
          </div>
        ) : (
          <div style={styles.listContainer}>
            <div style={styles.listHeader}>
              <div style={{...styles.col, flex: '0 0 80px'}}>Image</div>
              <div style={{...styles.col, flex: '2'}}>Article Info</div>
              <div style={{...styles.col, flex: '1'}}>Author</div>
              <div style={{...styles.col, flex: '1'}}>Date Published</div>
              <div style={{...styles.col, flex: '0 0 100px', textAlign: 'right'}}>Actions</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {blogs.map((b) => (
                <div key={b._id} className="blog-row-anim" style={styles.listRow}>
                  <div style={{...styles.col, flex: '0 0 80px'}}>
                    <img src={renderImageSrc(b.blogImage)} alt="Blog" style={styles.imageThumb} />
                  </div>
                  <div style={{...styles.col, flex: '2'}}>
                    <p style={styles.rowTitle}>{b.title}</p>
                    <p style={styles.rowSub}>{b.content.substring(0, 60)}...</p>
                  </div>
                  <div style={{...styles.col, flex: '1', display: 'flex', alignItems: 'center', gap: '10px'}}>
                    {b.authorPhoto ? (
                       <img src={renderImageSrc(b.authorPhoto)} alt={b.authorName} style={styles.authorAvatar} />
                    ) : (
                       <div style={styles.authorAvatarPlaceholder}>{b.authorName.charAt(0)}</div>
                    )}
                    <span style={styles.catBadge}>{b.authorName}</span>
                  </div>
                  <div style={{...styles.col, flex: '1'}}>
                    <p style={styles.rowDate}>{formatDate(b.createdAt)}</p>
                  </div>
                  <div style={{...styles.col, flex: '0 0 100px', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                      <button onClick={() => openEditModal(b)} className="action-btn edit-btn" style={styles.editBtn}><FaEdit /></button>
                      <button onClick={() => handleDelete(b._id)} className="action-btn delete-btn" style={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: '#0f172a', overflowX: 'hidden' },
  loadingContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' },
  loadingText: { color: '#64748b', fontSize: '1.5rem', fontWeight: '700' },
  container: { padding: '60px 20px 100px 20px', maxWidth: '1200px', margin: '0 auto' },
  headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '20px', flexWrap: 'wrap', gap: '20px' },
  pageTitle: { margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-1px' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '1.1rem' },
  createButton: { background: '#27ae60', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '50px', cursor: 'pointer', display:'flex', alignItems:'center', gap:'8px', fontWeight: '800', fontSize: '1rem', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)' },
  emptyBox: { textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.6)', borderRadius: '24px', border: '1px dashed #cbd5e1' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { background: '#ffffff', padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  modalTitle: { margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' },
  closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#94a3b8', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' },
  scrollableDetailsArea: { flexGrow: 1, overflowY: 'auto', paddingRight: '10px', display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#334155', marginBottom: '5px' },
  input: { padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '12px', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '0.95rem', backgroundColor: '#f8fafc', color: '#0f172a' },
  uploadBox: { backgroundColor: '#f0fdf4', border: '1px dashed #86efac', borderRadius: '12px', padding: '15px' },
  fileInput: { fontSize: '0.9rem', color: '#475569', marginTop: '5px' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '10px' },
  cancelBtn: { padding: '12px 24px', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '50px', fontWeight: '700', cursor: 'pointer' },
  submitBtn: { padding: '12px 30px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '800' },

  listContainer: { width: '100%', overflowX: 'auto' },
  listHeader: { display: 'flex', padding: '15px 25px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', marginBottom: '15px', color: '#64748b', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase' },
  listRow: { display: 'flex', alignItems: 'center', padding: '20px 25px', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' },
  col: { paddingRight: '15px' },
  imageThumb: { width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' },
  rowTitle: { margin: '0 0 5px 0', fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' },
  rowSub: { margin: 0, color: '#64748b', fontSize: '0.9rem' },
  authorAvatar: { width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' },
  authorAvatarPlaceholder: { width: '35px', height: '35px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' },
  catBadge: { backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 12px', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700' },
  rowDate: { margin: 0, fontWeight: '600', color: '#475569', fontSize: '0.95rem' },
  editBtn: { padding: '10px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' },
  deleteBtn: { padding: '10px', background: 'white', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }
};

export default AdminBlogPage;