import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import Testimonial from '../components/Testimonial';

import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import bg1 from '../assets/fon1.jpg';
import bg2 from '../assets/fon1.jpg';
import bg3 from '../assets/fon3.jpg';
import bg4 from '../assets/fon4.jpg';

// Регистрируем плагины GSAP
gsap.registerPlugin(ScrollTrigger);

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
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: { 
        enable: true, 
        mode: "repulse",
        parallax: {
          enable: true,
          force: 60,
          smooth: 10
        }
      },
      onClick: { enable: false },
      resize: true,
    },
    modes: {
      repulse: { 
        distance: 100, 
        duration: 0.4,
        speed: 0.5
      }
    }
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1
    },
    collisions: { enable: false },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "bounce" }
    },
    number: { 
      value: 80, 
      density: { 
        enable: true, 
        area: 800 
      } 
    },
    opacity: { value: 0.3 },
    shape: { type: "circle" },
    size: { 
      value: { min: 1, max: 3 },
      animation: {
        enable: true,
        speed: 3,
        sync: false
      }
    }
  },
  detectRetina: true,
};

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState('home');
  
  // Refs для анимаций
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const coursesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Инициализация анимаций при скролле
    const setupAnimations = () => {
      // Hero section animation
      gsap.from(heroRef.current.querySelectorAll('h1, p, .buttons'), {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      });

      // About section animation
      gsap.from(aboutRef.current.querySelectorAll('h2, .subtitle'), {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      gsap.from(aboutRef.current.querySelectorAll('.stat'), {
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 80,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3
      });

      // Courses section animation
      gsap.from(coursesRef.current.querySelectorAll('h2, .subtitle'), {
        scrollTrigger: {
          trigger: coursesRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      gsap.from(coursesRef.current.querySelectorAll('.course-card'), {
        scrollTrigger: {
          trigger: coursesRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 100,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3
      });

      // Testimonials section animation
      gsap.from(testimonialsRef.current.querySelectorAll('h2, .subtitle'), {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });

      gsap.from(testimonialsRef.current.querySelectorAll('.testimonial-card'), {
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: "top 70%",
        },
        opacity: 0,
        y: 100,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3
      });

      // CTA section animation
      gsap.from(ctaRef.current.querySelectorAll('h2, p, form'), {
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
      });
    };

    const onMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
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
    
    // Инициализируем анимации после загрузки
    setupAnimations();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const particlesInit = async (main) => { 
    await loadFull(main); 
  };

  return (
    <div className="modern-homepage">
      <Header activeSection={activeSection} />

      {/* Hero Section */}
      <section id="home" className="hero-section" ref={heroRef}>
        <Particles id="hero-particles" init={particlesInit} options={particlesOptions} />
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              <span className="hero-line">Образование</span>
              <span className="hero-line gradient-text">будущего</span>
              <span className="hero-line">уже здесь</span>
            </h1>
            <p className="hero-subtitle">
              Онлайн-курсы от практикующих экспертов. Освойте востребованную профессию или повысьте квалификацию.
            </p>
            <div className="buttons">
              <Link to="#courses" className="btn btn-primary">
                Выбрать курс
                <span className="btn-icon">→</span>
              </Link>
              <button className="btn btn-secondary">
                Узнать больше
                <span className="btn-icon">↓</span>
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-wrapper">
              <img src={bg1} alt="Студенты FutureCode" className="main-image" />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Листайте вниз</span>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section" ref={aboutRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">О нашей школе</h2>
            <p className="section-subtitle">FutureCode — это современная платформа для обучения профессиям будущего</p>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="number" data-count="10">0</div>
              <div className="label">Направлений</div>
              <div className="desc">Программирование, AI, 3D-дизайн и другие востребованные специальности</div>
            </div>
            <div className="stat">
              <div className="number" data-count="5000">0+</div>
              <div className="label">Студентов</div>
              <div className="desc">Которые уже прошли наши курсы и добились успеха в профессии</div>
            </div>
            <div className="stat">
              <div className="number" data-count="50">0</div>
              <div className="label">Преподавателей</div>
              <div className="desc">Практикующих экспертов из Google, NVIDIA и других топ-компаний</div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section" ref={coursesRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Топовые курсы 2024</h2>
            <p className="section-subtitle">Программы, которые дают реальные навыки для работы в технологиях будущего</p>
          </div>
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                {...course} 
                slug={course.slug} 
                mousePosition={mousePosition} 
                className="course-card"
              />
            ))}
          </div>
          <div className="all-courses-link">
            <Link to="/courses" className="btn btn-outline">
              Все курсы
              <span className="btn-icon">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" ref={testimonialsRef}>
        <Particles id="testimonials-particles" init={particlesInit} options={particlesOptions} />
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Отзывы студентов</h2>
            <p className="section-subtitle">Что говорят наши выпускники о курсах и процессе обучения</p>
          </div>
          <div className="testimonials-list">
            {testimonials.map((testimonial) => (
              <Testimonial 
                key={testimonial.id} 
                {...testimonial} 
                mousePosition={mousePosition} 
                className="testimonial-card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Готовы начать обучение?</h2>
            <p className="cta-subtitle">Оставьте заявку и получите консультацию по подбору курса</p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Ваш email" required />
              <button type="submit" className="btn btn-primary">
                Отправить
                <span className="btn-icon">→</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .modern-homepage {
          font-family: 'Manrope', 'Inter', sans-serif;
          background-color: #0a0a0a;
          color: #e0e0e0;
          min-height: 100vh;
          overflow-x: hidden;
          scroll-behavior: smooth;
          line-height: 1.6;
        }

        /* Общие стили */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin-bottom: 16px;
          background: linear-gradient(90deg, #ffffff, #b8b8ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          line-height: 1.2;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #a0a0bb;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 500;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 0 80px;
          overflow: hidden;
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          position: relative;
          z-index: 2;
        }

        .hero-text {
          flex: 1;
          max-width: 600px;
        }

        .hero-image {
          flex: 1;
          max-width: 600px;
          position: relative;
        }

        .image-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .main-image {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.5s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(123, 97, 255, 0.2), rgba(255, 97, 182, 0.1));
          mix-blend-mode: overlay;
        }

        .hero-line {
          display: block;
          opacity: 0;
          transform: translateY(20px);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #c7c7d8;
          margin: 24px 0 32px;
          max-width: 500px;
          font-weight: 500;
          line-height: 1.6;
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
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          animation: bounce 2s infinite;
        }

        .mouse {
          width: 24px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 12px;
          margin-bottom: 8px;
          position: relative;
        }

        .wheel {
          width: 4px;
          height: 8px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll 2s infinite;
        }

        @keyframes scroll {
          0% { top: 6px; opacity: 1; }
          50% { top: 18px; opacity: 0.5; }
          100% { top: 6px; opacity: 1; }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }

        /* About Section */
        .about-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #0a0a0a 0%, #121216 100%);
          position: relative;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 60px;
        }

        .stat {
          background: rgba(30, 30, 35, 0.6);
          border-radius: 16px;
          padding: 40px 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          text-align: center;
        }

        .stat:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(123, 97, 255, 0.2);
          border-color: rgba(123, 97, 255, 0.3);
        }

        .number {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 3.5rem;
          margin-bottom: 12px;
          background: linear-gradient(90deg, #7b61ff, #ff61b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          line-height: 1;
        }

        .label {
          font-weight: 700;
          font-size: 1.3rem;
          margin-bottom: 12px;
          color: #e0e0ff;
        }

        .desc {
          font-size: 1rem;
          color: #a0a0bb;
          line-height: 1.6;
        }

        /* Courses Section */
        .courses-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #121216 0%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
        }

        .courses-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(123, 97, 255, 0.1) 0%, transparent 70%);
          z-index: 0;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .all-courses-link {
          margin-top: 60px;
          text-align: center;
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #0a0a0a 0%, #121216 100%);
          position: relative;
        }

        .testimonials-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        /* CTA Section */
        .cta-section {
          padding: 120px 0;
          background: linear-gradient(135deg, #7b61ff 0%, #ff61b6 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url(${bg3}) center/cover no-repeat;
          opacity: 0.1;
          z-index: 0;
        }

        .cta-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: white;
        }

        .cta-subtitle {
          font-size: 1.2rem;
          margin-bottom: 40px;
          color: rgba(255, 255, 255, 0.9);
        }

        .cta-form {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-form input[type='email'] {
          flex: 1;
          min-width: 300px;
          padding: 16px 24px;
          border-radius: 50px;
          border: none;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .cta-form input[type='email']::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .cta-form input[type='email']:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
        }

        /* Кнопки */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          outline: none;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .btn-icon {
          margin-left: 8px;
          transition: transform 0.3s ease;
        }

        .btn:hover .btn-icon {
          transform: translateX(4px);
        }

        .btn-secondary:hover .btn-icon {
          transform: translateY(4px);
        }

        .btn-primary {
          background: linear-gradient(90deg, #7b61ff, #ff61b6);
          color: white;
          box-shadow: 0 4px 15px rgba(123, 97, 255, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(123, 97, 255, 0.5);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-outline {
          background: transparent;
          color: #7b61ff;
          border: 2px solid #7b61ff;
          padding: 12px 28px;
        }

        .btn-outline:hover {
          background: rgba(123, 97, 255, 0.1);
          color: #7b61ff;
          transform: translateY(-3px);
        }

        /* Анимации */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Адаптивность */
        @media (max-width: 1024px) {
          .hero-content {
            flex-direction: column;
            text-align: center;
          }

          .hero-text {
            max-width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hero-subtitle {
            max-width: 80%;
          }

          .hero-image {
            max-width: 80%;
            margin-top: 40px;
          }

          .section-title {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            max-width: 100%;
            font-size: 1.1rem;
          }

          .hero-image {
            max-width: 100%;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .cta-form {
            flex-direction: column;
            gap: 12px;
          }

          .cta-form input[type='email'] {
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.8rem;
          }

          .hero-section {
            padding: 100px 0 60px;
          }

          .btn {
            width: 100%;
          }

          .buttons {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;