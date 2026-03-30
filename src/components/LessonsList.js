import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/scss/components/_lessons-list.scss';

const LessonsList = ({ courseId, lessons }) => {
  const navigate = useNavigate();

  const handleLessonClick = (lessonId) => {
    navigate(`/courses/${courseId}/lessons/${lessonId}`);
  };

  return (
    <div className="lessons-list">
      <h2>Уроки курса</h2>
      <div className="lessons-grid">
        {lessons && lessons.length > 0 ? (
          lessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="lesson-card"
              onClick={() => handleLessonClick(lesson.id)}
            >
              <div className="lesson-number">{index + 1}</div>
              <div className="lesson-info">
                <h3>{lesson.title}</h3>
                <p className="lesson-description">{lesson.description}</p>
                <div className="lesson-meta">
                  <span className="lesson-duration">
                    ⏱ {lesson.duration || '30 мин'}
                  </span>
                  {lesson.completed && (
                    <span className="lesson-completed">✓ Завершено</span>
                  )}
                </div>
              </div>
              <div className="lesson-arrow">→</div>
            </div>
          ))
        ) : (
          <p className="no-lessons">Уроки скоро появятся</p>
        )}
      </div>
    </div>
  );
};

export default LessonsList;
