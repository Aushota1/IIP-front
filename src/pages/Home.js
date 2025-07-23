import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import Testimonial from '../components/Testimonial';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import bg1 from '../assets/fon1.jpg';
import bg2 from '../assets/fon1.jpg';
import bg3 from '../assets/fon3.jpg';
import bg4 from '../assets/fon4.jpg';

const courses = [
  {
    id: 1,
    title: 'Algorithm Rush: Код как спорт',
    slug: 'algorithm-rush',
    description: 'Хардкорное программирование для будущих чемпионов ICPC и Google Hash Code',
    duration: '6 месяцев',
    level: 'Продвинутый',
    price: '29 900 ₽',
    image: bg1,
    highlights: [
      'Решение задач уровня LeetCode Hard',
      'Оптимизация кода до наносекунд',
      'Нейросети для олимпиад',
      'Челлендж от VK и Яндекс'
    ]
  },
  {
    id: 2,
    title: 'Blender & CAD: Дизайн будущего',
    slug: 'blender-cad',
    description: 'Создание 3D-моделей для геймдева, кино и метавселенных',
    duration: '4 месяца',
    level: 'Средний',
    price: '24 900 ₽',
    image: bg2,
    highlights: [
      'Моделирование как в Pixar',
      'Проектирование умных устройств',
      '3D-печать за 24 часа',
      'NFT для метавселенных'
    ]
  },
  {
    id: 3,
    title: 'AI Blackbox: От данных до нейросетей',
    slug: 'ai-blackbox',
    description: 'Полный цикл работы с искусственным интеллектом и анализом данных',
    duration: '5 месяцев',
    level: 'Продвинутый',
    price: '34 900 ₽',
    image: bg3,
    highlights: [
      'Generative AI (Stable Diffusion, GPT)',
      'Анализ данных лучше Bloomberg',
      'AutoML без тонн кода',
      'Свой AI-стартап'
    ]
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Анна Смирнова',
    role: 'Веб-разработчик',
    text: 'Курс по веб-разработке помог мне сменить профессию и найти работу мечты. Преподаватели — настоящие профессионалы!',
    avatar: bg4,
  },
  {
    id: 2,
    name: 'Иван Петров',
    role: 'UX/UI дизайнер',
    text: 'Отличная подача материала, много практики. После курса собрал портфолио и получил первые заказы на фрилансе.',
    avatar: bg4,
  },
  {
    id: 3,
    name: 'Елена Ковалева',
    role: 'Маркетолог',
    text: 'Практические кейсы из курса по маркетингу сразу применила в работе. Результаты не заставили себя ждать!',
    avatar: bg4,
  },
];

