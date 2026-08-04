import React, { useState } from 'react';
import { FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaBoxOpen } from 'react-icons/fa';
import API from '../api'; // Assuming you have the same API setup

const BulkOrderForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    shippingAddress: '',
    orderDetails: ''
  });

  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Using your API setup to match ContactUsPage
      await API.post('/bulk-orders', formData);
      setStatus('success');
      setFormData({ 
        companyName: '', contactPerson: '', email: '', 
        phoneNumber: '', shippingAddress: '', orderDetails: '' 
      }); 
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="animated-bg" style={styles.container}>
      {/* Custom CSS for Advanced Motion & Responsive Grid - Matched from ContactUsPage */}
      <style>
        {`
          /* Slow Moving Gradient Background */
          @keyframes gradientMotion {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #e8f5e9, #ffffff, #f1f8e9, #e0f2f1);
            background-size: 400% 400%;
            animation: gradientMotion 15s ease infinite;
          }

          /* Staggered Slide Fades */
          @keyframes slideRight {
            0% { opacity: 0; transform: translateX(-40px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideLeft {
            0% { opacity: 0; transform: translateX(40px); }
            100% { opacity: 1; transform: translateX(0); }
          }

          .slide-right { animation: slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          .slide-left { animation: slideLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; opacity: 0; }

          /* Interactive Cards */
          .info-card {
            transition: all 0.3s ease;
            cursor: default;
          }
          .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(39, 174, 96, 0.15) !important;
            border-color: #27ae60 !important;
          }

          /* Input Animations */
          .animated-input {
            transition: all 0.3s ease;
          }
          .animated-input:focus {
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.15) !important;
            transform: translateY(-2px);
          }

          /* Button Animations */
          .animated-btn { transition: all 0.3s ease; }
          .animated-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4) !important;
          }
          @keyframes flyAway {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(20px, -20px) scale(1.2); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          .submitting-icon { animation: flyAway 1.5s infinite ease-in-out; }
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .status-box { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

          /* Responsive Layout */
          .contact-wrapper {
            display: flex;
            flex-direction: column;
            gap: 40px;
            width: 100%;
            max-width: 1100px;
          }
          @media (min-width: 850px) {
            .contact-wrapper {
              flex-direction: row;
            }
            .contact-info { flex: 1; }
            .contact-form { flex: 1.2; }
          }
        `}
      </style>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        <div className="contact-wrapper">
          
          {/* LEFT COLUMN: Info */}
          <div className="contact-info slide-right">
            <h2 style={styles.sectionHeading}>Partner With Us</h2>
            <p style={styles.sectionSubheading}>Need a large quantity of our products? Fill out the bulk order request form and we will provide you with a custom quote.</p>
            
            <div style={styles.infoCardsContainer}>
              <div className="info-card" style={styles.infoCard}>
                <div style={styles.iconCircle}><FaBoxOpen /></div>
                <div>
                  <h3 style={styles.infoTitle}>Wholesale Pricing</h3>
                  <p style={styles.infoText}>Discounted rates available</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="contact-form slide-left">
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Request a Quote</h2>

              {status === 'success' && (
                <div style={{...styles.statusBox, backgroundColor: '#d4edda', color: '#155724'}} className="status-box">
                  <FaCheckCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  Order request submitted successfully!
                </div>
              )}

              {status === 'error' && (
                <div style={{...styles.statusBox, backgroundColor: '#f8d7da', color: '#721c24'}} className="status-box">
                  <FaExclamationCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Company Name *</label>
                  <input 
                    type="text" 
                    name="companyName" 
                    value={formData.companyName} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Contact Person *</label>
                    <input 
                      type="text" 
                      name="contactPerson" 
                      value={formData.contactPerson} 
                      onChange={handleChange} 
                      style={styles.input} 
                      className="animated-input"
                      required 
                    />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phoneNumber" 
                      value={formData.phoneNumber} 
                      onChange={handleChange} 
                      style={styles.input} 
                      className="animated-input"
                      required 
                    />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Shipping Address *</label>
                  <input 
                    type="text" 
                    name="shippingAddress" 
                    value={formData.shippingAddress} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Order Details (Products & Quantities) *</label>
                  <textarea 
                    name="orderDetails" 
                    value={formData.orderDetails} 
                    onChange={handleChange} 
                    style={{ ...styles.input, height: '120px', resize: 'vertical' }} 
                    className="animated-input"
                    placeholder="E.g., 50 units of Premium amal powder, 100 units of carrot powder..."
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    ...styles.submitBtn, 
                    backgroundColor: status === 'submitting' ? '#95a5a6' : '#27ae60',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer'
                  }} 
                  className="animated-btn"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>Submitting... <FaPaperPlane className="submitting-icon" style={{ marginLeft: '10px' }} /></>
                  ) : (
                    <>Submit Request <FaPaperPlane style={{ marginLeft: '10px' }} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Exact same styling objects to match your brand
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', minHeight: '100vh', overflowX: 'clip' },
  contentWrapper: { display: 'flex', justifyContent: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 80px)' },
  
  // Left Column Styles
  sectionHeading: { fontSize: '40px', color: '#2c3e50', margin: '0 0 15px 0', fontWeight: '800', lineHeight: '1.2' },
  sectionSubheading: { fontSize: '18px', color: '#555', marginBottom: '35px', lineHeight: '1.6', maxWidth: '90%' },
  infoCardsContainer: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' },
  infoCard: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' },
  iconCircle: { width: '50px', height: '50px', backgroundColor: '#e8f5e9', color: '#27ae60', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', marginRight: '20px' },
  infoTitle: { margin: '0 0 5px 0', fontSize: '14px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '1px' },
  infoText: { margin: 0, fontSize: '18px', color: '#2c3e50', fontWeight: 'bold' },

  // Right Column (Form) Styles
  formCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', border: '1px solid rgba(255,255,255,0.5)' },
  formTitle: { color: '#27ae60', margin: '0 0 30px 0', fontSize: '28px', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', color: '#2c3e50', fontSize: '14px', letterSpacing: '0.5px' },
  input: { padding: '14px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fcfcfc' },
  submitBtn: { padding: '16px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' },
  statusBox: { padding: '16px 20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '15px' },
};

export default BulkOrderForm;