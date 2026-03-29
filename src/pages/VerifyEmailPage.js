import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';
  const [code, setCode] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef([]);

  const handleCodeChange = (e, idx) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);
      if (val && idx < 5) {
        inputsRef.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputsRef.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const codeStr = code.join('');
    if (codeStr.length < 6) {
      setError('Введите полный 6-значный код');
      return;
    }
    setIsLoading(true);
    try {
      await verifyEmail(email, codeStr);
      navigate('/login');
    } catch (err) {
      setError(err?.message || 'Неверный код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="smooth-auth-page">
      <div className="smooth-auth-container">
        <div className="smooth-auth-header">
          <h2>Подтверждение почты</h2>
          <p>Код отправлен на {email}</p>
        </div>

        {error && (
          <div className="smooth-error-message">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M13 13H11V7H13M13 17H11V15H13M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2Z" />
            </svg>
            {error}
          </div>
        )}

        <form className="smooth-auth-form" onSubmit={handleSubmit}>
          <div className="verify-code-inputs" onPaste={handlePaste}>
            {code.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={e => handleCodeChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                ref={el => inputsRef.current[idx] = el}
                autoComplete="one-time-code"
                aria-label={`Цифра ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="smooth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="smooth-spinner"></span>
                Проверка...
              </>
            ) : (
              'Подтвердить'
            )}
          </button>
        </form>

        <div className="smooth-auth-footer">
          Не пришёл код? Проверьте папку «Спам»
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
