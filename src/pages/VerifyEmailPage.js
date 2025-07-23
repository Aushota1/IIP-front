import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api';

const animeCharacterUrl = "https://i.pinimg.com/originals/8e/47/63/8e47632874f03bff1d4de6de5f7b27f2.png"; 
// Можно заменить на любой подходящий URL с мультяшным аниме персонажем

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Код как массив из 6 символов
  const [code, setCode] = useState(new Array(6).fill(''));
  const inputsRef = useRef([]);

  // Обработка ввода в каждую ячейку
  const handleCodeChange = (e, idx) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {  // разрешаем только цифры или пустую строку
      const newCode = [...code];
      newCode[idx] = val;
      setCode(newCode);
      if (val && idx < 5) {
        // переходим к следующему input
        inputsRef.current[idx + 1].focus();
      }
    }
  };

  // Обработка нажатия Backspace — чтобы перейти назад если ячейка пустая
  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const codeStr = code.join('');
    if (codeStr.length < 6) {
      setError('Please enter the full 6-digit code');
      setIsLoading(false);
      return;
    }
    try {
      await verifyEmail(email, codeStr);
      alert('Email verified successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .verify-container {
          max-width: 400px;
          margin: 40px auto;
          padding: 20px;
          background: #fefefe;
          border-radius: 16px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .verify-container h2 {
          margin-bottom: 12px;
          font-weight: 700;
          color: #333;
        }
        .anime-img {
          width: 120px;
          margin: 0 auto 20px;
          user-select: none;
          pointer-events: none;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        label {
          font-weight: 600;
          color: #555;
          text-align: left;
          user-select: none;
        }
        input[type="email"] {
          padding: 10px 14px;
          font-size: 1rem;
          border-radius: 8px;
          border: 2px solid #ccc;
          outline-offset: 2px;
          transition: border-color 0.25s;
        }
        input[type="email"]:focus {
          border-color: #6c63ff;
          outline: none;
        }
        /* Контейнер для 6 ячеек кода */
        .code-inputs {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
        }
        .code-inputs input {
          width: 40px;
          height: 50px;
          font-size: 1.8rem;
          text-align: center;
          border-radius: 10px;
          border: 2px solid #ccc;
          transition: border-color 0.3s;
          background: #fafafa;
          font-weight: 700;
          user-select: none;
        }
        .code-inputs input:focus {
          border-color: #6c63ff;
          background: #fff;
          outline: none;
          box-shadow: 0 0 6px #6c63ffaa;
        }
        .error {
          color: #d9534f;
          font-weight: 600;
          font-size: 0.9rem;
        }
        button {
          margin-top: 8px;
          padding: 12px 0;
          background-color: #6c63ff;
          color: white;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background-color 0.3s ease;
        }
        button:disabled {
          background-color: #aaa6ff;
          cursor: not-allowed;
        }
      `}</style>

      <div className="verify-container" role="main" aria-label="Verify Email Page">
        <img src={animeCharacterUrl} alt="Cute anime character" className="anime-img" />
        <h2>Verify Your Email</h2>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="email-input">Email Address</label>
          <input 
            id="email-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={!!initialEmail}
            aria-readonly={!!initialEmail}
            aria-describedby="email-desc"
          />
          <div id="email-desc" style={{ fontSize: '0.8rem', color: '#777', marginTop: '2px', marginBottom: '10px', textAlign: 'left' }}>
            Enter the 6-digit verification code sent to your email
          </div>

          <label htmlFor="code-inputs">Verification Code</label>
          <div className="code-inputs" id="code-inputs" role="group" aria-label="Verification code input">
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
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </>
  );
};

export default VerifyEmailPage;
