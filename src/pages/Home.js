import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import TestimonialCarousel from '../components/TestimonialCarousel';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

import bg1 from '../assets/fon1.jpg';
import bg3 from '../assets/fon3.jpg';
import demoVideo from '../assets/code-demo.mp4';

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
    image: bg1,
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

const features = [
  {
    id: 1,
    title: 'Персонализированное обучение',
    description: 'Адаптивная программа под ваш уровень и цели с ИИ-ассистентом',
    icon: '🔍'
  },
  {
    id: 2,
    title: 'Реальные проекты',
    description: 'Работа над кейсами от партнёров: Яндекс, VK, Tinkoff',
    icon: '🚀'
  },
  {
    id: 3,
    title: 'Карьерная поддержка',
    description: 'Трудоустройство в топовые IT-компании после завершения курса',
    icon: '💼'
  },
  {
    id: 4,
    title: 'Сообщество',
    description: 'Доступ к закрытому клубу выпускников и менторов',
    icon: '👥'
  }
];

const codeSnippets = [
  `// Алгоритм Дейкстры на C++
#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

const int INF = INT_MAX;

void dijkstra(vector<vector<pair<int, int>>>& graph, 
             int start, vector<int>& dist) {
    dist.assign(graph.size(), INF);
    dist[start] = 0;
    
    priority_queue<pair<int, int>, 
                   vector<pair<int, int>>, 
                   greater<pair<int, int>>> pq;
    pq.push({0, start});
    
    while (!pq.empty()) {
        int u = pq.top().second;
        int d = pq.top().first;
        pq.pop();
        
        if (d != dist[u]) continue;
        
        for (auto& edge : graph[u]) {
            int v = edge.first;
            int w = edge.second;
            
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
}`,
  `// Генеративное создание 3D-модели
import tensorflow as tf
from tensorflow.keras.layers import Dense, Reshape
from tensorflow.keras.models import Sequential

def build_generator(latent_dim):
    model = Sequential([
        Dense(256, input_dim=latent_dim, activation='relu'),
        Dense(512, activation='relu'),
        Dense(1024, activation='relu'),
        Dense(2048, activation='relu'),
        Dense(4096, activation='sigmoid'),
        Reshape((16, 16, 16, 1))
    ])
    return model

# Создание генеративной модели
latent_dim = 100
generator = build_generator(latent_dim)
generator.summary()`,
  `// Оптимизированный SQL-запрос
WITH user_activity AS (
  SELECT 
    user_id,
    COUNT(DISTINCT session_id) AS sessions,
    SUM(duration) AS total_time
  FROM events
  WHERE event_date BETWEEN NOW() - INTERVAL '7 days' AND NOW()
  GROUP BY user_id
)
SELECT 
  u.id,
  u.name,
  u.email,
  ua.sessions,
  ua.total_time,
  CASE 
    WHEN ua.total_time > 300 THEN 'Активный'
    WHEN ua.total_time > 60 THEN 'Средний'
    ELSE 'Низкий'
  END AS activity_level
FROM users u
JOIN user_activity ua ON u.id = ua.user_id
WHERE ua.sessions > 3
ORDER BY ua.total_time DESC
LIMIT 100;`
];

const particlesOptions = {
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_linked: {
          opacity: 0.3
        }
      }
    }
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      color: "#ffffff",
      distance: 120,
      enable: true,
      opacity: 0.2,
      width: 1
    },
    collisions: { enable: false },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "bounce",
      bounce: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    },
    number: {
      density: {
        enable: true,
        area: 800
      },
      value: 60
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    shape: {
      type: "circle"
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.3,
        sync: false
      }
    }
  },
  detectRetina: true
};

// Компонент для анимированного отображения кода
const TypingCodeBlock = ({ code, language }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const lines = code.split('\n');
  const typingSpeed = 30;
  const lineDelay = 300;
  
  useEffect(() => {
    setDisplayedCode('');
    setCurrentLine(0);
    setCurrentChar(0);
  }, [code]);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const timer = setTimeout(() => {
      if (currentChar < lines[currentLine].length) {
        // Добавляем следующий символ
        setDisplayedCode(prev => {
          const linesArr = prev.split('\n');
          if (!linesArr[currentLine]) {
            linesArr[currentLine] = '';
          }
          linesArr[currentLine] = lines[currentLine].substring(0, currentChar + 1);
          return linesArr.join('\n');
        });
        setCurrentChar(prev => prev + 1);
      } else {
        // Переходим на следующую строку
        if (currentLine < lines.length - 1) {
          setDisplayedCode(prev => prev + '\n');
          setCurrentLine(prev => prev + 1);
          setCurrentChar(0);
        }
      }
    }, currentChar < lines[currentLine].length ? typingSpeed : lineDelay);

    return () => clearTimeout(timer);
  }, [currentLine, currentChar, lines, code]);

  return (
    <pre>
      <code className={`language-${language}`}>
        {displayedCode}
        <span className="cursor">|</span>
      </code>
    </pre>
  );
};

