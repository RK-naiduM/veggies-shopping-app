import React, { useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaBoxOpen, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Added for the login button
import API from '../api'; 

const BulkOrderForm = ({ user }) => { // Accept the user prop!

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: user?.name || '', // Safe to auto-fill now
    email: user?.email || '',       // Safe to auto-fill now
    phoneNumber: '',
    shippingAddress: '',
    orderDetails: ''
  });

  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  // --- IF NOT LOGGED IN: SHOW THE MARKETING PAGE ---
  if (!user) {
    return (
      <div className="animated-bg" style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', maxWidth: '600px', width: '100%' }}>
            <FaBoxOpen style={{ fontSize: '60px', color: '#27ae60', marginBottom: '20px' }} />
            <h1 style={{ color: '#2c3e50', fontSize: '32px', marginBottom: '15px' }}>Partner With Us</h1>
            <p style={{ color: '#555', fontSize: '18px', lineHeight: '1.6', marginBottom: '30px' }}>
              Looking to place a large order for your business? We offer exclusive wholesale pricing and dedicated support for our B2B partners. 
            </p>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #eee' }}>
              <FaLock style={{ color: '#7f8c8d', marginBottom: '10px', fontSize: '24px' }} />
              <p style={{ margin: 0, color: '#2c3e50', fontWeight: 'bold' }}>Please log in or create an account to submit a bulk order request.</p>
            </div>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <Link to="/login" style={{ padding: '12px 25px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>Log In</Link>
              <Link to="/signup" style={{ padding: '12px 25px', backgroundColor: 'white', color: '#27ae60', border: '2px solid #27ae60', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- IF LOGGED IN: SHOW THE FORM ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await API.post('/bulk-orders', formData);
      setStatus('success');
      setFormData({ companyName: '', contactPerson: '', email: '', phoneNumber: '', shippingAddress: '', orderDetails: '' }); 
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="animated-bg" style={styles.container}>
      {/* Include your exact <style> block here that we used previously */}
      <style>
        {`
          @keyframes gradientMotion { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animated-bg { background: linear-gradient(-45deg, #e8f5e9, #ffffff, #f1f8e9, #e0f2f1); background-size: 400% 400%; animation: gradientMotion 15s ease infinite; }
          .slide-right { animation: slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          .slide-left { animation: slideLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; opacity: 0; }
          @keyframes slideRight { 0% { opacity: 0; transform: translateX(-40px); } 100% { opacity: 1; transform: translateX(0); } }
          @keyframes slideLeft { 0% { opacity: 0; transform: translateX(40px); } 100% { opacity: 1; transform: translateX(0); } }
          .contact-wrapper { display: flex; flex-direction: column; gap: 40px; width: 100%; max-width: 1100px; }
          @media (min-width: 850px) { .contact-wrapper { flex-direction: row; } .contact-info { flex: 1; } .contact-form { flex: 1.2; } }
          .animated-input { transition: all 0.3s ease; }
          .animated-input:focus { border-color: #27ae60 !important; box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.15) !important; transform: translateY(-2px); }
          .animated-btn { transition: all 0.3s ease; }
          .animated-btn:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4) !important; }
        `}
      </style>

      <div style={styles.contentWrapper}>
        <div className="contact-wrapper">
          
          {/* LEFT COLUMN: Info */}
          <div className="contact-info slide-right">
            <h2 style={styles.sectionHeading}>Partner With Us</h2>
            <p style={styles.sectionSubheading}>Need a large quantity of our products? Fill out the bulk order request form and our B2B team will provide you with a custom quote.</p>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="contact-form slide-left">
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Request a Quote</h2>

              {status === 'success' && (
                <div style={{...styles.statusBox, backgroundColor: '#d4edda', color: '#155724'}}>
                  <FaCheckCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  Order request submitted successfully!
                </div>
              )}

              {status === 'error' && (
                <div style={{...styles.statusBox, backgroundColor: '#f8d7da', color: '#721c24'}}>
                  <FaExclamationCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} style={styles.input} className="animated-input" required />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Contact Person *</label>
                    <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} style={styles.input} className="animated-input" required />
                  </div>
                  <div style={{ ...styles.inputGroup, flex: 1 }}>
                    <label style={styles.label}>Phone Number *</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} style={styles.input} className="animated-input" required />
                  </div>
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} style={styles.input} className="animated-input" required />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Shipping Address *</label>
                  <input type="text" name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} style={styles.input} className="animated-input" required />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Order Details (Products & Quantities) *</label>
                  <textarea name="orderDetails" value={formData.orderDetails} onChange={handleChange} style={{ ...styles.input, height: '120px', resize: 'vertical' }} className="animated-input" required />
                </div>

                <button type="submit" style={{ ...styles.submitBtn, backgroundColor: status === 'submitting' ? '#95a5a6' : '#27ae60' }} className="animated-btn" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', minHeight: '100vh', overflowX: 'clip' },
  contentWrapper: { display: 'flex', justifyContent: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 80px)' },
  sectionHeading: { fontSize: '40px', color: '#2c3e50', margin: '0 0 15px 0', fontWeight: '800' },
  sectionSubheading: { fontSize: '18px', color: '#555', marginBottom: '35px', lineHeight: '1.6' },
  formCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', border: '1px solid rgba(255,255,255,0.5)' },
  formTitle: { color: '#27ae60', margin: '0 0 30px 0', fontSize: '28px', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', color: '#2c3e50', fontSize: '14px' },
  input: { padding: '14px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', backgroundColor: '#fcfcfc' },
  submitBtn: { padding: '16px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  statusBox: { padding: '16px 20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', fontWeight: '600' }
};

export default BulkOrderForm;