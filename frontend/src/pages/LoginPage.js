import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Import Home Icon
import API from '../api';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      //const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      setUser(res.data.user); 
      alert('Login Successful!');
      navigate('/'); 
    } catch (err) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div style={styles.container}>
      {/* 1. HOME BUTTON ADDED HERE */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={styles.homeLink}>
          <FaHome /> Back to Home
        </Link>
      </div>

      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Login</h2>
      
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          style={styles.input} 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={styles.input} 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        New here? <Link to="/signup" style={{ color: '#27ae60', fontWeight: 'bold' }}>Sign Up</Link>
      </p>
    </div>
  );
};

// Simple Styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    backgroundColor: 'white'
  },
  homeLink: {
    textDecoration: 'none',
    color: '#7f8c8d',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box' // Ensures padding doesn't break layout
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  }
};

export default LoginPage;