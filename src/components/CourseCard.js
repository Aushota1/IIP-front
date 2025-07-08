import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

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

export default CourseCard;