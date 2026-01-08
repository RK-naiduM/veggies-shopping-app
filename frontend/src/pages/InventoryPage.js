import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTimes, FaEdit } from 'react-icons/fa'; // Added FaEdit
import API from '../api';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStocks, setUpdatedStocks] = useState({});

  // --- STATE FOR FORM (Create & Edit) ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if we are editing
  const [currentProductId, setCurrentProductId] = useState(null); // Track which ID we are editing
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables', 
    image: '',
    description: '',
    price: '',
    stock: 0
  });

  // 1. Fetch Products
  useEffect(() => {
    fetchProducts();
    const intervalId = setInterval(fetchProducts, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  // 2. Handle Stock Input Change
  const handleStockChange = (id, value) => {
    setUpdatedStocks({ ...updatedStocks, [id]: value });
  };

  // 3. Save Stock Only
  const handleUpdateStock = async (id) => {
    const newStock = updatedStocks[id];
    if (newStock === undefined || newStock === "") return;

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

      await API.put(`/products/${id}/stock`, { stock: newStock }, config);
      
      alert('Stock Updated Successfully!');
      fetchProducts();
      
      const remainingUpdates = { ...updatedStocks };
      delete remainingUpdates[id];
      setUpdatedStocks(remainingUpdates);

    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Failed to update stock.");
    }
  };

  // --- 4. Handle Form Inputs ---
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 5. OPEN CREATE MODAL ---
  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({ name: '', category: 'vegetables', image: '', description: '', price: '', stock: 0 });
    setShowModal(true);
  };

  // --- 6. OPEN EDIT MODAL ---
  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    // Pre-fill form with existing data
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.description,
      price: product.price,
      stock: product.stock // (Optional: usually we don't edit stock here if you have a separate stock updater, but we can keep it)
    });
    setShowModal(true);
  };

  // --- 7. SUBMIT FORM (Create or Update) ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } };

    try {
      if (isEditing) {
        // === UPDATE EXISTING PRODUCT ===
        await API.put(`/products/${currentProductId}`, formData, config);
        alert('Product Updated Successfully! ✏️');
      } else {
        // === CREATE NEW PRODUCT ===
        await API.post('/products', formData, config);
        alert('Product Created Successfully! 🎉');
      }

      // Cleanup
      setShowModal(false);
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Inventory...</div>;

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={styles.headerContainer}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>Inventory Management 📦</h2>
        <button style={styles.createButton} onClick={openCreateModal}>
          <FaPlus /> Add New Product
        </button>
      </div>

      {/* --- MODAL (Shared for Create & Edit) --- */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{isEditing ? 'Edit Product' : 'Create New Product'}</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} style={styles.form}>
              <label style={styles.label}>Category</label>
              <select name="category" value={formData.category} onChange={handleFormChange} style={styles.modalInput}>
                <option value="vegetables">vegetables</option>
                <option value="powders">powders</option>
              </select>

              <label style={styles.label}>Product Name</label>
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} required style={styles.modalInput}/>

              <label style={styles.label}>Image Link</label>
              <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleFormChange} required style={styles.modalInput}/>

              <label style={styles.label}>Description</label>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleFormChange} required style={{...styles.modalInput, height: '60px'}}/>

              <label style={styles.label}>Price</label>
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleFormChange} required style={styles.modalInput}/>

              <button type="submit" style={isEditing ? styles.updateButton : styles.createButtonModal}>
                {isEditing ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Update Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={styles.row}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={product.image} alt={product.name} style={styles.productImg} />
                    <strong>{product.name}</strong>
                  </div>
                </td>
                <td style={styles.td}>₹{product.price}</td>
                <td style={styles.td}>{product.category}</td>
                <td style={styles.td}>{product.description?.substring(0, 30)}...</td>
                
                {/* Current Stock */}
                <td style={styles.td}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    backgroundColor: product.stock > 0 ? '#eafaf1' : '#fdedec',
                    color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {product.stock || 0}
                  </span>
                </td>

                {/* Stock Update Input */}
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                      type="number" 
                      placeholder="+/-"
                      value={updatedStocks[product._id] !== undefined ? updatedStocks[product._id] : ''}
                      onChange={(e) => handleStockChange(product._id, e.target.value)}
                      style={styles.input}
                    />
                    <button onClick={() => handleUpdateStock(product._id)} style={styles.saveButton} title="Save Stock">
                      <FaSave />
                    </button>
                  </div>
                </td>

                {/* Edit Action */}
                <td style={styles.td}>
                  <button onClick={() => openEditModal(product)} style={styles.editButton} title="Edit Details">
                    <FaEdit /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', position: 'relative' },
  headerContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  createButton: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold' },
  tableContainer: { boxShadow: '0 4px 8px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  headerRow: { backgroundColor: '#2c3e50', color: 'white' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '15px', verticalAlign: 'middle' },
  productImg: { width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' },
  input: { padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '60px' },
  
  // Buttons
  saveButton: { padding: '8px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  editButton: { padding: '8px 12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },

  // Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeButton: { background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  label: { fontWeight: 'bold', fontSize: '14px', color: '#555' },
  modalInput: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' },
  createButtonModal: { padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' },
  updateButton: { padding: '12px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }
};

export default InventoryPage;