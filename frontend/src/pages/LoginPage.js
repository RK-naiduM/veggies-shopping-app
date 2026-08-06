import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaHome, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa'; 
import gsap from 'gsap';
import API from '../api';

const LoginPage = ({ setUser }) => {
  // --- ORIGINAL STATE & LOGIC (UNTOUCHED) ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = location.state?.from || '/shop';

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Send Login Request
      const { data } = await API.post('/auth/login', { email, password });
      
      // 2. Save Data
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user)); 
      
      setUser(data.user);
      
      // 3. REDIRECT: Send to Dashboard (/shop)
      navigate(redirectUrl);
      
    } catch (err) {
      console.error(err);
      setError('Invalid Email or Password'); 
    }
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Card 3D Entrance
      gsap.fromTo('.auth-card',
        { y: 60, opacity: 0, scale: 0.95, rotationX: 10 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 1, ease: "power3.out" }
      );

      // 2. Staggered Elements Inside Card
      gsap.fromTo('.stagger-item',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 }
      );
    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
      {/* --- UPGRADED THEME CSS --- */}
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          /* Input Focus States */
          .fancy-input {
            transition: all 0.3s ease;
          }
          .fancy-input:focus {
            outline: none;
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
            background-color: #ffffff !important;
          }

          /* Button Hover Polish */
          .auth-btn {
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .auth-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(39, 174, 96, 0.4) !important;
          }

          .link-hover {
            transition: color 0.2s ease;
          }
          .link-hover:hover {
            color: #27ae60 !important;
          }
        `}
      </style>

      <div className="auth-card" style={styles.card}>
        
        <div className="stagger-item" style={{ marginBottom: '30px' }}>
          <Link to="/" className="link-hover" style={styles.homeLink}>
            <FaHome style={{ fontSize: '1.2em' }} /> Back to Home
          </Link>
        </div>

        <div className="stagger-item" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue your harvest journey.</p>
        </div>
        
        {/* Error Message Display */}
        {error && (
          <div className="stagger-item" style={styles.errorBox}>
            <FaExclamationCircle /> {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="stagger-item" style={{ marginBottom: '20px' }}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="fancy-input"
              style={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          {/* --- PASSWORD FIELD WITH EYE ICON --- */}
          <div className="stagger-item" style={styles.passwordWrapper}>
            <label style={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="fancy-input"
                style={styles.input} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={styles.eyeIcon}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="stagger-item">
            <button type="submit" className="auth-btn" style={styles.button}>Login</button>
          </div>
        </form>
        
        <p className="stagger-item" style={styles.footerText}>
          Don't have an account? <Link to="/signup" className="link-hover" style={styles.signupLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  pageWrapper: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    color: '#0f172a',
    width: '100%'
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    padding: '50px 40px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.8)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
    perspective: '1000px'
  },
  homeLink: {
    textDecoration: 'none',
    color: '#64748b',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.95rem',
    fontWeight: '700'
  },
  title: {
    fontSize: '2.2rem',
    color: '#0f172a',
    margin: '0 0 8px 0',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1rem',
    margin: 0
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '12px',
    marginBottom: '20px',
    fontSize: '0.95rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #fecaca'
  },
  label: {
    display: 'block',
    fontSize: '0.95rem',
    color: '#334155',
    fontWeight: '700',
    marginBottom: '8px'
  },
  passwordWrapper: {
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    boxSizing: 'border-box',
    fontSize: '1rem',
    color: '#0f172a',
    fontWeight: '500'
  },
  eyeIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)', 
    cursor: 'pointer',
    color: '#94a3b8',
    fontSize: '20px',
    transition: 'color 0.2s ease'
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '50px', // Pill shape for modern look
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '800',
    boxShadow: '0 4px 15px rgba(39, 174, 96, 0.2)',
  },
  footerText: {
    marginTop: '30px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  signupLink: {
    color: '#e67e22', // Accented orange to match the theme
    fontWeight: '800',
    textDecoration: 'none',
    marginLeft: '5px'
  }
};

export default LoginPage;