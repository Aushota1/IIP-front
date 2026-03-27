import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../services/courses';

const AllCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allCourses, setAllCourses] = useState({});
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('courseFavorites')) || {};
    setFavorites(savedFavorites);
    getAllCourses().then(setAllCourses);
  }, []);

  useEffect(() => {
    let result = Object.entries(allCourses);
    if (searchTerm) {
      result = result.filter(([_, course]) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterLevel !== 'all') {
      result = result.filter(([_, course]) => course.level === filterLevel);
    }
    setFilteredCourses(result);
  }, [searchTerm, filterLevel, allCourses]);

  const levels = ['all', 'Начальный', 'Средний', 'Продвинутый'];

  return (
    <div className="all-courses-page">
      <header className="courses-header">
        <div className="header-content">
          <h1>Все наши курсы</h1>
          <p>Выберите курс, который подходит именно вам</p>
          
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Поиск курсов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="filter-tabs">
              {levels.map(level => (
                <button
                  key={level}
                  className={`filter-tab ${filterLevel === level ? 'active' : ''}`}
                  onClick={() => setFilterLevel(level)}
                >
                  {level === 'all' ? 'Все уровни' : level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="courses-container">
        {filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(([slug, course]) => (
              <CourseCard 
                key={slug}
                slug={slug}
                title={course.title}
                description={course.excerpt}
                duration={course.duration}
                level={course.level}
                price={course.price}
                image={course.image}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>К сожалению, по вашему запросу ничего не найдено 😕</p>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterLevel('all');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ slug, title, description, duration, level, price, image }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="glass-course-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="glass-overlay"></div>
      
      <div className="card-content">
        <div className={`level-badge ${level.toLowerCase()}`}>{level}</div>
        
        <div className="text-content">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        
        <div className="card-footer">
          <div className="duration-pill">{duration}</div>
          <div className="price-bubble">{price}</div>
        </div>
        
        <Link 
          to={`/courses/${slug}`} 
          className="action-button"
          style={{
            transform: isHovered ? 'translateY(0)' : 'translateY(200%)',
            opacity: isHovered ? 1 : 0
          }}
        >
          <span>Начать обучение</span>
          <div className="button-arrow">→</div>
        </Link>
      </div>
    </div>
  );
};

export default AllCourses;