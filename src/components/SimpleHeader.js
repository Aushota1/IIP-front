import React from 'react';
import { Link } from 'react-router-dom';

const SimpleHeader = () => {
  return (
    <header className="simple-header">
      <Link to="/" className="logo">
        <img src="/logo.png" alt="ИIП" className="logo-image" />
      </Link>

      <style>{`
        .simple-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height-scrolled);
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .simple-header .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .simple-header .logo:hover {
          transform: translateY(-2px);
        }

        .simple-header .logo-image {
          height: 2.5rem;
          width: auto;
          display: block;
        }
      `}</style>
    </header>
  );
};

export default SimpleHeader;
