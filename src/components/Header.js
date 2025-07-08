import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FaUser, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetActive = (to) => {
    setActiveLink(to);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Главная' },
    { id: 'courses', label: 'Курсы' },
    { id: 'testimonials', label: 'Отзывы' },
    { id: 'contact', label: 'Контакты' }
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="container">
        <div className="header-inner">
          {/* Логотип с анимацией */}
          <Link 
            to="home" 
            smooth={true} 
            duration={800}
            className="logo"
            onSetActive={() => handleSetActive('home')}
          >
            <span className="logo-text">И</span>
            <span className="logo-highlight">IП</span>
            <span className="logo-dot">.</span>
          </Link>

          {/* Мобильное меню - кнопка бургера */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes className="menu-icon" />
            ) : (
              <FaBars className="menu-icon" />
            )}
          </button>

          {/* Основная навигация */}
          <nav className={`nav ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {navLinks.map((link) => (
                <li className="nav-item" key={link.id}>
                  <Link
                    to={link.id}
                    smooth={true}
                    duration={800}
                    spy={true}
                    offset={-80}
                    className={`nav-link ${activeLink === link.id ? 'active' : ''}`}
                    onSetActive={() => handleSetActive(link.id)}
                  >
                    {link.label}
                    <span className="nav-link-underline"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Кнопки действий */}
          <div className="header-actions">
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/login')}
            >
              <FaUser className="icon" />
              <span>Войти</span>
            </button>
            <button 
              className="btn btn-primary btn-glow"
              onClick={() => navigate('/register')}
            >
              <FaUserPlus className="icon" />
              <span>Регистрация</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;