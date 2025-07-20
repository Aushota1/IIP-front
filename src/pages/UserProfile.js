import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserProfile, getCourseProgress, completeLesson } from '../api';
import { courses } from './courses';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';
import '../components/Sidebar.css';
import './UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userCourses, setUserCourses] = useState([]); // Курсы с прогрессом и completedLessons
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  // Формат даты для отображения в интерфейсе
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[UserProfile] Нет токена, редирект на /login');
      navigate('/login');
      return;
    }

    async function loadProfileAndProgress() {
      setLoadingProfile(true);
      setError(null);
      try {
        console.log('[UserProfile] Запрос профиля пользователя...');
        const profile = await fetchUserProfile();
        console.log('[UserProfile] Профиль получен:', profile);

        console.log('[UserProfile] Запрос прогресса по курсам...');
        const progressList = await getCourseProgress();
        console.log('[UserProfile] Прогресс получен:', progressList);

        // Сопоставляем course_id из прогресса с slug из courses.js
        const enrolledCourses = progressList.map(p => {
          const courseSlug = Object.keys(courses).find(slug => courses[slug].id === p.course_id);
          if (!courseSlug) {
            console.warn(`[UserProfile] Для course_id=${p.course_id} не найден slug курса`);
          }
          return {
            ...p,
            slug: courseSlug,
            progress: Number(p.progress_percent),
            completedLessons: p.completed_lessons || [],
            lastActivity: p.last_activity,
          };
        });

        console.log('[UserProfile] Обработанные курсы с прогрессом:', enrolledCourses);

        setUserData(profile);
        setUserCourses(enrolledCourses);
        if (enrolledCourses.length > 0) {
          setSelectedCourseSlug(enrolledCourses[0].slug);
          console.log('[UserProfile] Установлен выбранный курс:', enrolledCourses[0].slug);
        }
      } catch (err) {
        console.error('[UserProfile] Ошибка загрузки профиля или прогресса:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfileAndProgress();
  }, [navigate]);

  if (loadingProfile) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!userData) return <div>Пользователь не найден</div>;

  const selectedCourse = selectedCourseSlug ? courses[selectedCourseSlug] : null;

  // Получение прогресса пользователя по курсу по slug
  const getUserCourseProgress = (slug) => {
    if (!userCourses) return {};
    return userCourses.find(c => c.slug === slug) || {};
  };

  // Обработчик для отметки урока завершенным
  const toggleLessonCompletion = async (courseSlug, contentId) => {
    if (!userData) {
      console.warn('[UserProfile] Пользователь не загружен, невозможно отметить урок');
      return;
    }

    console.log(`[UserProfile] Попытка отметить урок завершённым: курс=${courseSlug}, contentId=${contentId}`);

    const courseProgress = getUserCourseProgress(courseSlug);
    const completedLessonsRaw = courseProgress.completedLessons;

    const completedLessons = Array.isArray(completedLessonsRaw)
      ? completedLessonsRaw
      : (typeof completedLessonsRaw === 'number' ? [completedLessonsRaw] : []);

    const isCompleted = completedLessons.includes(contentId);
    if (isCompleted) {
      console.log(`[UserProfile] Урок contentId=${contentId} уже отмечен как завершённый`);
      return; // Снятие отметки не реализовано
    }

    const prevUserCourses = [...userCourses];
    setError(null);

    try {
      console.log(`[UserProfile] Отправка запроса completeLesson: courseId=${courses[courseSlug].id}, contentId=${contentId}`);
      await completeLesson(courses[courseSlug].id, contentId);
      console.log('[UserProfile] Запрос completeLesson успешно выполнен');

      // Локальное обновление UI
      const updatedCompleted = [...completedLessons, contentId];
      const totalLessons = courses[courseSlug]?.program?.length || 1;
      const newProgress = Math.round((updatedCompleted.length / totalLessons) * 100);

      setUserCourses(prevCourses =>
        prevCourses.map(course => {
          if (course.slug === courseSlug) {
            console.log(`[UserProfile] Обновляем прогресс курса ${courseSlug}: новый прогресс ${newProgress}%, завершено уроков: ${updatedCompleted.length}`);
            return {
              ...course,
              completedLessons: updatedCompleted,
              progress: newProgress,
              lastActivity: new Date().toISOString(),
            };
          }
          return course;
        })
      );
    } catch (err) {
      console.error('[UserProfile] Ошибка обновления прогресса:', err);
      setError('Не удалось обновить прогресс. Попробуйте ещё раз.');
      setUserCourses(prevUserCourses); // Откат изменений
    }
  };

  const stats = userData.stats || { streak: 0, completedTasks: 0, totalTime: "0ч" };
  const activity = userData.activity || {};

  return (
    <div className="user-profile-layout">
      <Sidebar />

      <div className="profile-container">
        {error && <div className="error-message">{error}</div>}

        <header className="profile-header">
          <h1>Личный кабинет</h1>
          <div className="time-stats">
            <span>На платформе: {stats.totalTime}</span>
            <span>Последний визит: {formatDate(userData.lastVisit)}</span>
          </div>
        </header>

        <section className="user-info-section">
          <div className="avatar-container">
            <div className="avatar">{userData.name ? userData.name.charAt(0).toUpperCase() : '?'}</div>
            <div className="user-meta">
              <h2>{userData.name}</h2>
              <p>{userData.email}</p>
              <p>Участник с {formatDate(userData.joinDate)}</p>
            </div>
          </div>

          <div className="github-like-stats">
            <div className="stat-box">
              <span className="stat-number">{stats.streak}</span>
              <span className="stat-label">Дней подряд</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{stats.completedTasks}</span>
              <span className="stat-label">Решено задач</span>
            </div>
          </div>
        </section>

        <section className="activity-section">
          <h3>Активность</h3>
          <div className="activity-calendar">
            {Object.entries(activity).map(([date, day]) => (
              <div
                key={date}
                className={`activity-day ${day.count > 2 ? 'high' : 'low'}`}
                title={`${date}: ${day.details?.join(', ')}`}
                onClick={() => setSelectedDate(date)}
              >
                {new Date(date).getDate()}
              </div>
            ))}
          </div>
        </section>

        {selectedDate && activity[selectedDate] && (
          <div className="activity-details">
            <h4>{formatDate(selectedDate)}</h4>
            <ul>
              {activity[selectedDate].details && activity[selectedDate].details.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <section className="courses-section">
          <h3>Мои курсы</h3>
          <div className="courses-grid">
            {userCourses && userCourses.map(({ slug, progress }) => {
              const course = courses[slug];
              if (!course) {
                console.warn(`[UserProfile] Для slug=${slug} нет данных курса в courses.js`);
                return null;
              }

              return (
                <div
                  key={slug}
                  className={`course-card ${selectedCourseSlug === slug ? 'active' : ''}`}
                  onClick={() => {
                    console.log(`[UserProfile] Курс выбран: ${slug}`);
                    setSelectedCourseSlug(slug);
                  }}
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
                      />
                    </div>
                    <span>{progress}%</span>
                  </div>
                  <div className="course-meta">
                    <span>Последняя активность: {formatDate(userCourses.find(c => c.slug === slug)?.lastActivity)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
                {selectedCourse.program && selectedCourse.program.map((lesson) => {
                  const courseProgress = getUserCourseProgress(selectedCourseSlug);
                  const completedLessonsRaw = courseProgress.completedLessons;
                  const completedLessons = Array.isArray(completedLessonsRaw)
                    ? completedLessonsRaw
                    : (typeof completedLessonsRaw === 'number' ? [completedLessonsRaw] : []);

                  const isCompleted = completedLessons.includes(lesson.content_id);

                  return (
                    <li key={lesson.content_id} className={isCompleted ? 'completed' : ''}>
                      <div className="lesson-info">
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </div>
                      <p className="lesson-description">{lesson.description}</p>
                      <button
                        className={`completion-toggle ${isCompleted ? 'completed' : ''}`}
                        onClick={() => toggleLessonCompletion(selectedCourseSlug, lesson.content_id)}
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
    </div>
  );
};

export default UserProfile;
