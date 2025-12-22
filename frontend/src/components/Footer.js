import React from 'react';
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // Social Icons
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        {/* Column 1: About */}
        <div className="footer-section">
            {/* Logo + Text Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <img src={logo} alt="Agro Tech Harvest" style={{ height: '40px' }} />
                <h3 style={{ margin: 0 }}>Agro Tech Harvest</h3>
            </div>
          <p>
            Bringing you the freshest organic vegetables and pure raw powders directly from the farm to your table.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/category/vegetables">Vegetables</a></li>
            <li><a href="/category/powders">Raw Powders</a></li>
            <li><a href="/cart">My Cart</a></li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 123 Green Street, Farmers Market</p>
          <p>📞 +1 234 567 890</p>
          <p>✉️ support@Agrotechharvest.com</p>
          
          <div className="socials">
            <FaFacebook className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Agro Tech Harvest. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;