import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt, FaLock } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css';
import API from '../api';

const Navbar = ({ user, cartCount, handleLogout }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const res = await axios.get('http://localhost:5000/api/products');
        const res = await API.get('/products');
        setAllProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setSearchTerm('');
    setSearchResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="Agro Tech Harvest" className="logo-image" />
          <span className="logo-text">Agro Tech Harvest</span>
        </Link>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button><FaSearch /></button>
        </div>
        {searchTerm && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div key={product._id} className="search-item" onClick={() => handleResultClick(product._id)}>
                <img src={product.image} alt={product.name} />
                <span>{product.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        
        {/* Customer Categories Dropdown */}
        <div 
          className="dropdown"
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          <span className="dropdown-title">Categories ▾</span>
          {showCategories && (
            <div className="dropdown-menu">
              <Link to="/category/vegetables">Vegetables</Link>
              <Link to="/category/powders">Raw Powders</Link>
            </div>
          )}
        </div>

        {/* ADMIN TOOLS DROPDOWN */}
        {user && user.isAdmin && (
          <div className="dropdown">
            <span className="dropdown-title" style={{ color: '#e74c3c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <FaLock /> Admin ▾
            </span>
            <div className="dropdown-menu">
              <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛡️ Dashboard
              </Link>
              <Link to="/admin/inventory" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                📦 Inventory
              </Link>
            </div>
          </div>
        )}
        
        <Link to="/profile" className="icon-link">
          <FaUser /> <span className="link-text">Profile</span>
        </Link>
        
        <Link to="/cart" className="cart-btn">
          <FaShoppingCart /> 
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <button 
          onClick={handleLogout} 
          className="logout-btn"
          title="Logout"
        >
          <FaSignOutAlt />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;