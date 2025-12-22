import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSave, FaclipboardList } from 'react-icons/fa';
import API from '../api';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatedStocks, setUpdatedStocks] = useState({}); // Stores changes before saving

// 1. Fetch All Products (Initial + Polling)
  useEffect(() => {
    fetchProducts(); // Fetch immediately on load

    // Set up a timer to fetch every 5 seconds
    const intervalId = setInterval(() => {
      fetchProducts();
    }, 5000);

    // Cleanup: Stop the timer when the Admin leaves the page
    return () => clearInterval(intervalId);
  }, []);

  const fetchProducts = async () => {
    try {
      //const res = await axios.get('http://localhost:5000/api/products');
      const res = await API.get('/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  // 2. Handle Input Change
  const handleStockChange = (id, value) => {
    setUpdatedStocks({
      ...updatedStocks,
      [id]: value
    });
  };

  // 3. Save Stock to Backend
  const handleUpdateStock = async (id) => {
    const newStock = updatedStocks[id];
    if (newStock === undefined || newStock === "") return; // Don't save empty

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      };

      //await axios.put(`http://localhost:5000/api/products/${id}/stock`, { stock: newStock }, config);
      await API.put(`/products/${id}/stock`, { stock: newStock });
      
      alert('Stock Updated Successfully!');
      // Refresh list to show confirmed data from DB
      fetchProducts();
      
      // Clear the "pending change" for this item
      const remainingUpdates = { ...updatedStocks };
      delete remainingUpdates[id];
      setUpdatedStocks(remainingUpdates);

    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Failed to update stock. Are you an Admin?");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Inventory...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '30px', color: '#2c3e50' }}>Inventory Management 📦</h2>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Product Name</th>
              <th style={styles.th}>Current Stock</th>
              <th style={styles.th}>Update Stock</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={styles.row}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} />
                    <strong>{product.name}</strong>
                  </div>
                </td>
                
                {/* Current Stock Display */}
                <td style={styles.td}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '15px', 
                    backgroundColor: product.stock > 0 ? '#eafaf1' : '#fdedec',
                    color: product.stock > 0 ? '#27ae60' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {product.stock !== undefined ? product.stock : '0'}
                  </span>
                </td>

                {/* Input Field */}
                <td style={styles.td}>
                  <input 
                    type="number" 
                    placeholder="Add Qty"  // <--- CHANGED FROM "New Count" TO "Add Qty"
                    value={updatedStocks[product._id] !== undefined ? updatedStocks[product._id] : ''}
                    onChange={(e) => handleStockChange(product._id, e.target.value)}
                    style={styles.input}
                  />
                </td>

                {/* Save Button */}
                <td style={styles.td}>
                  <button 
                    onClick={() => handleUpdateStock(product._id)}
                    style={styles.saveButton}
                  >
                    <FaSave /> Save
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

const styles = {
  container: { padding: '30px', maxWidth: '1000px', margin: '0 auto' },
  tableContainer: { boxShadow: '0 4px 8px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  headerRow: { backgroundColor: '#2c3e50', color: 'white' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  row: { borderBottom: '1px solid #eee' },
  td: { padding: '15px', verticalAlign: 'middle' },
  input: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100px'
  },
  saveButton: {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  }
};

export default InventoryPage;