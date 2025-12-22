import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Import Home Icon
import API from '../api';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      //await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      await API.post('/auth/signup', { name, email, password });
      alert('Signup Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Signup Failed. Try again.');
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

      <h2 style={{ marginBottom: '20px', color: '#e67e22' }}>Create Account</h2>
      
      <form onSubmit={handleSignup}>
        <input 
          type="text" 
          placeholder="Full Name" 
          style={styles.input} 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      
      <p style={{ marginTop: '15px' }}>
        Already have an account? <Link to="/login" style={{ color: '#27ae60', fontWeight: 'bold' }}>Login</Link>
      </p>
    </div>
  );
};

// Using the same styles as Login for consistency
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
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#e67e22', // Orange for Signup to make it distinct
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px'
  }
};

export default SignupPage;