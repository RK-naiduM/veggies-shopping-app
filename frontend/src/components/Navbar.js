import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaSearch, FaUser, FaShoppingCart, FaSignOutAlt, 
  FaLock, FaBars, FaTimes, FaChevronDown 
} from 'react-icons/fa';
import gsap from 'gsap';
import logo from '../assets/logo.png';
import API from '../api';

const Navbar = ({ user, cartCount, handleLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  // Responsive States
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  const navigate = useNavigate();
  const navRef = useRef(null);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
        if (window.innerWidth >= 1024) {
            setIsMenuOpen(false); 
        }
    };
    window.addEventListener('resize', handleResize);
    
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setAllProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      searchResults.length > 0 && setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsMenuOpen(false); 
    navigate(`/product/${id}`);
  };

  const handleLinkClick = () => {
      setIsMenuOpen(false); 
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }, navRef);
    return () => ctx.revert();
  }, []);

  const styles = getStyles(isMobile);

  return (
    <nav ref={navRef} style={styles.navbar}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          .nav-link {
            position: relative;
            color: #475569;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: color 0.3s ease;
          }
          .nav-link:hover { color: #27ae60; }
          
          .search-input { transition: all 0.3s ease; }
          .search-input:focus {
            outline: none;
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
          }

          .action-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          }
          
          .dropdown-menu {
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .dropdown-container:hover .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          .dropdown-item { transition: background-color 0.2s ease, color 0.2s ease; }
          .dropdown-item:hover {
            background-color: #f0fdf4;
            color: #27ae60 !important;
          }

          .mobile-menu {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease;
            opacity: 0;
          }
          .mobile-menu.open {
            max-height: 800px; 
            opacity: 1;
          }
          
          @media (max-width: 400px) {
            .brand-text { font-size: 1rem !important; }
          }
        `}
      </style>

      {/* --- TOP BAR (Logo Left, Menu/Links Right) --- */}
      <div style={styles.navInner}>
        
        {/* 1. LOGO CONTAINER */}
        <Link 
          to={user ? "/shop" : "/"} 
          onClick={handleLinkClick} 
          style={styles.logoContainer}
        >
          <img 
            src={logo} 
            alt="Agro Tech Harvest Logo" 
            style={styles.logoImage} 
          />
          <span className="brand-text" style={styles.brandName}>Agro Tech Harvest</span>
        </Link>

        {/* 2. DESKTOP CENTER */}
        {!isMobile && (
          <div style={styles.centerContainer}>
            {user ? (
              <div style={styles.searchWrapper}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                  style={styles.searchInput}
                />
                <button style={styles.searchBtn}><FaSearch /></button>
                
                {searchTerm && searchResults.length > 0 && (
                  <div style={styles.searchResultsBox}>
                    {searchResults.map(product => {
                        const imageUrl = product.image?.startsWith('http') 
                            ? product.image 
                            : `${BACKEND_URL}/images/${product.image}`;
                        return (
                          <div key={product._id} className="dropdown-item" style={styles.searchItem} onClick={() => handleResultClick(product._id)}>
                            <img src={imageUrl} alt={product.name} style={styles.searchItemImg} />
                            <span style={{ fontWeight: '600' }}>{product.name}</span>
                          </div>
                        );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.desktopLinks}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About Us</Link>
                <Link to="/blog" className="nav-link">Blog</Link>
                <Link to="/all-products" className="nav-link">Shop</Link>
                <Link to="/bulk-order" className="nav-link">Bulk Order</Link>
                <Link to="/contact" className="nav-link">Contact Us</Link>
              </div>
            )}
          </div>
        )}

        {/* 3. DESKTOP RIGHT */}
        {!isMobile && (
          <div style={styles.rightContainer}>
            {!user ? (
              <>
                <Link to="/login" className="nav-link" style={{ marginRight: '20px', color: '#0f172a', fontWeight: '800' }}>Login</Link>
                <Link to="/signup" className="action-btn" style={styles.signupBtn}>Sign Up</Link>
              </>
            ) : (
              <div style={styles.loggedInActions}>
                <div className="dropdown-container" style={styles.dropdownContainer}>
                  <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    Categories <FaChevronDown size="0.8em"/>
                  </span>
                  <div className="dropdown-menu" style={styles.dropdownMenu}>
                    <Link to="/category/vegetables" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Vegetables</Link>
                    <Link to="/category/powders" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Raw Powders</Link>
                  </div>
                </div>

                {/* 🔴 ADMIN DROPDOWN (Updated with Blogs) */}
                {user.isAdmin && (
                  <div className="dropdown-container" style={styles.dropdownContainer}>
                    <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#dc2626' }}>
                      <FaLock /> Admin <FaChevronDown size="0.8em"/>
                    </span>
                    <div className="dropdown-menu" style={styles.dropdownMenu}>
                      <Link to="/admin" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Dashboard</Link>
                      <Link to="/admin/inventory" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Inventory</Link>
                      <Link to="/admin/contacts" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Contact Us</Link>
                      <Link to="/admin/blogs" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Blogs</Link>
                      <Link to="/admin/bulk-orders" className="dropdown-item" style={styles.dropdownItem} onClick={handleLinkClick}>Bulk Orders</Link>

                    </div>
                  </div>
                )}

                <Link to="/profile" className="nav-link action-btn" style={styles.iconLink}>
                  <FaUser />
                </Link>
                
                <Link to="/cart" className="nav-link action-btn" style={styles.cartLink}>
                  <FaShoppingCart /> 
                  {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                </Link>

                <button onClick={() => { handleLogout(); handleLinkClick(); }} className="action-btn" style={styles.logoutBtn}>
                  <FaSignOutAlt style={{ marginRight: '5px' }}/> Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. MOBILE HAMBURGER ICON */}
        {isMobile && (
          <button style={styles.hamburgerBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}
      </div>

      {/* --- MOBILE MENU FOLD DOWN --- */}
      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} style={styles.mobileMenuWrapper}>
          <div style={styles.mobileMenuInner}>
            
            {user && (
              <div style={{ ...styles.searchWrapper, width: '100%', marginBottom: '20px' }}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                  style={{ ...styles.searchInput, width: '100%' }}
                />
                {searchTerm && searchResults.length > 0 && (
                  <div style={{...styles.searchResultsBox, position: 'relative', width: '100%', top: '5px', boxShadow: 'none', border: '1px solid #e2e8f0'}}>
                    {searchResults.map(product => {
                        const imageUrl = product.image?.startsWith('http') ? product.image : `${BACKEND_URL}/images/${product.image}`;
                        return (
                          <div key={product._id} className="dropdown-item" style={styles.searchItem} onClick={() => handleResultClick(product._id)}>
                            <img src={imageUrl} alt={product.name} style={styles.searchItemImg} />
                            <span>{product.name}</span>
                          </div>
                        );
                    })}
                  </div>
                )}
              </div>
            )}

            <div style={styles.mobileLinksContainer}>
              {!user ? (
                <>
                  <Link to="/" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Home</Link>
                  <Link to="/about" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>About Us</Link>
                  <Link to="/blog" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Blog</Link>
                  <Link to="/all-products" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Shop</Link>
                  <Link to="/contact" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Contact Us</Link>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '15px 0' }}></div>
                  <Link to="/login" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Login</Link>
                  <Link to="/signup" className="action-btn" onClick={handleLinkClick} style={{...styles.signupBtn, width: '100%', marginTop: '10px'}}>Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/shop" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Dashboard</Link>
                  <Link to="/category/vegetables" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Vegetables</Link>
                  <Link to="/category/powders" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Raw Powders</Link>
                  
                  {/* 🔴 ADMIN MOBILE SECTION (Updated with Blogs) */}
                  {user.isAdmin && (
                    <>
                      <div style={{ height: '1px', background: '#e2e8f0', margin: '10px 0' }}></div>
                      <span style={{ color: '#dc2626', fontWeight: '800', padding: '10px 0', display: 'block' }}><FaLock/> Admin Panel</span>
                      <Link to="/admin" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Dashboard</Link>
                      <Link to="/admin/inventory" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Inventory</Link>
                      <Link to="/admin/contacts" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Contact Us</Link>
                      <Link to="/admin/blogs" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}>Blogs</Link>
                    </>
                  )}

                  <div style={{ height: '1px', background: '#e2e8f0', margin: '15px 0' }}></div>
                  
                  <Link to="/profile" className="nav-link" onClick={handleLinkClick} style={styles.mobileLink}><FaUser style={{marginRight: '10px'}}/> Profile</Link>
                  <Link to="/cart" className="nav-link" onClick={handleLinkClick} style={{...styles.mobileLink, display: 'flex', alignItems: 'center'}}>
                    <FaShoppingCart style={{marginRight: '10px'}}/> Cart
                    {cartCount > 0 && <span style={{...styles.cartBadge, position: 'static', marginLeft: '10px'}}>{cartCount}</span>}
                  </Link>
                  
                  <button onClick={() => { handleLogout(); handleLinkClick(); }} className="action-btn" style={{...styles.logoutBtn, width: '100%', marginTop: '15px'}}>
                    <FaSignOutAlt style={{ marginRight: '5px' }}/> Logout
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

// --- STYLES ---
const getStyles = (isMobile) => ({
  navbar: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)',
    width: '100%',
    boxSizing: 'border-box'
  },
  navInner: {
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap', 
    padding: isMobile ? '12px 20px' : '15px 40px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row', 
    alignItems: 'center',
    flexWrap: 'nowrap', 
    gap: '10px',
    textDecoration: 'none',
    flexShrink: 0 
  },
  logoImage: {
    width: isMobile ? '40px' : '45px', 
    height: isMobile ? '40px' : '45px',
    minWidth: isMobile ? '40px' : '45px',
    minHeight: isMobile ? '40px' : '45px',
    maxWidth: isMobile ? '40px' : '45px',
    maxHeight: isMobile ? '40px' : '45px',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0 
  },
  brandName: {
    color: '#0f172a',
    margin: 0,
    fontSize: isMobile ? '1.2rem' : '1.4rem', 
    fontWeight: '800',
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap', 
    flexShrink: 0
  },
  hamburgerBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#0f172a',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0 
  },
  centerContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 40px'
  },
  desktopLinks: {
    display: 'flex',
    gap: '35px',
    alignItems: 'center'
  },
  searchWrapper: {
    position: 'relative',
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    width: '100%',
    padding: '12px 45px 12px 20px',
    borderRadius: '50px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '0.95rem',
    color: '#0f172a',
    boxSizing: 'border-box'
  },
  searchBtn: {
    position: 'absolute',
    right: '15px',
    background: 'none',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    fontSize: '1.1rem'
  },
  searchResultsBox: {
    position: 'absolute',
    top: '110%',
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    zIndex: 100
  },
  searchItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#0f172a',
    borderBottom: '1px solid #f1f5f9'
  },
  searchItemImg: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    objectFit: 'cover',
    marginRight: '15px'
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  loggedInActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px'
  },
  dropdownContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    minWidth: '180px',
    padding: '10px 0',
    zIndex: 100,
    marginTop: '15px' 
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 20px',
    color: '#475569',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  iconLink: {
    fontSize: '1.2rem',
    color: '#475569',
    display: 'flex',
    alignItems: 'center'
  },
  cartLink: {
    fontSize: '1.2rem',
    color: '#475569',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-12px',
    backgroundColor: '#e67e22',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: '800',
    height: '20px',
    minWidth: '20px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 4px',
    border: '2px solid white'
  },
  signupBtn: {
    padding: '10px 28px',
    backgroundColor: '#27ae60',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.95rem',
    textAlign: 'center'
  },
  logoutBtn: {
    padding: '8px 20px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '50px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  mobileMenuWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(16px)',
    borderTop: '1px solid #f1f5f9'
  },
  mobileMenuInner: {
    padding: '20px 20px 40px 20px'
  },
  mobileLinksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  mobileLink: {
    fontSize: '1.1rem',
    padding: '10px 0',
    display: 'block'
  }
});

export default Navbar;