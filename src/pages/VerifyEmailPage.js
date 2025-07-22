import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api'; // твой API-клиент

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Можно получить email из состояния перехода после регистрации
  const initialEmail = location.state?.email || '';
  
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await verifyEmail(email, code);
      alert('Email verified successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <h2>Verify Your Email</h2>
      <form onSubmit={handleSubmit}>
        <label>Email Address</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          disabled={!!initialEmail} // если email пришёл из регистрации, заблокировать редактирование
        />
        <label>Verification Code</label>
        <input 
          type="text" 
          value={code} 
          onChange={e => setCode(e.target.value)} 
          required 
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailPage;
