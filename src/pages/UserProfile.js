import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserProfile, updateCourseProgress } from '../api';
import { courses } from './courses'; // Локальный справочник курсов
import './UserProfile.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);

  useEffect(() => {
    fetchUserProfile()
      .then(data => {
        setUserData(data);
        if (data.enrolledCourses && data.enrolledCourses.length > 0) {
          setSelectedCourseSlug(data.enrolledCourses[0].slug);
        }
      })
      .catch(error => {
        console.error("Ошибка загрузки профиля:", error);
      });
  }, []);

  if (!userData) return <div>Загрузка профиля...</div>;

  const token = localStorage.getItem('token');
  const selectedCourse = selectedCourseSlug ? courses[selectedCourseSlug] : null;

  const getUserCourseProgress = (slug) => {
    if (!userData.enrolledCourses) return {};
    return userData.enrolledCourses.find(c => c.slug === slug) || {};
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const options = { day: 'numeric', month: 'long' };
    return new Date(dateStr).toLocaleDateString('ru-RU', options);
  };

  const toggleLessonCompletion = async (courseSlug, lessonIndex) => {
    if (!userData) return;

    const courseProgress = userData.enrolledCourses.find(c => c.slug === courseSlug);
    const completedLessonsRaw = courseProgress?.completedLessons;
    const completedLessons = Array.isArray(completedLessonsRaw)
      ? completedLessonsRaw
      : (typeof completedLessonsRaw === 'number' ? [completedLessonsRaw] : []);

    const isCompleted = completedLessons.includes(lessonIndex);

    // Формируем новый массив завершённых уроков
    const updatedCompleted = isCompleted
      ? completedLessons.filter(i => i !== lessonIndex)
      : [...completedLessons, lessonIndex];

    const totalLessons = courses[courseSlug]?.program?.length || 1;
    const newProgress = Math.round((updatedCompleted.length / totalLessons) * 100);

    console.log(`Курс: ${courseSlug}`);
    console.log(`Обновлённый список завершённых уроков:`, updatedCompleted);
    console.log(`Рассчитанный прогресс: ${newProgress}%`);

    // Обновляем состояние с новыми данными
    setUserData(prev => {
      if (!prev || !prev.enrolledCourses) return prev;

      const updatedCourses = prev.enrolledCourses.map(course => {
        if (course.slug === courseSlug) {
          return {
            ...course,
            completedLessons: updatedCompleted,
            progress: newProgress,
            lastActivity: new Date().toISOString().split('T')[0],
          };
        }
        return course;
      });

      return {
        ...prev,
        enrolledCourses: updatedCourses,
      };
    });

    // Отправляем обновлённый прогресс на сервер
    try {
      await updateCourseProgress(token, courseSlug, updatedCompleted);
    } catch (error) {
      console.error("Ошибка обновления прогресса:", error);
    }
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
          <div className="avatar">{userData.name.charAt(0)}</div>
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
          {Object.entries(userData.activity || {}).map(([date, activity]) => (
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
      {selectedDate && userData.activity && userData.activity[selectedDate] && (
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
          {userData.enrolledCourses && userData.enrolledCourses.map(({ slug, progress }) => {
            const course = courses[slug];
            if (!course) return null;

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
            <Link to={`/courses/${selectedCourseSlug}`} className="course-link">
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
              {selectedCourse.program && selectedCourse.program.map((lesson, index) => {
                const courseProgress = getUserCourseProgress(selectedCourseSlug);
                const completedLessonsRaw = courseProgress.completedLessons;
                const completedLessons = Array.isArray(completedLessonsRaw)
                  ? completedLessonsRaw
                  : (typeof completedLessonsRaw === 'number' ? [completedLessonsRaw] : []);

                const isCompleted = completedLessons.includes(index);

                return (
                  <li key={index} className={isCompleted ? 'completed' : ''}>
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
