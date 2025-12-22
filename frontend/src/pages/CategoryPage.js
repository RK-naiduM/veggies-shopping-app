import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import API from '../api';

const CategoryPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // <--- New State for Search
  const { categoryName } = useParams(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const res = await axios.get(`http://localhost:5000/api/products/category/${categoryName}`);
        const res = await API.get(`/products/category/${categoryName}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
    // Reset search when changing categories
    setSearchTerm(''); 
  }, [categoryName]);

  // --- FILTER LOGIC ---
  // We create a new list based on what the user types
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Section with Title and Search Bar */}
      <div style={styles.headerContainer}>
        <h2 style={{ textTransform: 'capitalize', color: '#2c3e50' }}>
          {categoryName} Section
        </h2>
        
        {/* The New Search Bar */}
        <input 
          type="text" 
          placeholder={`Search in ${categoryName}...`} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      
      {/* Product Grid */}
      <div style={styles.grid}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} style={styles.card}>
              <img src={product.image} alt={product.name} style={styles.image} />
              
              {/* Group text together so it pushes to the top */}
              <div style={{ flexGrow: 1 }}> 
                <h3>{product.name}</h3>
                <p style={{ color: '#777', fontSize: '14px' }}>{product.description}</p>
              </div>

              {/* Price and Button stay at the bottom */}
              <div>
                <p style={styles.price}>${product.price}</p>
                <Link 
                  to={`/product/${product._id}`}
                  style={styles.detailsButton}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          /* Show this if search returns no results */
          <div style={{ width: '100%', textAlign: 'center', color: '#888' }}>
            <h3>No products found for "{searchTerm}"</h3>
          </div>
        )}
      </div>
    </div>
  );
};

// Internal CSS for this page
const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchInput: {
    padding: '10px 15px',
    width: '300px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none'
  },
  grid: {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '20px',
    justifyContent: 'center',
    // 'stretch' ensures all cards in the same row are the same height
    alignItems: 'stretch' 
  },
  card: {
    border: '1px solid #eee', 
    padding: '15px', 
    width: '220px', 
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Made shadow slightly nicer
    textAlign: 'center',
    backgroundColor: 'white',
    
    // --- NEW ALIGNMENT CODE STARTS HERE ---
    display: 'flex',            // Make the card itself a flex container
    flexDirection: 'column',    // Stack items vertically
    justifyContent: 'space-between' // Distribute space evenly
    // --- NEW ALIGNMENT CODE ENDS HERE ---
  },
  image: {
    width: '100%', 
    height: '150px', 
    objectFit: 'cover', 
    borderRadius: '5px',
    marginBottom: '10px'
  },
  // We wrap the text in a div so it groups together at the top
  textContainer: {
    flexGrow: 1, // This makes the text area take up all available space
  },
  price: {
    fontSize: '18px', 
    color: '#27ae60', 
    fontWeight: 'bold',
    margin: '10px 0'
  },
  detailsButton: {
    display: 'block', 
    textAlign: 'center', 
    backgroundColor: '#3498db', 
    color: 'white', 
    padding: '10px', 
    textDecoration: 'none', 
    borderRadius: '5px',
    marginTop: 'auto', // This forces the button to the very bottom
    fontWeight: 'bold'
  }
};

export default CategoryPage;