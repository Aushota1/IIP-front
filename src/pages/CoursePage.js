import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Particles } from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './CoursePage.css';
import { courses } from './courses';

const CoursePage = () => {
  const { courseSlug } = useParams();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const { scrollYProgress } = useScroll();
  const course = courses[courseSlug];

  // Параллакс эффекты
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0.8, 0.9], [1, 0]);

  // Инициализация частиц
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  if (!course) return (
    <motion.div 
      className="not-found-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2>Курс не найден</h2>
      <Link to="/courses" className="back-button">
        <motion.span whileHover={{ x: 5 }}>← Вернуться к курсам</motion.span>
      </Link>
    </motion.div>
  );

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => setIsEnrolling(false), 2000);
  };

  return (
    <motion.div 
      className="course-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Интерактивный фон с частицами */}
      <div className="particles-container">
        <Particles
          id="tsparticles-course"
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
      
      {/* Основной контент */}
      <div className="course-content">
        <motion.header 
          className="course-header"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="course-cover"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <img src={course.image} alt={course.title} />
            <div className="cover-overlay"></div>
          </motion.div>
          
          <div className="header-content">
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {course.title.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            
            <motion.p 
              className="excerpt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {course.excerpt}
            </motion.p>
            
            <motion.div 
              className="meta-tags"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <span className={`level-badge ${course.level.toLowerCase()}`}>
                {course.level}
              </span>
              <span className="duration">{course.duration}</span>
              <span className="price">{course.price}</span>
            </motion.div>
            
            <motion.button
              className={`enroll-button ${isEnrolling ? 'loading' : ''}`}
              onClick={handleEnroll}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {isEnrolling ? 'Записываем...' : 'Записаться на курс'}
              <div className="button-liquid"></div>
            </motion.button>
          </div>
        </motion.header>

        {/* Навигация по разделам */}
        <motion.nav 
          className="course-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {['about', 'program', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab === 'about' && 'О курсе'}
              {tab === 'program' && 'Программа'}
              {tab === 'reviews' && 'Отзывы'}
            </button>
          ))}
        </motion.nav>

        {/* Контент вкладок */}
        <AnimatePresence mode="wait">
          <motion.section 
            className="tab-content"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'about' && (
              <>
                <h2>Описание курса</h2>
                <p>{course.description}</p>
                
                <div className="features-grid">
                  {course.features.map((feature, i) => (
                    <motion.div 
                      className="feature-card"
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="feature-icon">{feature.icon}</div>
                      <h3>{feature.title}</h3>
                      <p>{feature.text}</p>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'program' && (
              <ul className="program-list">
                {course.program.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="module-number">{i+1}</div>
                    <div className="module-content">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="module-duration">{item.duration}</div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-container">
                {course.reviews.map((review, i) => (
                  <motion.div 
                    className="review-card"
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="review-author">
                      <img src={review.avatar} alt={review.name} />
                      <div>
                        <h3>{review.name}</h3>
                        <span>{review.role}</span>
                      </div>
                    </div>
                    <p>"{review.text}"</p>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        {/* Преподаватели */}
        <motion.section 
          className="instructors-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2>Преподаватели</h2>
          <div className="instructors-grid">
            {course.instructors.map((instructor, i) => (
              <motion.div 
                className="instructor-card"
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="instructor-photo">
                  <img src={instructor.photo} alt={instructor.name} />
                </div>
                <h3>{instructor.name}</h3>
                <p className="position">{instructor.position}</p>
                <p className="bio">{instructor.bio}</p>
                <div className="social-links">
                  {instructor.social.map((social, j) => (
                    <a 
                      key={j} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ y: -3 }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Плавающие элементы */}
      <motion.div 
        className="floating-circle"
        animate={{
          y: [0, 40, 0],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ opacity }}
      />
    </motion.div>
  );
};

export default CoursePage;