const Home = () => {
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const particlesInit = async (main) => { 
    await loadFull(main); 
  };

  // Автоматическое переключение вкладок
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveCodeIndex(prev => (prev + 1) % codeSnippets.length);
    }, 8000); // Переключаем каждые 8 секунд
    
    return () => clearInterval(intervalRef.current);
  }, []);
  
  // Сброс автоматического переключения при ручном изменении
  const resetTyping = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveCodeIndex(prev => (prev + 1) % codeSnippets.length);
    }, 8000);
  };

  return (
    <div className="modern-homepage">
      <Header />

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <Particles 
          id="hero-particles" 
          init={particlesInit} 
          options={particlesOptions} 
          style={{ 
          position: 'absolute', 
          zIndex: 1,
          height: '100vh', // Ограничиваем высоту частиц высотой экрана
          top: 0,
          left: 0,
          right: 0
          }}
        />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
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
      </section>

      {/* Video Section */}
      <section id="video" className="video-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Как мы учим?</h2>
            <p className="section-subtitle">Погружение в практику с первого дня обучения</p>
          </div>
          <div className="video-wrapper">
            <video 
              src={demoVideo} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="demo-video"
            ></video>
            <div className="video-overlay"></div>
          </div>
          <div className="video-features">
            <div className="feature">
              <div className="icon">🎯</div>
              <div className="text">Интенсивная практика</div>
            </div>
            <div className="feature">
              <div className="icon">👨‍🏫</div>
              <div className="text">Персональный ментор</div>
            </div>
            <div className="feature">
              <div className="icon">🤝</div>
              <div className="text">Работа в команде</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Почему выбирают нас</h2>
            <p className="section-subtitle">Преимущества, которые делают обучение эффективным</p>
          </div>
          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.id} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section id="code" className="code-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Пишем код вместе</h2>
            <p className="section-subtitle">Реальные примеры из наших курсов</p>
          </div>
          <div className="code-content">
            <div className="code-description">
              <h3>Интерактивное обучение</h3>
              <p>Наши курсы построены на практике. С первого дня вы пишете код, решаете задачи и создаёте проекты.</p>
              
              <div className="code-tabs">
                <button 
                  className={`tab ${activeCodeIndex === 0 ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCodeIndex(0);
                    resetTyping();
                  }}
                >
                  Алгоритмы
                </button>
                <button 
                  className={`tab ${activeCodeIndex === 1 ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCodeIndex(1);
                    resetTyping();
                  }}
                >
                  ИИ/ML
                </button>
                <button 
                  className={`tab ${activeCodeIndex === 2 ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCodeIndex(2);
                    resetTyping();
                  }}
                >
                  Базы данных
                </button>
              </div>
              
              <div className="code-benefits">
                <div className="benefit">
                  <div className="icon">✅</div>
                  <div className="text">Разбор сложных алгоритмов</div>
                </div>
                <div className="benefit">
                  <div className="icon">✅</div>
                  <div className="text">Оптимизация производительности</div>
                </div>
                <div className="benefit">
                  <div className="icon">✅</div>
                  <div className="text">Лучшие практики кодирования</div>
                </div>
              </div>
            </div>
            
            <div className="code-editor">
              <div className="editor-header">
                <div className="editor-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="editor-title">code_snippet_{activeCodeIndex + 1}.{activeCodeIndex === 0 ? 'cpp' : activeCodeIndex === 1 ? 'py' : 'sql'}</div>
              </div>
              <div className="editor-body">
                <TypingCodeBlock 
                  code={codeSnippets[activeCodeIndex]} 
                  language={
                    activeCodeIndex === 0 ? 'cpp' : 
                    activeCodeIndex === 1 ? 'python' : 
                    'sql'
                  } 
                  key={activeCodeIndex} // Важно для сброса анимации при смене вкладки
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="courses-section">
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
      <section id="testimonials" className="testimonials-section">
        <div className="testimonials-overlay"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-header">
            <h2 className="section-title">Истории успеха</h2>
            <p className="section-subtitle">Наши выпускники работают в ведущих IT-компаниях</p>
          </div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
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
          line-height: 1.6;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          box-sizing: border-box;
          position: relative;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 2;
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
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #a0a0bb;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
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
          background: linear-gradient(135deg, #121216 0%, #0a0a0a 100%);
        }

        .hero-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
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
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .main-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(18, 18, 22, 0.6), rgba(10, 10, 10, 0.4));
          mix-blend-mode: overlay;
        }

        .hero-line {
          display: block;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #c7c7d8;
          margin: 24px 0 32px;
          max-width: 500px;
          font-weight: 500;
          line-height: 1.6;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        /* Video Section */
        .video-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #121216 0%, #0a0a0a 100%);
          position: relative;
        }

        .video-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          max-width: 900px;
          margin: 0 auto;
        }

        .demo-video {
          width: 100%;
          height: auto;
          display: block;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(18, 18, 22, 0.5), rgba(10, 10, 10, 0.3));
          pointer-events: none;
        }

        .video-features {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(30, 30, 35, 0.8);
          padding: 12px 24px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(123, 97, 255, 0.3);
        }

        .feature .icon {
          font-size: 1.5rem;
        }

        .feature .text {
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }

        /* Features Section */
        .features-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #0a0a0a 0%, #121216 100%);
          position: relative;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: rgba(30, 30, 35, 0.8);
          border-radius: 16px;
          padding: 40px 30px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #e0e0ff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .feature-description {
          font-size: 1.1rem;
          color: #a0a0bb;
          line-height: 1.6;
        }

        /* Code Section */
        .code-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #121216 0%, #0a0a0a 100%);
          position: relative;
          overflow: hidden;
        }

        .code-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .code-description {
          padding-right: 20px;
        }

        .code-description h3 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #ffffff;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .code-description p {
          font-size: 1.1rem;
          color: #a0a0bb;
          margin-bottom: 30px;
          line-height: 1.7;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .code-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 30px;
        }

        .tab {
          background: rgba(30, 30, 35, 0.8);
          border: 1px solid rgba(123, 97, 255, 0.3);
          color: #a0a0bb;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .tab.active {
          background: linear-gradient(90deg, #7b61ff, #ff61b6);
          color: white;
          border-color: transparent;
        }

        .code-benefits {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .benefit {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .benefit .icon {
          font-size: 1.2rem;
        }

        .benefit .text {
          font-size: 1.1rem;
          color: #e0e0e0;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .code-editor {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          height: 400px;
          border: 1px solid rgba(123, 97, 255, 0.3);
        }

        .editor-header {
          display: flex;
          align-items: center;
          padding: 12px 20px;
          background: #252526;
          border-bottom: 1px solid #3c3c3c;
        }

        .editor-dots {
          display: flex;
          gap: 6px;
          margin-right: 12px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red {
          background: #ff5f56;
        }

        .dot.yellow {
          background: #ffbd2e;
        }

        .dot.green {
          background: #27c93f;
        }

        .editor-title {
          color: #a0a0a0;
          font-size: 0.9rem;
          font-family: 'Consolas', monospace;
        }

        .editor-body {
          height: calc(100% - 45px);
          overflow: auto;
          padding: 15px;
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #e0e0e0;
          position: relative;
        }

        /* Анимация курсора */
        .cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        /* Courses Section */
        .courses-section {
          padding: 120px 0;
          background: linear-gradient(180deg, #0a0a0a 0%, #121216 100%);
          position: relative;
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
          background: linear-gradient(180deg, #121216 0%, #0a0a0a 100%);
          position: relative;
        }
        
        .testimonials-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 10, 10, 0.7);
          z-index: 1;
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
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .cta-subtitle {
          font-size: 1.2rem;
          margin-bottom: 40px;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
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
          border: none;
          outline: none;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .btn-icon {
          margin-left: 8px;
        }

        .btn-primary {
          background: linear-gradient(90deg, #7b61ff, #ff61b6);
          color: white;
          box-shadow: 0 4px 15px rgba(123, 97, 255, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-outline {
          background: transparent;
          color: #7b61ff;
          border: 2px solid #7b61ff;
          padding: 12px 28px;
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

          .code-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .code-description {
            padding-right: 0;
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

          .video-features {
            flex-wrap: wrap;
            justify-content: center;
          }

          .code-editor {
            height: 350px;
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
            margin-bottom: 10px;
          }

          .buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
          }

          .cta-form {
            flex-direction: column;
            gap: 12px;
          }

          .cta-form input[type='email'] {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;