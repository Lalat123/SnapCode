import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        login(res.data.user);
        navigate('/editor');
      } else {
        const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password });
        // Automatically login the user after successful registration
        login(res.data.user);
        navigate('/editor');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side: Branding */}
      <div className="login-left">
        <div className="brand-content">
          <img src="/logo.png" alt="SnapCode Logo" className="login-logo-img" />
          <h1 className="login-title">SnapCode</h1>
          <p className="login-subtitle">Lightning fast code execution & visualization.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="login-right">
        <div className="form-wrapper">
          <div className="form-toggle">
            <button 
              className={`toggle-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
              type="button"
            >
              Login
            </button>
            <button 
              className={`toggle-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>

          <h2 className="form-title">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          
          {errorMsg && (
            <div style={{ backgroundColor: 'rgba(255, 60, 60, 0.1)', color: '#ff4d4d', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '1px solid rgba(255, 60, 60, 0.3)', fontSize: '0.9rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Please wait...' : (isLogin ? 'Login to SnapCode' : 'Join SnapCode')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
