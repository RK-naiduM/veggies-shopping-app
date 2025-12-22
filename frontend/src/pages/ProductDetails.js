import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        //const res = await axios.get(`http://localhost:5000/api/products`);
        const res = await API.get('/products');
        const foundProduct = res.data.find(p => p._id === id);
        setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <h2>Loading...</h2>;

  // --- STOCK & LIMIT LOGIC ---
  const MAX_PER_ORDER = 10; // 1. Define the limit
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  
  // 2. Calculate the "True Limit" for this transaction
  // It is the smaller of: The available stock OR the Limit of 10
  const effectiveLimit = Math.min(product.stock, MAX_PER_ORDER);

  return (
    <div style={styles.container}>
      
      {/* Left: Image */}
      <img src={product.image} alt={product.name} style={styles.image} />

      {/* Right: Details */}
      <div style={styles.details}>
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.description}>{product.description}</p>
        <h2 style={styles.price}>${product.price}</h2>

        {/* --- DYNAMIC STOCK STATUS MESSAGE --- */}
        <div style={{ margin: '10px 0' }}>
          {isOutOfStock ? (
            <p style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '18px' }}>
              ❌ Out of Stock
            </p>
          ) : isLowStock ? (
            <p style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '18px' }}>
              🔥 Hurry! Only {product.stock} left in stock!
            </p>
          ) : (
            <p style={{ color: '#27ae60', fontWeight: 'bold', fontSize: '18px' }}>
              ✅ In Stock
            </p>
          )}

          {/* New Note: Show Max Limit Message if stock is healthy */}
          {!isOutOfStock && product.stock > 10 && (
             <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
               (Max 10 units per order)
             </p>
           )}
        </div>

        {/* --- QUANTITY SELECTOR --- */}
        {!isOutOfStock && (
          <div style={styles.quantityContainer}>
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={styles.qtyButton}
            > - </button>
            
            <span style={styles.qtyNumber}>{quantity}</span>
            
            <button 
              onClick={() => setQuantity(q => Math.min(effectiveLimit, q + 1))} 
              style={{
                ...styles.qtyButton,
                opacity: quantity >= effectiveLimit ? 0.5 : 1, // Visual cue if disabled
                cursor: quantity >= effectiveLimit ? 'not-allowed' : 'pointer'
              }}
              disabled={quantity >= effectiveLimit} // Disable if limit reached
            > + </button>
          </div>
        )}

        {/* --- ADD TO CART BUTTON --- */}
        <button 
          onClick={() => {
            addToCart(product, quantity);
            navigate('/');
          }}
          disabled={isOutOfStock}
          style={{
            ...styles.addButton,
            backgroundColor: isOutOfStock ? '#bdc3c7' : '#e67e22', 
            cursor: isOutOfStock ? 'not-allowed' : 'pointer'
          }}
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>

      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    display: 'flex',
    gap: '40px',
    maxWidth: '900px',
    margin: '0 auto',
    flexWrap: 'wrap'
  },
  image: {
    width: '400px',
    maxWidth: '100%',
    borderRadius: '10px',
    objectFit: 'cover'
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    marginBottom: '10px',
    color: '#2c3e50'
  },
  description: {
    color: '#555',
    fontSize: '18px',
    marginBottom: '20px'
  },
  price: {
    color: '#27ae60',
    fontSize: '28px',
    marginBottom: '10px'
  },
  quantityContainer: {
    margin: '20px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  qtyButton: {
    padding: '5px 15px',
    fontSize: '20px',
    cursor: 'pointer',
    backgroundColor: '#ecf0f1',
    border: '1px solid #bdc3c7',
    borderRadius: '5px'
  },
  qtyNumber: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  addButton: {
    padding: '15px 30px',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    marginTop: '20px',
    borderRadius: '5px',
    width: '100%'
  }
};

export default ProductDetails;