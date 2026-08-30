import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa'; 
import API from '../api';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);



  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  // 1. Updated State with ALL fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    image: '', 
    description: '',
    price: '',
    stock: 0,
    about: '',               // New
    keyBenefits: '',         // New
    usageInfo: '',           // New
    recommendeddosage: '',   // New
    manufacturingInfo: '',   // New
    highlights: '',          // New
    safetyInfo: ''           // New (Requested in JSX)
  });

  const [imageFile, setImageFile] = useState(null); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]); 
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setImageFile(null);
    setFormData({
      name: '',
      category: 'vegetables',
      image: '',
      description: '',
      price: '',
      stock: 0,
      about: '',
      keyBenefits: '',
      usageInfo: '',
      recommendeddosage: '',
      manufacturingInfo: '',
      highlights: '',
      safetyInfo: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setImageFile(null);
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image, 
      description: product.description,
      price: product.price,
      stock: product.stock,
      about: product.about || '',
      keyBenefits: product.keyBenefits || '', 
      usageInfo: product.usageInfo || '', 
      recommendeddosage: product.recommendeddosage || '', 
      manufacturingInfo: product.manufacturingInfo || '', 
      highlights: product.highlights || '',
      safetyInfo: product.safetyInfo || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await API.delete(`/products/${id}`);
        alert("Product Deleted!");
        fetchProducts(); 
      } catch (err) {
        console.error(err);
        alert("Failed to delete product");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);

      // 2. Append ALL New Fields
      submitData.append('about', formData.about);
      submitData.append('keyBenefits', formData.keyBenefits);
      submitData.append('usageInfo', formData.usageInfo);
      submitData.append('recommendeddosage', formData.recommendeddosage);
      submitData.append('manufacturingInfo', formData.manufacturingInfo);
      submitData.append('highlights', formData.highlights);
      submitData.append('safetyInfo', formData.safetyInfo);

      if (imageFile) {
        submitData.append('image', imageFile); 
      } else {
        submitData.append('image', formData.image); 
      }

      if (isEditing) {
        await API.put(`/products/${currentProductId}`, submitData);
        alert('Product Updated Successfully!');
      } else {
        await API.post('/products', submitData);
        alert('Product Created Successfully!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    }
  };

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  if (loading) return <h3 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Inventory...</h3>;

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2>Inventory Management 📦</h2>
        <button style={styles.createButton} onClick={openCreateModal}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{isEditing ? 'Edit Product' : 'Create Product'}</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}><FaTimes /></button>
            </div>

            <form onSubmit={handleFormSubmit} style={styles.form}>
              <input name="name" placeholder="Product Name" value={formData.name} onChange={handleFormChange} required style={styles.input} />
              
              <div style={{marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '5px'}}>
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Option 1: Image URL</label>
                  <input name="image" placeholder="https://example.com/image.png" value={formData.image} onChange={handleFormChange} style={styles.input} />
                  
                  <div style={{textAlign:'center', margin: '5px 0', fontSize:'12px'}}>OR</div>
                  
                  <label style={{fontSize:'12px', fontWeight:'bold'}}>Option 2: Upload File (PNG)</label>
                  <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} style={{marginTop:'5px'}} />
              </div>

              {/* 3. New Text Areas Section */}
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                  <p style={{fontSize: '12px', fontWeight: 'bold', color: '#555', marginBottom: '5px'}}>Product Details</p>
                  
                  <textarea name="description" placeholder="Main Description" value={formData.description} onChange={handleFormChange} required style={{...styles.input, height: '60px'}} />
                  
                  <textarea name="about" placeholder="About This Product (Extra Info)" value={formData.about} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />

                  <textarea name="keyBenefits" placeholder="Key Benefits (Enter bullet points)" value={formData.keyBenefits} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />

                  <textarea name="highlights" placeholder="Product Highlights" value={formData.highlights} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />

                  <div style={{display:'flex', gap:'5px'}}>
                    <textarea name="usageInfo" placeholder="Usage / How to Use" value={formData.usageInfo} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />
                    <textarea name="recommendeddosage" placeholder="Recommended Dosage" value={formData.recommendeddosage} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />
                  </div>

                  <div style={{display:'flex', gap:'5px'}}>
                    <textarea name="manufacturingInfo" placeholder="Manufacturing Info" value={formData.manufacturingInfo} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />
                    <textarea name="safetyInfo" placeholder="Safety Information" value={formData.safetyInfo} onChange={handleFormChange} style={{...styles.input, height: '60px'}} />
                  </div>
              </div>

              <div style={{display:'flex', gap:'10px'}}>
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleFormChange} required style={styles.input} />
                <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleFormChange} required style={styles.input} />
              </div>

              <select name="category" value={formData.category} onChange={handleFormChange} style={styles.input}>
                  <option value="vegetables">Vegetables</option>
                  <option value="powders">Raw Powders</option>
              </select>

              <button type="submit" style={styles.submitBtn}>
                {isEditing ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={{background: '#eee'}}>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{borderBottom: '1px solid #eee'}}>
                <td style={styles.td}>
                    <img 
                        src={renderImageSrc(p.image)} 
                        alt={p.name} 
                        style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px'}} 
                    />
                </td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>₹{p.price}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => openEditModal(p)} style={styles.editBtn}>
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// BASIC STYLES
const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
  headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  createButton: { background: '#27ae60', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  // Increased width to fit new fields comfortably
  modalContent: { background: 'white', padding: '20px', borderRadius: '8px', width: '600px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%', boxSizing: 'border-box', marginBottom: '5px', fontFamily: 'inherit' },
  submitBtn: { padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  tableContainer: { overflowX: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.05)', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  td: { padding: '12px', verticalAlign: 'middle' },
  editBtn: { padding: '6px 12px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  deleteBtn: { padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }
};

export default InventoryPage;