// LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={styles.container}>
      <svg
        style={styles.spinner}
        viewBox="0 0 50 50"
      >
        <circle
          style={styles.path}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <p style={styles.text}>Загрузка данных...</p>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#88d3ce',
    fontFamily: "'Poppins', sans-serif",
  },
  spinner: {
    animation: 'rotate 2s linear infinite',
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  path: {
    stroke: '#6e45e2',
    strokeLinecap: 'round',
    animation: 'dash 1.5s ease-in-out infinite',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
};

// Добавим анимации через глобальный CSS (если используешь styled-components, emotion — это можно делать там)
export const spinnerStyles = `
@keyframes rotate {
  100% { transform: rotate(360deg); }
}
@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
`;

export default LoadingSpinner;
