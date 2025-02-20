import React, { useState, useEffect } from 'react';
import companyLogo from '../assets/digitallumad_logo_only.svg';

// Add errorMessage to props
const Auth = ({ onLogin, rememberMe, setRememberMe, errorMessage }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Please enter both email and password');
      }

      await onLogin({
        email: credentials.email,
        password: credentials.password
      });
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img 
          src={companyLogo} 
          alt="Company Logo" 
          className="login-logo animate-logo" 
        />
        <h2>Task Manager</h2>
        <p className="studio-tagline">by AVC Studio</p>
      </div>
      {/* Remove duplicate h2 "Login" */}
      {(errorMessage || localError) && (
        <div className="error-message">{errorMessage || localError}</div>
      )}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={credentials.email}
            onChange={(e) => {
              setLocalError('');
              setCredentials({ ...credentials, email: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => {
              setLocalError('');
              setCredentials({ ...credentials, password: e.target.value });
            }}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            /> Remember Me
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Auth;