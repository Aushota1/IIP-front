import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import Testimonial from '../components/Testimonial';

// Import images
import algoCourse from '../assets/algo-course.jpg';
import threeDCourse from '../assets/3d-course.jpg';
import aiCourse from '../assets/ai-course.jpg';
import student1 from '../assets/student1.jpg';
import student2 from '../assets/student2.jpg';
import student3 from '../assets/student3.jpg';

// Particles config for background
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  
  const courses = [
    {
      id: 1,
      title: 'Algorithm Rush: Код как спорт',
      slug: 'algorithm-rush',
      description: 'Хардкорное программирование для будущих чемпионов ICPC и Google Hash Code',
      duration: '6 месяцев',
      level: 'Продвинутый',
      price: '29 900 ₽',
      image: algoCourse,
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
      image: threeDCourse,
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
      image: aiCourse,
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
      avatar: student1,
    },
    {
      id: 2,
      name: 'Иван Петров',
      role: 'UX/UI дизайнер',
      text: 'Отличная подача материала, много практики. После курса собрал портфолио и получил первые заказы на фрилансе.',
      avatar: student2,
    },
    {
      id: 3,
      name: 'Елена Ковалева',
      role: 'Маркетолог',
      text: 'Практические кейсы из курса по маркетингу сразу применила в работе. Результаты не заставили себя ждать!',
      avatar: student3,
    },
  ];

  // Mouse position tracker for parallax effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Determine active section for navigation
      const sections = ['home', 'about', 'courses', 'testimonials'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Particles.js initialization
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="future-edu-app">
      {/* Animated background particles */}
      <div className="particles-container">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#ffffff",
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      <Header activeSection={activeSection} />

      {/* Hero Section with 3D parallax effect */}
      <section 
        id="home" 
        className="hero-section"
        style={{
          '--mouse-x': `${(mousePosition.x / window.innerWidth) * 20 - 10}px`,
          '--mouse-y': `${(mousePosition.y / window.innerHeight) * 20 - 10}px`,
          '--scroll-y': `${scrollY * 0.3}px`
        }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-word title-word-1">Образование</span>
              <span className="title-word title-word-2">будущего</span>
              <span className="title-word title-word-3">уже здесь</span>
            </h1>
            <p className="hero-subtitle">
              Онлайн-курсы от практикующих экспертов. Освойте востребованную профессию или повысьте квалификацию.
            </p>
            <div className="hero-buttons">
              <Link to="#courses" className="btn btn-holographic">
                <span>Выбрать курс</span>
                <div className="btn-holographic-effect"></div>
              </Link>
              <button className="btn btn-neon-outline">
                Узнать больше
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-cube"></div>
            <div className="floating-pyramid"></div>
            <div className="floating-sphere"></div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow-down"></div>
        </div>
      </section>

      {/* About Section with animated counters */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2 className="section-title">О нашей школе</h2>
          <p className="section-subtitle">
            FutureCode — это современная платформа для обучения профессиям будущего
          </p>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number" data-count="10">0</div>
            <h3 className="stat-title">Направлений</h3>
            <p className="stat-description">Программирование, AI, 3D-дизайн и другие востребованные специальности</p>
          </div>
          <div className="stat-card">
            <div className="stat-number" data-count="5000">0</div>
            <h3 className="stat-title">Студентов</h3>
            <p className="stat-description">Которые уже прошли наши курсы и добились успеха в профессии</p>
          </div>
          <div className="stat-card">
            <div className="stat-number" data-count="50">0</div>
            <h3 className="stat-title">Преподавателей</h3>
            <p className="stat-description">Практикующих экспертов из Google, NVIDIA и других топ-компаний</p>
          </div>
        </div>
      </section>

      {/* Courses Section with interactive cards */}
      <section id="courses" className="courses-section">
        <div className="section-header">
          <h2 className="section-title">Топовые курсы 2024</h2>
          <p className="section-subtitle">
            Программы, которые дают реальные навыки для работы в технологиях будущего
          </p>
        </div>
        <div className="courses-grid">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              {...course} 
              slug={course.slug}
              mousePosition={mousePosition}
            />
          ))}
        </div>
        <div className="section-footer">
          <Link to="/courses" className="btn btn-gradient">
            <span>Все курсы</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Testimonials Section with 3D cards */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Отзывы студентов</h2>
          <p className="section-subtitle">
            Что говорят наши выпускники о курсах и процессе обучения
          </p>
        </div>
        <div className="testimonials-slider">
          {testimonials.map(testimonial => (
            <Testimonial 
              key={testimonial.id} 
              {...testimonial} 
              mousePosition={mousePosition}
            />
          ))}
        </div>
      </section>

      {/* CTA Section with floating elements */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Готовы начать обучение?</h2>
            <p className="cta-subtitle">
              Оставьте заявку и получите консультацию по подбору курса
            </p>
            <form className="cta-form">
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="form-input"
                />
                <button type="submit" className="btn btn-neon">
                  Отправить
                  <span className="neon-border"></span>
                </button>
              </div>
            </form>
          </div>
          <div className="cta-visual">
            <div className="floating-icon icon-1">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="floating-icon icon-2">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="floating-icon icon-3">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        :root {
          --color-primary: #6e45e2;
          --color-secondary: #88d3ce;
          --color-accent: #ff7e5f;
          --color-dark: #1a1a2e;
          --color-light: #f8f9fa;
          --font-main: 'Inter', sans-serif;
          --font-heading: 'Poppins', sans-serif;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes holographic {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .future-edu-app {
          position: relative;
          overflow-x: hidden;
          font-family: var(--font-main);
          color: #fff;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        /* Hero Section Styles */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0;
          overflow: hidden;
          z-index: 1;
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          max-width: 600px;
          transform: translate3d(var(--mouse-x), var(--mouse-y), 0);
          transition: transform 0.3s ease-out;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          font-family: var(--font-heading);
          background: linear-gradient(90deg, #fff, var(--color-secondary));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .title-word {
          display: inline-block;
          margin-right: 0.5em;
        }

        .title-word-1 { animation: float 6s ease-in-out infinite; }
        .title-word-2 { animation: float 6s ease-in-out infinite 1s; }
        .title-word-3 { animation: float 6s ease-in-out infinite 2s; }

        .hero-subtitle {
          font-size: 1.5rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          max-width: 80%;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          margin-top: 40px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 32px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
        }

        .btn-holographic {
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          box-shadow: 0 10px 30px rgba(110, 69, 226, 0.5);
          position: relative;
        }

        .btn-holographic-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.1) 50%,
            rgba(255,255,255,0) 100%
          );
          transform: rotate(30deg);
          animation: holographic 3s linear infinite;
        }

        .btn-neon-outline {
          background: transparent;
          color: var(--color-secondary);
          border: 2px solid var(--color-secondary);
          box-shadow: 0 0 10px rgba(136, 211, 206, 0.3), 
                      0 0 20px rgba(136, 211, 206, 0.2);
          transition: all 0.3s ease;
        }

        .btn-neon-outline:hover {
          box-shadow: 0 0 20px rgba(136, 211, 206, 0.5), 
                      0 0 40px rgba(136, 211, 206, 0.3);
          background: rgba(136, 211, 206, 0.1);
        }

        .hero-visual {
          position: relative;
          width: 500px;
          height: 500px;
        }

        .floating-cube, .floating-pyramid, .floating-sphere {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 10px;
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transform-style: preserve-3d;
        }

        .floating-cube {
          width: 150px;
          height: 150px;
          top: 50px;
          left: 50px;
          animation: float 8s ease-in-out infinite;
          transform: rotateX(45deg) rotateY(45deg);
        }

        .floating-pyramid {
          width: 120px;
          height: 120px;
          top: 200px;
          left: 250px;
          animation: float 10s ease-in-out infinite 2s;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .floating-sphere {
          width: 100px;
          height: 100px;
          top: 350px;
          left: 100px;
          border-radius: 50%;
          animation: float 12s ease-in-out infinite 1s;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .mouse {
          width: 30px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 15px;
          display: flex;
          justify-content: center;
          padding-top: 10px;
        }

        .wheel {
          width: 4px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          animation: pulse 2s infinite;
        }

        .arrow-down {
          width: 15px;
          height: 15px;
          border-right: 2px solid rgba(255, 255, 255, 0.8);
          border-bottom: 2px solid rgba(255, 255, 255, 0.8);
          transform: rotate(45deg);
          margin-top: 10px;
          animation: pulse 2s infinite 0.5s;
        }

        /* Section common styles */
        .section-header {
          text-align: center;
          margin-bottom: 60px;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          font-family: var(--font-heading);
          background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .section-subtitle {
          font-size: 1.2rem;
          opacity: 0.8;
          line-height: 1.6;
        }

        /* About Section */
        .about-section {
          padding: 120px 0;
          position: relative;
          background: linear-gradient(135deg, #16213e 0%, #0f3460 100%);
          overflow: hidden;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px 30px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .stat-number {
          font-size: 4rem;
          font-weight: 800;
          color: var(--color-secondary);
          margin-bottom: 1rem;
          font-family: var(--font-heading);
        }

        .stat-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .stat-description {
          opacity: 0.8;
          line-height: 1.6;
        }

        /* Courses Section */
        .courses-section {
          padding: 120px 0;
          background: linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%);
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-footer {
          text-align: center;
          margin-top: 60px;
        }

        .btn-gradient {
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          color: white;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(110, 69, 226, 0.5);
          transition: all 0.3s ease;
        }

        .btn-gradient:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(110, 69, 226, 0.7);
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 120px 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .testimonials-slider {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 0;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
        }

        .cta-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .cta-content {
          max-width: 600px;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
        }

        .cta-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cta-form {
          max-width: 500px;
        }

        .form-group {
          display: flex;
          gap: 10px;
        }

        .form-input {
          flex: 1;
          padding: 16px 24px;
          border-radius: 50px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .form-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        .btn-neon {
          background: white;
          color: var(--color-primary);
          font-weight: 600;
          padding: 16px 32px;
          border-radius: 50px;
          position: relative;
          overflow: hidden;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .neon-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50px;
          border: 2px solid transparent;
          background: linear-gradient(135deg, white, var(--color-secondary)) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          pointer-events: none;
        }

        .btn-neon:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
        }

        .cta-visual {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .floating-icon {
          position: absolute;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .floating-icon svg {
          width: 40px;
          height: 40px;
          stroke: white;
          stroke-width: 2;
        }

        .icon-1 {
          top: 50px;
          left: 50px;
          animation: float 8s ease-in-out infinite;
        }

        .icon-2 {
          top: 200px;
          left: 200px;
          animation: float 10s ease-in-out infinite 2s;
        }

        .icon-3 {
          top: 300px;
          left: 100px;
          animation: float 12s ease-in-out infinite 1s;
        }

        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }

          .hero-text {
            margin-bottom: 60px;
          }

          .hero-subtitle {
            max-width: 100%;
          }

          .hero-buttons {
            justify-content: center;
          }

          .hero-visual {
            width: 100%;
            height: 400px;
          }

          .cta-container {
            flex-direction: column;
            text-align: center;
          }

          .cta-content {
            margin-bottom: 60px;
          }

          .form-group {
            flex-direction: column;
          }

          .cta-visual {
            width: 100%;
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;