const particlesOptions = {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: false },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 }
    }
  },
  particles: {
    color: { value: "#8f8f8f" },
    links: {
      color: "#8f8f8f",
      distance: 140,
      enable: true,
      opacity: 0.1,
      width: 1
    },
    collisions: { enable: false },
    move: {
      enable: true,
      speed: 0.8,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" }
    },
    number: { value: 50, density: { enable: true, area: 800 } },
    opacity: { value: 0.15 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } }
  },
  detectRetina: true,
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
      setScrollY(window.scrollY);
      const sections = ['home', 'about', 'courses', 'testimonials'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const particlesInit = async (main) => { await loadFull(main); };

  return (
    <div className="gpt-style-homepage">
      <Header activeSection={activeSection} />

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <Particles id="hero-particles" init={particlesInit} options={particlesOptions} />
        <div className="hero-banner" />
        <div className="hero-content">
          <h1>
            Образование <br />
            <span className="gradient-text">будущего</span> <br />
            уже здесь
          </h1>
          <p>
            Онлайн-курсы от практикующих экспертов. Освойте востребованную профессию или повысьте квалификацию.
          </p>
          <div className="buttons">
            <Link to="#courses" className="btn btn-primary">
              Выбрать курс
            </Link>
            <button className="btn btn-secondary">Узнать больше</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2>О нашей школе</h2>
          <p className="subtitle">FutureCode — это современная платформа для обучения профессиям будущего</p>
          <div className="stats">
            <div className="stat">
              <div className="number">10</div>
              <div className="label">Направлений</div>
              <div className="desc">Программирование, AI, 3D-дизайн и другие востребованные специальности</div>
            </div>
            <div className="stat">
              <div className="number">5000+</div>
              <div className="label">Студентов</div>
              <div className="desc">Которые уже прошли наши курсы и добились успеха в профессии</div>
            </div>
            <div className="stat">
              <div className="number">50</div>
              <div className="label">Преподавателей</div>
              <div className="desc">Практикующих экспертов из Google, NVIDIA и других топ-компаний</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section" style={{ backgroundImage: `url(${bg3})` }}>
        <div className="overlay" />
        <div className="container">
          <h2>Топовые курсы 2024</h2>
          <p className="subtitle">Программы, которые дают реальные навыки для работы в технологиях будущего</p>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} slug={course.slug} mousePosition={mousePosition} />
            ))}
          </div>
          <div className="all-courses-link">
            <Link to="/courses" className="btn btn-primary">
              Все курсы →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <Particles id="testimonials-particles" init={particlesInit} options={particlesOptions} />
        <div className="overlay" />
        <div className="container">
          <h2>Отзывы студентов</h2>
          <p className="subtitle">Что говорят наши выпускники о курсах и процессе обучения</p>
          <div className="testimonials-list">
            {testimonials.map((testimonial) => (
              <Testimonial key={testimonial.id} {...testimonial} mousePosition={mousePosition} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-text">
            <h2>Готовы начать обучение?</h2>
            <p>Оставьте заявку и получите консультацию по подбору курса</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Ваш email" required />
              <button type="submit" className="btn btn-primary">
                Отправить
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');

        .gpt-style-homepage {
          font-family: 'Inter', sans-serif;
          background-color: #121214;
          color: #c7c7cc;
          min-height: 100vh;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        /* Hero */
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #121214;
          padding: 0 20px;
        }

        .hero-banner {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url(${bg2});
          background-size: cover;
          background-position: center;
          filter: brightness(0.45);
          transition: filter 0.3s ease, transform 0.3s ease;
          z-index: 0;
          border-radius: 0;
        }

        .hero-banner:hover {
          filter: brightness(0.55);
          transform: scale(1.05);
        }

        .hero-content {
          position: relative;
          max-width: 480px;
          z-index: 2;
          color: #f0f0f5;
          user-select: none;
          text-shadow:
            0 2px 4px rgba(0,0,0,0.7),
            0 0 10px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          font-weight: 600;
        }

        .hero-content h1 {
          font-weight: 900;
          font-size: 3.8rem;
          line-height: 1.1;
          margin: 0;
        }

        .gradient-text {
          background: linear-gradient(90deg, #7b61ff, #ff61b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .hero-content p {
          font-size: 1.3rem;
          line-height: 1.6;
          color: #d0d0d8;
          margin: 0;
          font-weight: 500;
        }

        .buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        /* Новые стили кнопок — в стиле GPT */

        .btn {
          all: unset;
          cursor: pointer;
          user-select: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          padding: 12px 28px;
          border-radius: 9999px;
          transition: background-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
          box-shadow: 0 0 0 1px rgba(255 255 255 / 0.1);
          color: white;
          background: linear-gradient(90deg, #2a2a72, #009ffd);
          text-align: center;
          min-width: 140px;
          user-select: none;
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
        }
        .btn:hover,
        .btn:focus {
          background: linear-gradient(90deg, #0050b3, #00c6ff);
          box-shadow:
            0 0 8px #00c6ff,
            0 4px 16px rgb(0 198 255 / 0.5);
          transform: translateY(-3px);
          outline: none;
        }
        .btn:active {
          transform: translateY(-1px);
          box-shadow:
            0 0 6px #00a6d9,
            0 2px 8px rgb(0 166 217 / 0.4);
        }

        /* btn-primary and btn-secondary remain for semantic usage but inherit .btn styles */
        .btn-primary {
          background: linear-gradient(90deg, #2a2a72, #009ffd);
          color: white;
        }
        .btn-primary:hover,
        .btn-primary:focus {
          background: linear-gradient(90deg, #0050b3, #00c6ff);
        }

        .btn-secondary {
          background: transparent;
          color: #ccc;
          box-shadow: 0 0 0 1px rgba(255 255 255 / 0.15);
        }
        .btn-secondary:hover,
        .btn-secondary:focus {
          background: rgba(255 255 255 / 0.1);
          box-shadow:
            0 0 10px rgba(255 255 255 / 0.3),
            0 4px 16px rgba(255 255 255 / 0.15);
          color: white;
        }

        /* About Section */
        .about-section {
          padding: 80px 0;
          background-color: #18181b;
          text-align: center;
        }

        .about-section h2 {
          font-weight: 800;
          font-size: 2.8rem;
          margin-bottom: 1rem;
          color: #e0e0e8;
          user-select: none;
        }

        .subtitle {
          font-size: 1.15rem;
          color: #9999aa;
          margin-bottom: 48px;
          user-select: none;
        }

        .stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          flex-wrap: wrap;
        }

        .stat {
          background-color: #222226;
          border-radius: 14px;
          padding: 36px 28px;
          flex: 1 1 200px;
          max-width: 280px;
          box-shadow: 0 0 12px rgb(0 0 0 / 0.45);
          transition: background-color 0.3s ease;
          user-select: none;
        }

        .stat:hover {
          background-color: #2a2a33;
        }

        .number {
          font-weight: 900;
          font-size: 3.2rem;
          margin-bottom: 0.5rem;
          color: #8b78ff;
          user-select: text;
          text-shadow: 0 0 5px #8b78ffaa;
        }

        .label {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 0.6rem;
          color: #bbb;
        }

        .desc {
          font-size: 1rem;
          color: #888899;
          line-height: 1.5;
        }

        /* Courses Section */
        .courses-section {
          position: relative;
          padding: 80px 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #ccc;
          font-weight: 500;
        }

        .courses-section .overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 18, 20, 0.88);
          z-index: 0;
        }

        .courses-section .container {
          position: relative;
          z-index: 1;
        }

        .courses-section h2 {
          font-weight: 800;
          font-size: 3rem;
          margin-bottom: 0.5rem;
          user-select: none;
          color: #ddd;
          text-shadow: 0 0 10px rgba(123, 97, 255, 0.7);
        }

        .courses-section .subtitle {
          font-size: 1.2rem;
          margin-bottom: 48px;
          color: #a0a0bb;
          user-select: none;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 36px;
        }

        .all-courses-link {
          margin-top: 56px;
          text-align: center;
        }

        /* Testimonials Section */
        .testimonials-section {
          position: relative;
          padding: 80px 0 100px;
          background-color: #121214;
          color: #ccc;
          overflow: hidden;
        }

        .testimonials-section .overlay {
          position: absolute;
          inset: 0;
          background: rgba(18, 18, 20, 0.95);
          z-index: 0;
        }

        .testimonials-section .container {
          position: relative;
          z-index: 1;
        }

        .testimonials-section h2 {
          font-weight: 800;
          font-size: 2.6rem;
          margin-bottom: 0.3rem;
          user-select: none;
          color: #ddd;
          text-shadow: 0 0 8px rgba(123, 97, 255, 0.8);
        }

        .testimonials-section .subtitle {
          color: #8889aa;
          font-size: 1.2rem;
          margin-bottom: 40px;
          user-select: none;
        }

        .testimonials-list {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* CTA Section */
        .cta-section {
          background-color: #2e2e49;
          padding: 60px 0;
          text-align: center;
          color: #ddd;
          user-select: none;
        }

        .cta-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-text h2 {
          font-weight: 800;
          font-size: 2.6rem;
          margin-bottom: 0.8rem;
        }

        .cta-text p {
          font-size: 1.2rem;
          margin-bottom: 30px;
          color: #bbb;
          font-weight: 500;
        }

        .cta-form {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .cta-form input[type='email'] {
          padding: 16px 24px;
          border-radius: 9999px;
          border: none;
          width: 320px;
          max-width: 90vw;
          font-size: 1.1rem;
          background-color: #444459;
          color: #eee;
          outline-offset: 2px;
          transition: background-color 0.3s ease;
          font-weight: 500;
          box-shadow: inset 0 0 6px rgb(0 0 0 / 0.7);
        }

        .cta-form input[type='email']::placeholder {
          color: #9999aa;
        }

        .cta-form input[type='email']:focus {
          background-color: #5858f7;
          color: #fff;
          box-shadow: 0 0 12px #7b61ffcc;
        }

        .cta-form button {
          /* Кнопка c тем же стилем btn-primary */
          all: unset;
          cursor: pointer;
          user-select: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          padding: 12px 28px;
          border-radius: 9999px;
          transition: background-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
          box-shadow: 0 0 0 1px rgba(255 255 255 / 0.1);
          color: white;
          background: linear-gradient(90deg, #2a2a72, #009ffd);
          text-align: center;
          min-width: 140px;
          user-select: none;
          text-decoration: none;
          -webkit-font-smoothing: antialiased;
        }
        .cta-form button:hover,
        .cta-form button:focus {
          background: linear-gradient(90deg, #0050b3, #00c6ff);
          box-shadow:
            0 0 8px #00c6ff,
            0 4px 16px rgb(0 198 255 / 0.5);
          transform: translateY(-3px);
          outline: none;
        }
        .cta-form button:active {
          transform: translateY(-1px);
          box-shadow:
            0 0 6px #00a6d9,
            0 2px 8px rgb(0 166 217 / 0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-content {
            max-width: 380px;
          }
          .courses-grid {
            gap: 24px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 70vh;
            padding: 0 15px;
          }

          .hero-content {
            position: relative;
            max-width: 100%;
            text-align: center;
            margin-bottom: 20px;
            top: auto;
            left: auto;
            transform: none;
            color: #f0f0f5;
            text-shadow:
              0 2px 6px rgba(0,0,0,0.9);
          }

          .hero-banner {
            position: relative;
            height: 50vh;
            filter: brightness(0.6);
            border-radius: 12px;
          }

          .buttons {
            justify-content: center;
          }

          .cta-form {
            flex-direction: column;
          }

          .cta-form input[type='email'] {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
