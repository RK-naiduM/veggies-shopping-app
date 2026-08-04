import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage'; // Dashboard
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import AboutUsPage from './pages/AboutUsPage';
import AllProductsPage from './pages/AllProductsPage';
import ContactUsPage from './pages/ContactUsPage';
import AdminContactsPage from './pages/AdminContactsPage';
import AdminBlogPage from './pages/AdminBlogPage';
import BlogPage from './pages/BlogPage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import BulkOrderForm from './pages/BulkOrderForm';
import AdminBulkOrdersPage from './pages/AdminBulkOrdersPage';

function AppContent() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // --- 1. AUTH PERSISTENCE ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo'); 
    if (token && storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user]); 

  // --- 2. LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); 
    setCart([]); 
    window.location.href = '/'; // Send back to Landing Page
  };

  // --- 3. CART LOGIC ---
  const addToCart = (product, qty) => {
    if (!user) {
      alert("Please login to add items to your cart.");
      window.location.href = '/login';
      return;
    }
    const exist = cart.find((x) => x._id === product._id);
    const currentQtyInCart = exist ? exist.quantity : 0;
    const totalProposedQty = currentQtyInCart + qty;
    const MAX_LIMIT = 10;

    if (totalProposedQty > product.stock) {
      alert(`Cannot add more! Only ${product.stock} available in total.`);
      return; 
    }
    if (totalProposedQty > MAX_LIMIT) {
      alert(`Limit Exceeded! Max allowed is ${MAX_LIMIT} per order.`);
      return; 
    }

    if (exist) {
      setCart(cart.map((x) => x._id === product._id ? { ...exist, quantity: totalProposedQty } : x));
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; 
      }
      return item;
    }));
  };

  return (
    <>
      {/* 🔴 UNIFIED GLOBAL NAVBAR */}
      {/* It now renders unconditionally and adapts based on the 'user' prop */}
      <Navbar user={user} cartCount={cart.length} handleLogout={handleLogout} />
      
      <ScrollToTop />
      
      {/* Main Content Wrapper */}
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          {/* If user is logged in, '/' sends them to '/shop' */}
          <Route path="/" element={user ? <Navigate to="/shop" /> : <LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/all-products" element={<AllProductsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/bulk-order" element={<BulkOrderForm user={user} />} />
          
          {/* Login/Signup: Redirect to '/shop' if already logged in */}
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/shop" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/shop" />} />

          {/* --- PRIVATE ROUTES (The Dashboard) --- */}
          {/* This is the new home for logged in users */}
          <Route path="/shop" element={user ? <ShopPage /> : <Navigate to="/login" />} /> 
          <Route path="/bulk-order" element={user ? <BulkOrderForm user={user} /> : <Navigate to="/login" />} />
          
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/category/:categoryName" element={<CategoryPage addToCart={addToCart} />} />
          <Route path="/cart" element={user ? <CartPage user={user} cart={cart} setCart={setCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailsPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" /> } />
          <Route path="/admin/inventory" element={user && user.isAdmin ? <InventoryPage /> : <Navigate to="/" />} />
          <Route path="/admin/contacts" element={user && user.isAdmin ? <AdminContactsPage /> : <Navigate to="/" />} />
          <Route path="/admin/blogs" element={user && user.isAdmin ? <AdminBlogPage /> : <Navigate to="/" />} />
          <Route path="/admin/bulk-orders" element={user && user.isAdmin ? <AdminBulkOrdersPage /> : <Navigate to="/" />} />

        </Routes>
      </div>
      
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;