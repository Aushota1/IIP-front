import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../services/auth';
import {
  getCourseProgress,
  completeLesson,
  undoCompleteLesson,
  getActivityLogs,
  getActivityStreak,
  getCompletedTasksCount,
} from '../services/progress';
import { getAllCourses } from '../services/courses'; // Загружаем курсы с API
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';

const UserProfile = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userCourses, setUserCourses] = useState([]);
  const [allCourses, setAllCourses] = useState({}); // Все курсы с API
  const [activity, setActivity] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [streak, setStreak] = useState(0);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  const getDaysOnPlatform = (joinDateStr) => {
    if (!joinDateStr) return 0;
    const joinDate = new Date(joinDateStr);
    const now = new Date();
    const diffMs = now - joinDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchUserProfile();
        profile.lastVisit = profile.last_visit;
        profile.joinDate = profile.join_date;

        // Загружаем все курсы с API
        const coursesData = await getAllCourses();
        console.log('All courses from API:', coursesData);
        
        // Преобразуем в объект если это массив
        const coursesMap = Array.isArray(coursesData) 
          ? coursesData.reduce((acc, course) => {
              acc[course.slug] = course;
              return acc;
            }, {})
          : coursesData;
        
        setAllCourses(coursesMap);

        const progressList = await getCourseProgress();
        console.log('Progress list:', progressList);
        
        const activityData = await getActivityLogs();
        const streakData = await getActivityStreak();
        const completedCount = await getCompletedTasksCount();

        const enrolledCourses = progressList.map(p => {
          // Ищем курс по course_id в загруженных курсах
          const courseSlug = Object.keys(coursesMap).find(slug => coursesMap[slug].id === p.course_id);
          console.log(`Looking for course with id ${p.course_id}, found slug: ${courseSlug}`);
          
          const completedLessons = Array.isArray(p.completed_lessons)
            ? p.completed_lessons.map(id => Number(id))
            : p.completed_lessons ? [Number(p.completed_lessons)] : [];

          return {
            ...p,
            slug: courseSlug,
            progress: Number(p.progress_percent),
            completedLessons,
            lastActivity: p.last_activity,
          };
        });

        console.log('Enrolled courses:', enrolledCourses);

        setUserData(profile);
        setUserCourses(enrolledCourses);
        setActivity(activityData);
        setStreak(streakData.streak || 0);
        setCompletedTasksCount(completedCount.count || 0);

        if (enrolledCourses.length > 0) {
          setSelectedCourseSlug(enrolledCourses[0].slug);
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
        setError('Не удалось загрузить профиль');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  const getUserCourseProgress = (slug) => {
    if (!userCourses) return {};
    return userCourses.find(c => c.slug === slug) || {};
  };

  const toggleLessonCompletion = async (courseSlug, lessonId) => {
    const courseProgress = getUserCourseProgress(courseSlug);
    const completedLessons = Array.isArray(courseProgress.completedLessons) ? courseProgress.completedLessons : [];
    const course = allCourses[courseSlug];
    
    if (!course) {
      setError("Курс не найден.");
      return;
    }
    
    if (!course.program || !course.program.find(l => l.content_id === lessonId)) {
      setError("Этот урок не принадлежит выбранному курсу.");
      return;
    }
    setError(null);

    try {
      let updatedCompleted;
      if (completedLessons.includes(lessonId)) {
        await undoCompleteLesson(course.id, lessonId);
        updatedCompleted = completedLessons.filter(id => id !== lessonId);
      } else {
        await completeLesson(course.id, lessonId);
        updatedCompleted = [...completedLessons, lessonId];
      }

      // Обновляем прогресс курса локально
      const totalLessons = course.program.length || 1;
      const newProgress = Math.round((updatedCompleted.length / totalLessons) * 100);

      setUserCourses(prevCourses =>
        prevCourses.map(c => {
          if (c.slug === courseSlug) {
            return {
              ...c,
              completedLessons: updatedCompleted,
              progress: newProgress,
              lastActivity: new Date().toISOString(),
            };
          }
          return c;
        })
      );

      // **Загружаем актуальное количество решённых задач с сервера сразу после изменения**
      const completedCount = await getCompletedTasksCount();
      setCompletedTasksCount(completedCount.count || 0);

    } catch (err) {
      setError('Не удалось обновить прогресс. Попробуйте ещё раз.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!userData) return <div>Пользователь не найден</div>;

  const selectedCourse = selectedCourseSlug ? allCourses[selectedCourseSlug] : null;

  return (
    <div className="profile-page-wrapper">
      <div className="user-profile-layout">
        <Sidebar />

        <div className="profile-container">
        {error && <div className="error-message">{error}</div>}

        <header className="profile-header">
          <h1>Личный кабинет</h1>
          <div className="time-stats">
            <span>На платформе: {getDaysOnPlatform(userData.joinDate)} дней</span>
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
              <span className="stat-number">{streak}</span>
              <span className="stat-label">Дней подряд</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">{completedTasksCount}</span>
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
            {userCourses.map(({ slug, progress, course_id }) => {
              const course = allCourses[slug];
              if (!course) {
                console.warn(`Course not found for slug: ${slug}, course_id: ${course_id}`);
                return null;
              }

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

            {selectedCourse.program && selectedCourse.program.length > 0 ? (
              <div className="course-program">
                <h4>Программа курса:</h4>
                <ul>
                  {selectedCourse.program.map((lesson) => {
                    const courseProgress = getUserCourseProgress(selectedCourseSlug);
                    const completedLessons = Array.isArray(courseProgress.completedLessons) ? courseProgress.completedLessons : [];

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
            ) : (
              <div className="no-program">
                <p>Программа курса пока не добавлена. Обратитесь к администратору для добавления уроков.</p>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
