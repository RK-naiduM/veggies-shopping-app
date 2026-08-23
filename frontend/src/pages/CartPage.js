import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaTrashAlt, 
  FaCheckCircle, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaPhoneAlt,
} from 'react-icons/fa';
import gsap from 'gsap';
import API from '../api';

const CartPage = ({ user, cart, setCart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  
  // --- UPDATED STATE FOR NEW FIELDS ---
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [orderNotes, setOrderNotes] = useState('');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://ag-5b5404c015c74239af5a9e0cd3c0bdd2.ecs.us-east-1.on.aws";

  useEffect(() => {
    if (user && user.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleIncrement = (item) => {
    const MAX_LIMIT = 10;
    const currentStock = item.stock; 
    const effectiveLimit = Math.min(MAX_LIMIT, currentStock);

    if (item.quantity < effectiveLimit) {
      updateQuantity(item._id, 1);
    } else {
      if (item.quantity >= 10) {
        alert("Limit reached: You can only buy 10 per order.");
      } else {
        alert(`Stock limit reached! Only ${currentStock} available.`);
      }
    }
  };

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  // Helper to update structured address object
  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // --- UPDATED VALIDATION LOGIC ---
  const handleProceedToPayment = () => {
    const { line1, city, state, pincode } = shippingAddress;
    
    if (!customerName.trim() || !phone.trim() || !line1.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      alert("Please fill in all required fields (Name, Phone, Address Line 1, City, State, Pincode).");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    setCurrentStep(2);
  };

  // --- UPDATED PAYLOAD LOGIC ---
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const formattedItems = cart.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      user: user ? user.id : null, 
      customerName,
      phone,
      shippingAddress,
      orderNotes,
      items: formattedItems,
      totalAmount: Number(totalAmount),
      paymentMethod: 'COD'
    };

    try {
      await API.post('/orders', orderData);
      setFinalAmount(totalAmount); 
      setCart([]); 
      setCurrentStep(3); 
    } catch (err) {
      console.error(err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (cart.length === 0 && currentStep !== 3) return;

    let ctx = gsap.context(() => {
      gsap.fromTo('.cart-item-anim',
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );
      gsap.fromTo('.checkout-card-anim',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
    }, compRef);

    return () => ctx.revert();
  }, [cart.length, currentStep]);

  if (cart.length === 0 && currentStep !== 3) return (
    <div className="ambient-bg" style={styles.emptyContainer}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
            min-height: 100vh;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Outfit', 'Segoe UI', sans-serif;
          }
        `}
      </style>
      <div style={styles.emptyContent}>
        <h2 style={styles.emptyTitle}>Your Cart is Empty 🛒</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Looks like you haven't added any of our fresh harvest yet.</p>
        <button onClick={() => navigate('/category/powders')} className="checkout-btn" style={styles.continueBtn}>
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
            min-height: 100vh;
          }

          .fancy-input { transition: all 0.3s ease; }
          .fancy-input:focus {
            outline: none;
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
          }

          .hover-btn { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .hover-btn:hover:not(:disabled) { transform: translateY(-2px); }
          .hover-btn:active:not(:disabled) { transform: translateY(0); }

          .checkout-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .checkout-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(230, 126, 34, 0.4) !important;
          }
          
          .remove-btn { transition: all 0.2s ease; }
          .remove-btn:hover { color: #dc2626 !important; background: #fee2e2 !important; }

          .cart-item { transition: all 0.3s ease; }
          .cart-item:hover {
            transform: translateX(5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
            border-color: rgba(39, 174, 96, 0.2) !important;
          }
        `}
      </style>

      <div style={styles.mainLayout}>

        {/* --- STEPPER PROGRESS BAR --- */}
        {currentStep !== 3 && (
          <div style={styles.stepperContainer}>
            <div style={styles.stepBadge}>
              <div style={currentStep >= 1 ? styles.stepCircleActive : styles.stepCircleInactive}>
                {currentStep > 1 ? <FaCheckCircle size={16} /> : "1"}
              </div>
              <span style={currentStep >= 1 ? styles.stepTextActive : styles.stepTextInactive}>Shipping</span>
            </div>
            <div style={currentStep >= 2 ? styles.stepLineActive : styles.stepLineInactive} />
            <div style={styles.stepBadge}>
              <div style={currentStep >= 2 ? styles.stepCircleActive : styles.stepCircleInactive}>
                {currentStep > 2 ? <FaCheckCircle size={16} /> : "2"}
              </div>
              <span style={currentStep >= 2 ? styles.stepTextActive : styles.stepTextInactive}>Payment</span>
            </div>
          </div>
        )}

        {/* --- STEP 3: ORDER CONFIRMATION VIEW --- */}
        {currentStep === 3 ? (
          <div style={styles.confirmationWrapper}>
            <div style={styles.confirmationCard}>
              <FaCheckCircle style={styles.successIcon} />
              <h2 style={styles.confirmTitle}>Order Confirmed! 🎉</h2>
              <p style={styles.confirmSubtitle}>
                Thank you, <strong>{customerName}</strong>! Your veggies are being packed.
              </p>
              
              <div style={styles.codAlertBox}>
                <FaMoneyBillWave style={{ fontSize: '1.5rem', color: '#e67e22', marginRight: '10px' }} />
                <div>
                  <strong>Pay on Delivery</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>Please keep <strong>₹{finalAmount}</strong> ready when your order arrives.</p>
                </div>
              </div>

              <button onClick={() => navigate('/profile')} className="checkout-btn" style={styles.profileBtn}>
                View Order Status
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.container}>
            
            {/* LEFT SIDE: CART ITEMS */}
            <div style={styles.cartSection}>
              <h2 style={styles.pageTitle}>Your Shopping Cart</h2>
              <p style={styles.itemCountText}>You have {cart.length} item{cart.length > 1 ? 's' : ''} in your cart.</p>
              
              <div style={styles.cartList}>
                {cart.map((item) => (
                  <div key={item._id} className="cart-item-anim cart-item" style={styles.cartItem}>
                    <div style={styles.imageWrapper}>
                      <img src={renderImageSrc(item.image)} alt={item.name} style={styles.image} />
                    </div>
                    <div style={styles.details}>
                      <h3 style={styles.productTitle}>{item.name}</h3>
                      <p style={styles.unitPrice}>₹{item.price} each</p>
                      <div style={styles.controls}>
                        <button onClick={() => updateQuantity(item._id, -1)} className="hover-btn" style={styles.qtyBtn} disabled={currentStep === 2}>-</button>
                        <span style={styles.qtyNum}>{item.quantity}</span>
                        <button onClick={() => handleIncrement(item)} className="hover-btn" style={styles.qtyBtn} disabled={currentStep === 2}>+</button>
                      </div>
                    </div>
                    <div style={styles.actions}>
                      <p style={styles.totalPrice}>₹{(item.price * item.quantity).toFixed(2)}</p>
                      {currentStep === 1 && (
                        <button onClick={() => removeFromCart(item._id)} className="remove-btn" style={styles.removeBtn}>
                          <FaTrashAlt style={{ marginRight: '6px' }} /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: DYNAMIC CHECKOUT CARD */}
            <div className="checkout-card-anim" style={styles.checkoutSection}>
              <div style={styles.summaryCard}>
                
                {/* --- STEP 1: SHIPPING DETAILS --- */}
                {currentStep === 1 && (
                  <>
                    <h3 style={styles.summaryTitle}>
                      <FaMapMarkerAlt style={{ marginRight: '10px', color: '#27ae60' }} /> Shipping Details
                    </h3>
                    
                    {/* Name & Phone */}
                    <div style={styles.formRow}>
                      <div style={styles.formGroupHalf}>
                        <label style={styles.label}>Full Name <span style={styles.req}>*</span></label>
                        <input type="text" placeholder="Enter full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="fancy-input" style={styles.input} />
                      </div>
                      <div style={styles.formGroupHalf}>
                        <label style={styles.label}>Phone Number <span style={styles.req}>*</span></label>
                        <input type="text" placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} className="fancy-input" style={styles.input} maxLength="10" />
                      </div>
                    </div>

                    {/* Address Line 1 & 2 */}
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Address Line 1 <span style={styles.req}>*</span></label>
                      <input type="text" name="line1" placeholder="House/Flat No., Building Name, Street" value={shippingAddress.line1} onChange={handleAddressChange} className="fancy-input" style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Address Line 2 (Optional)</label>
                      <input type="text" name="line2" placeholder="Locality, Area, Landmark" value={shippingAddress.line2} onChange={handleAddressChange} className="fancy-input" style={styles.input} />
                    </div>

                    {/* City, State, Pincode Grid */}
                    <div style={styles.formRowTri}>
                      <div style={styles.formGroupTri}>
                        <label style={styles.label}>City <span style={styles.req}>*</span></label>
                        <input type="text" name="city" placeholder="City" value={shippingAddress.city} onChange={handleAddressChange} className="fancy-input" style={styles.input} />
                      </div>
                      <div style={styles.formGroupTri}>
                        <label style={styles.label}>State <span style={styles.req}>*</span></label>
                        <input type="text" name="state" placeholder="State" value={shippingAddress.state} onChange={handleAddressChange} className="fancy-input" style={styles.input} />
                      </div>
                      <div style={styles.formGroupTri}>
                        <label style={styles.label}>Pincode <span style={styles.req}>*</span></label>
                        <input type="text" name="pincode" placeholder="e.g. 500001" value={shippingAddress.pincode} onChange={handleAddressChange} className="fancy-input" style={styles.input} maxLength="6"/>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Order Notes (Optional)</label>
                      <textarea rows="2" placeholder="Any special delivery instructions?" value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className="fancy-input" style={{ ...styles.input, resize: 'vertical' }} />
                    </div>

                    <div style={styles.divider}></div>
                    <div style={styles.totalRow}>
                      <span style={styles.totalText}>Total Amount</span>
                      <span style={styles.totalAmount}>₹{totalAmount}</span>
                    </div>
                    <button onClick={handleProceedToPayment} className="checkout-btn" style={styles.checkoutBtn}>
                      Proceed to Payment
                    </button>
                  </>
                )}

                {/* --- STEP 2: PAYMENT INFO --- */}
                {currentStep === 2 && (
                  <>
                    <button onClick={() => setCurrentStep(1)} style={styles.backLink}>
                      <FaArrowLeft style={{ marginRight: '6px' }} /> Edit Shipping Address
                    </button>
                    <h3 style={styles.summaryTitle}>
                      <FaMoneyBillWave style={{ marginRight: '10px', color: '#27ae60' }} /> Payment Method
                    </h3>

                    {/* Address Summary Box */}
                    <div style={styles.addressSummaryBox}>
                      <span style={styles.summaryBoxLabel}>Delivering To:</span>
                      <strong style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {customerName} <span style={{ color: '#cbd5e1' }}>|</span> <FaPhoneAlt style={{ fontSize: '0.8rem', color: '#27ae60' }}/> {phone}
                      </strong>
                      <p style={styles.summaryBoxText}>
                        {shippingAddress.line1}
                        {shippingAddress.line2 && `, ${shippingAddress.line2}`}
                        <br/>
                        {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                      </p>
                    </div>

                    {/* COD Option Box */}
                    <div style={styles.gatewayOptionBox}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="radio" checked readOnly style={{ marginRight: '10px', accentColor: '#27ae60' }} />
                        <span style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>Cash on Delivery (COD)</span>
                      </div>
                      <p style={styles.gatewaySubtitle}>Pay with cash when your order arrives.</p>
                    </div>

                    <div style={styles.divider}></div>
                    <div style={styles.totalRow}>
                      <span style={styles.totalText}>Amount to Pay</span>
                      <span style={styles.totalAmount}>₹{totalAmount}</span>
                    </div>
                    <button onClick={handlePlaceOrder} disabled={isSubmitting} className="checkout-btn" style={styles.checkoutBtn}>
                      {isSubmitting ? 'Placing Order...' : `Place Order (Pay on Delivery)`}
                    </button>
                  </>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

// --- DYNAMIC STYLES ---
const styles = {
  pageWrapper: { fontFamily: "'Outfit', 'Segoe UI', sans-serif", color: '#0f172a', overflowX: 'hidden' },
  mainLayout: { maxWidth: '1300px', margin: '0 auto', padding: '40px 40px 100px 40px' },
  container: { display: 'flex', gap: '50px', flexWrap: 'wrap', alignItems: 'flex-start' },

  // Stepper
  stepperContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', padding: '15px 30px', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,0.9)', maxWidth: '500px', margin: '0 auto 40px auto' },
  stepBadge: { display: 'flex', alignItems: 'center', gap: '10px' },
  stepCircleActive: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#27ae60', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)' },
  stepCircleInactive: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.95rem' },
  stepTextActive: { fontWeight: '800', color: '#0f172a', fontSize: '0.95rem' },
  stepTextInactive: { fontWeight: '600', color: '#94a3b8', fontSize: '0.95rem' },
  stepLineActive: { flex: 1, height: '3px', backgroundColor: '#27ae60', margin: '0 15px', borderRadius: '10px' },
  stepLineInactive: { flex: 1, height: '3px', backgroundColor: '#e2e8f0', margin: '0 15px', borderRadius: '10px' },

  emptyContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', width: '100%', fontFamily: "'Outfit', 'Segoe UI', sans-serif" },
  emptyContent: { textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)', padding: '60px 40px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.9)' },
  emptyTitle: { color: '#0f172a', fontSize: '2.5rem', fontWeight: '800', marginBottom: '15px' },
  continueBtn: { marginTop: '30px', padding: '16px 40px', backgroundColor: '#e67e22', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)', transition: 'all 0.3s ease' },
  
  // Left Cart
  cartSection: { flex: '1 1 650px', minWidth: '300px' },
  pageTitle: { fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0f172a', margin: '0 0 10px 0', fontWeight: '800', letterSpacing: '-1px' },
  itemCountText: { color: '#64748b', fontSize: '1.1rem', marginBottom: '40px' },
  cartList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cartItem: { display: 'flex', gap: '20px', border: '1px solid rgba(255,255,255,0.9)', padding: '25px', borderRadius: '20px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)',boxSizing: 'border-box',flexWrap: 'wrap' },
  imageWrapper: { width: '100px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  details: { flex: 1 },
  productTitle: { fontSize: '1.3rem', color: '#0f172a', margin: '0 0 5px 0', fontWeight: '800' },
  unitPrice: { color: '#64748b', fontSize: '0.95rem', margin: 0 },
  controls: { display: 'flex', alignItems: 'center', marginTop: '15px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50px', width: 'fit-content', overflow: 'hidden' },
  qtyBtn: { padding: '8px 15px', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', color: '#0f172a', fontWeight: '800', fontSize: '1.1rem' },
  qtyNum: { padding: '0 15px', fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' },
  actions: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: '15px', flexShrink: 0, marginLeft: 'auto' },
  totalPrice: { fontWeight: '800', fontSize: '1.5rem', color: '#0f172a', margin: 0 },
  removeBtn: { backgroundColor: 'transparent', color: '#ef4444', border: 'none', padding: '8px 15px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center' },

  // Right Checkout (Updated for Grids)
  checkoutSection: { flex: '1 1 400px', minWidth: '350px' }, // Slightly wider for grid inputs
  summaryCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', padding: '40px 30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 25px 50px rgba(0,0,0,0.08)', position: 'sticky', top: '120px' },
  summaryTitle: { borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '15px', marginBottom: '25px', color: '#0f172a', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center' },
  
  // New Form Layout Styles
  formRow: { display: 'flex', gap: '15px', marginBottom: '20px' },
  formRowTri: { display: 'flex', gap: '10px', marginBottom: '20px' },
  formGroupHalf: { flex: 1 },
  formGroupTri: { flex: 1 },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.90rem', color: '#334155' },
  req: { color: '#ef4444' }, // Red asterisk
  input: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', fontSize: '0.95rem', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' },
  
  divider: { height: '1px', backgroundColor: 'rgba(0,0,0,0.05)', margin: '30px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  totalText: { fontWeight: '700', color: '#475569', fontSize: '1.1rem' },
  totalAmount: { fontSize: '2.5rem', color: '#0f172a', fontWeight: '800', letterSpacing: '-1px' },
  checkoutBtn: { width: '100%', padding: '18px', backgroundColor: '#e67e22', color: 'white', fontSize: '1.2rem', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '800', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)' },
  
  // Step 2 Additions
  backLink: { background: 'none', border: 'none', color: '#64748b', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center' },
  addressSummaryBox: { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '15px', marginBottom: '20px' },
  summaryBoxLabel: { display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' },
  summaryBoxText: { margin: '8px 0 0 0', color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' },
  gatewayOptionBox: { backgroundColor: '#f0fdf4', border: '2px solid #27ae60', borderRadius: '14px', padding: '16px', marginBottom: '20px' },
  gatewaySubtitle: { margin: '6px 0 0 24px', color: '#64748b', fontSize: '0.85rem' },

  // Confirmation View
  confirmationWrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  confirmationCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', padding: '50px 40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 30px 60px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: '550px', width: '100%' },
  successIcon: { fontSize: '4.5rem', color: '#27ae60', marginBottom: '20px' },
  confirmTitle: { fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' },
  confirmSubtitle: { color: '#475569', fontSize: '1.05rem', lineHeight: '1.5', marginBottom: '30px' },
  codAlertBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '30px', color: '#9a3412' },
  profileBtn: { width: '100%', padding: '16px', backgroundColor: '#27ae60', color: 'white', fontSize: '1.1rem', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '800', boxShadow: '0 8px 20px rgba(39, 174, 96, 0.3)' }
};

export default CartPage;