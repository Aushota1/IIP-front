import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from './courses'; // Импортируем ваши курсы
import './UserProfile.css';

const UserProfile = () => {
  // Mock-данные пользователя с расширенной структурой
  const [userData, setUserData] = useState({
    name: "Иван Иванов",
    email: "ivan@example.com",
    joinDate: "15.03.2023",
    lastVisit: "05.06.2024 14:30",
    stats: {
      totalTime: "127 часов",
      streak: 18,
      completedTasks: 156
    },
    enrolledCourses: [
      { 
        slug: 'blender-cad', 
        progress: 45,
        completedLessons: [0], // Индексы завершенных уроков
        lastActivity: "2024-06-05"
      },
      { 
        slug: 'algorithm-rush', 
        progress: 15,
        completedLessons: [],
        lastActivity: "2024-06-03"
      }
    ],
    activity: {
      '2024-06-05': { 
        count: 3, 
        details: [
          'Просмотр урока: "Знакомство с интерфейсом Blender"',
          'Форум: задан вопрос по моделированию'
        ] 
      },
      '2024-06-03': { 
        count: 2, 
        details: [
          'Начат курс "Algorithm Rush"',
          'Пройден тест введения'
        ] 
      }
    }
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);

  // Получаем данные выбранного курса
  const selectedCourse = selectedCourseSlug 
    ? courses[selectedCourseSlug] 
    : null;

  // Получаем прогресс пользователя по курсу
  const getUserCourseProgress = (slug) => {
    return userData.enrolledCourses.find(c => c.slug === slug) || {};
  };

  // Форматирование даты
  const formatDate = (dateStr) => {
    const options = { day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('ru-RU', options);
  };

  // Отметить урок как завершенный/незавершенный
  const toggleLessonCompletion = (courseSlug, lessonIndex) => {
    setUserData(prev => {
      const updatedCourses = prev.enrolledCourses.map(course => {
        if (course.slug === courseSlug) {
          const updatedCompleted = course.completedLessons.includes(lessonIndex)
            ? course.completedLessons.filter(i => i !== lessonIndex)
            : [...course.completedLessons, lessonIndex];
          
          // Пересчитываем прогресс
          const newProgress = Math.round(
            (updatedCompleted.length / courses[courseSlug].program.length) * 100
          );

          return {
            ...course,
            completedLessons: updatedCompleted,
            progress: newProgress,
            lastActivity: new Date().toISOString().split('T')[0]
          };
        }
        return course;
      });

      // Обновляем активность
      const today = new Date().toISOString().split('T')[0];
      const activityEntry = prev.activity[today] || { count: 0, details: [] };
      
      const lessonTitle = courses[courseSlug].program[lessonIndex].title;
      const action = prev.enrolledCourses
        .find(c => c.slug === courseSlug).completedLessons.includes(lessonIndex)
          ? 'Отменено завершение урока'
          : 'Завершен урок';

      return {
        ...prev,
        enrolledCourses: updatedCourses,
        activity: {
          ...prev.activity,
          [today]: {
            count: activityEntry.count + 1,
            details: [
              `${action}: "${lessonTitle}"`,
              ...activityEntry.details
            ]
          }
        }
      };
    });
  };

  return (
    <div className="profile-container">
      {/* Хедер */}
      <header className="profile-header">
        <h1>Личный кабинет</h1>
        <div className="time-stats">
          <span>На платформе: {userData.stats.totalTime}</span>
          <span>Последний визит: {userData.lastVisit}</span>
        </div>
      </header>

      {/* Основная информация */}
      <section className="user-info-section">
        <div className="avatar-container">
          <div className="avatar">
            {userData.name.charAt(0)}
          </div>
          <div className="user-meta">
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <p>Участник с {userData.joinDate}</p>
          </div>
        </div>

        <div className="github-like-stats">
          <div className="stat-box">
            <span className="stat-number">{userData.stats.streak}</span>
            <span className="stat-label">Дней подряд</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{userData.stats.completedTasks}</span>
            <span className="stat-label">Решено задач</span>
          </div>
        </div>
      </section>

      {/* Календарь активности */}
      <section className="activity-section">
        <h3>Активность</h3>
        <div className="activity-calendar">
          {Object.entries(userData.activity).map(([date, activity]) => (
            <div 
              key={date} 
              className={`activity-day ${activity.count > 2 ? 'high' : 'low'}`}
              title={`${date}: ${activity.details.join(', ')}`}
              onClick={() => setSelectedDate(date)}
            >
              {new Date(date).getDate()}
            </div>
          ))}
        </div>
      </section>

      {/* Детали выбранной даты */}
      {selectedDate && userData.activity[selectedDate] && (
        <div className="activity-details">
          <h4>{formatDate(selectedDate)}</h4>
          <ul>
            {userData.activity[selectedDate].details.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Блок курсов */}
      <section className="courses-section">
        <h3>Мои курсы</h3>
        <div className="courses-grid">
          {userData.enrolledCourses.map(({ slug, progress }) => {
            const course = courses[slug];
            return (
              <div 
                key={slug}
                className={`course-card ${selectedCourseSlug === slug ? 'active' : ''}`}
                onClick={() => setSelectedCourseSlug(slug)}
              >
                <div className="course-card-header">
                  <h4>{course.title}</h4>
                  <span className="course-level">{course.level}</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>{progress}%</span>
                </div>
                <div className="course-meta">
                  <span>Последняя активность: {formatDate(getUserCourseProgress(slug).lastActivity)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Детали выбранного курса */}
      {selectedCourse && (
        <div className="course-details">
          <div className="course-details-header">
            <h3>{selectedCourse.title}</h3>
            <Link 
              to={`/courses/${selectedCourseSlug}`} 
              className="course-link"
            >
              Перейти к курсу →
            </Link>
          </div>
          
          <div className="course-progress">
            <div className="progress-info">
              <span>Прогресс: {getUserCourseProgress(selectedCourseSlug).progress}%</span>
              <span>{selectedCourse.duration}</span>
            </div>
          </div>

          <div className="course-program">
            <h4>Программа курса:</h4>
            <ul>
              {selectedCourse.program.map((lesson, index) => {
                const isCompleted = getUserCourseProgress(selectedCourseSlug)
                  .completedLessons?.includes(index) || false;
                
                return (
                  <li 
                    key={index} 
                    className={isCompleted ? 'completed' : ''}
                  >
                    <div className="lesson-info">
                      <span className="lesson-title">{lesson.title}</span>
                      <span className="lesson-duration">{lesson.duration}</span>
                    </div>
                    <p className="lesson-description">{lesson.description}</p>
                    <button
                      className={`completion-toggle ${isCompleted ? 'completed' : ''}`}
                      onClick={() => toggleLessonCompletion(selectedCourseSlug, index)}
                    >
                      {isCompleted ? '✓ Завершено' : '○ Завершить'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;