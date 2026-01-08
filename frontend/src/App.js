import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';



// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import AboutUsPage from './pages/AboutUsPage';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // PERSIST LOGIN ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo'); // We will need to save this on login
    
    if (token && storedUser && !user) {
      // Restore user from local storage
      setUser(JSON.parse(storedUser));
    }
  }, []); // Runs once on page load


  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    setCart([]);
    window.location.href = '/';
  };

// Updated Add to Cart with "Cart Awareness" Logic
  const addToCart = (product, qty) => {
    // 1. Check if the item is already in the cart
    const exist = cart.find((x) => x._id === product._id);
    
    // 2. Calculate what the TOTAL would be after adding
    const currentQtyInCart = exist ? exist.quantity : 0;
    const totalProposedQty = currentQtyInCart + qty;
    const MAX_LIMIT = 10;

    // 3. Rule 1: Check against Total Inventory
    if (totalProposedQty > product.stock) {
      alert(`Cannot add more! You already have ${currentQtyInCart} in your cart. Only ${product.stock} available in total.`);
      return; // Stop the function
    }

    // 4. Rule 2: Check against Max Order Limit (10)
    if (totalProposedQty > MAX_LIMIT) {
      alert(`Limit Exceeded! You have ${currentQtyInCart} in cart. Max allowed is ${MAX_LIMIT} per order.`);
      return; // Stop the function
    }

    // 5. If checks pass, proceed normally
    if (exist) {
      setCart(
        cart.map((x) =>
          x._id === product._id ? { ...exist, quantity: totalProposedQty } : x
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    
    //alert("Added to Cart Successfully!");
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
    <Router>
      {user && <Navbar user={user} cartCount={cart.length} handleLogout={handleLogout} />}
      <ScrollToTop />

      <div style={{ minHeight: '80vh' }}>

        <Routes>

          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={!user ? <LandingPage /> : <HomePage />} />
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />

          {/* --- PRIVATE ROUTES --- */}
          <Route path="/shop" element={user ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/category/:categoryName" element={user ? <CategoryPage addToCart={addToCart} /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={user ? <ProductDetails addToCart={addToCart} /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" /> } />

          {/* Corrected Cart Route (Only ONE version) */}
          <Route 
            path="/cart" 
            element={
              user ? 
              <CartPage 
                user={user} 
                cart={cart} 
                setCart={setCart} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
              /> 
              : <Navigate to="/login" />
            } 
          />
          
          {/* Corrected Profile Route (Only ONE version) */}
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/admin/inventory" 
            element={user && user.isAdmin ? <InventoryPage /> : <Navigate to="/" />} 
          />

          <Route path="/about" element={<AboutUsPage />} />



        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;