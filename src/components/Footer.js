import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaTelegram, 
  FaVk, 
  FaYoutube 
} from 'react-icons/fa';
import './Footer.css';

const FOOTER_DATA = {
  popularCourses: [
    { id: 1, slug: 'algorithm-rush', title: 'Algorithm Rush: Код как спорт' },
    { id: 2, slug: 'blender-cad', title: 'Blender & CAD: Дизайн будущего' },
    { id: 3, slug: 'ai-blackbox', title: 'AI Blackbox: От данных до нейросетей' }
  ],
  socialLinks: {
    telegram: { url: 'https://t.me/eduonline_school', label: 'Telegram' },
    vk: { url: 'https://vk.com/eduonline_school', label: 'VKontakte' },
    youtube: { url: 'https://youtube.com/c/eduonline_school', label: 'YouTube' }
  },
  navigation: [
    { id: 1, target: '/', label: 'Главная' },
    { id: 2, target: '/courses', label: 'Все курсы' },
    { id: 3, target: '#testimonials', label: 'Отзывы' },
    { id: 4, target: '#contact', label: 'Контакты' }
  ]
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderedCourses = useMemo(() => (
    FOOTER_DATA.popularCourses.map(course => (
      <li key={course.id}>
        <Link 
          to={`/courses/${course.slug}`} 
          className="course-link"
          onClick={handleLinkClick}
        >
          {course.title}
        </Link>
      </li>
    ))
  ), []);

  const renderedNavigation = useMemo(() => (
    FOOTER_DATA.navigation.map(item => (
      <li key={item.id}>
        {item.target.startsWith('#') ? (
          <a href={item.target}>{item.label}</a>
        ) : (
          <Link to={item.target} onClick={handleLinkClick}>{item.label}</Link>
        )}
      </li>
    ))
  ), []);

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-wave" aria-hidden="true">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            className="shape-fill"
          />
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
            opacity=".5" 
            className="shape-fill"
          />
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            className="shape-fill"
          />
        </svg>
      </div>

      <div className="container">
        <div className="footer-content">
          <div className="footer-about">
            <Link to="/" className="footer-logo" onClick={handleLinkClick}>
              <span>И</span>IП
            </Link>
            <p className="footer-description">
              Современная платформа онлайн-образования с курсами от практикующих экспертов.
              Обучение с нуля до профессионала.
            </p>
            <div className="footer-social">
              {Object.entries(FOOTER_DATA.socialLinks).map(([key, {url, label}]) => {
                const Icon = 
                  key === 'telegram' ? FaTelegram :
                  key === 'vk' ? FaVk : FaYoutube;
                
                return (
                  <a 
                    key={key}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon className="social-icon" />
                  </a>
                );
              })}
            </div>
          </div>

          <nav className="footer-links" aria-label="Основная навигация">
            <h2 className="footer-title">Навигация</h2>
            <ul>
              {renderedNavigation}
            </ul>
          </nav>

          <div className="footer-courses">
            <h2 className="footer-title">Популярные курсы</h2>
            <ul>
              {renderedCourses}
            </ul>
          </div>

          <section id="contact" className="footer-contact" aria-label="Контактная информация">
            <h2 className="footer-title">Контакты</h2>
            <ul className="contact-list">
              <li className="contact-item">
                <FaEnvelope className="contact-icon" aria-hidden="true" />
                <a href="mailto:info@eduonline.com">info@eduonline.com</a>
              </li>
              <li className="contact-item">
                <FaPhone className="contact-icon" aria-hidden="true" />
                <a href="tel:+71234567890">+7 (123) 456-78-90</a>
              </li>
              <li className="contact-item">
                <FaMapMarkerAlt className="contact-icon" aria-hidden="true" />
                <span>Москва, ул. Образцова, 1</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} ИIП. Все права защищены.</p>
          <div className="footer-legal">
            <Link to="/privacy" onClick={handleLinkClick}>Политика конфиденциальности</Link>
            <Link to="/terms" onClick={handleLinkClick}>Условия использования</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;