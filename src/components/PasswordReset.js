import React, { useState, useEffect } from 'react';

const PasswordReset = ({ onSubmit, onCancel }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('email'); // email, code, newPassword
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isLocked && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setIsLocked(false);
    }
  }, [countdown, isLocked]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) {
      setError(`Please wait ${countdown} seconds before trying again`);
      return;
    }

    switch (step) {
      case 'email':
        if (!validateEmail(email)) {
          setError('Please enter a valid email address');
          return;
        }
        setStep('code');
        onSubmit(email);
        break;

      case 'code':
        if (!resetCode.match(/^\d{6}$/)) {
          handleFailedAttempt();
          return;
        }
        setStep('newPassword');
        break;

      case 'newPassword':
        if (!validatePassword(newPassword)) {
          setError('Password must be at least 8 characters with numbers and special characters');
          return;
        }
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        onSubmit({ email, resetCode, newPassword });
        break;
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password);
  };

  const handleFailedAttempt = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 3) {
      setIsLocked(true);
      setCountdown(300); // 5 minutes lockout
      setError('Too many attempts. Please try again in 5 minutes.');
    } else {
      setError(`Invalid code. ${3 - newAttempts} attempts remaining.`);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="reset-form">
        {step === 'email' && (
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLocked}
            />
          </div>
        )}

        {step === 'code' && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              maxLength={6}
              disabled={isLocked}
            />
          </div>
        )}

        {step === 'newPassword' && (
          <>
            <div className="form-group">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isLocked}>
            {step === 'email' ? 'Send Reset Code' : 
             step === 'code' ? 'Verify Code' : 'Reset Password'}
          </button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;