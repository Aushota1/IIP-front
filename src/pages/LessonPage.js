import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import FormulaBlock from '../components/FormulaBlock';
import CodeBlockHighlight from '../components/CodeBlockHighlight';
import { getCourseContent, completeLesson, getCourseProgress } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/scss/pages/_lesson-page.scss';

const LessonPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [courseContent, setCourseContent] = useState(null);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  useEffect(() => {
    fetchCourseContent();
    fetchUserProgress();
  }, [courseId]);

  useEffect(() => {
    // Автоматически выбираем первый урок при загрузке
    if (courseContent && !currentLessonId) {
      const firstModule = courseContent.modules[0];
      if (firstModule && firstModule.lessons.length > 0) {
        setCurrentLessonId(firstModule.lessons[0].id);
        setExpandedModules(new Set([firstModule.id]));
      }
    }
  }, [courseContent, currentLessonId]);

  const fetchCourseContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCourseContent(courseId);
      setCourseContent(data);
    } catch (err) {
      console.error('Error loading course content:', err);
      setError('Не удалось загрузить содержимое курса');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const progressData = await getCourseProgress();
      const courseProgress = progressData.find(p => p.course_id === parseInt(courseId));
      
      if (courseProgress && courseProgress.completed_lessons) {
        setCompletedLessons(new Set(courseProgress.completed_lessons));
        setProgress(courseProgress.progress_percent || 0);
      }
    } catch (err) {
      console.error('Error loading user progress:', err);
      // Не показываем ошибку пользователю, просто логируем
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLessonId || isMarkingComplete) return;

    setIsMarkingComplete(true);
    
    try {
      // Отправляем запрос на завершение урока
      // content_id в данном случае равен lesson_id
      const response = await completeLesson(parseInt(courseId), currentLessonId);
      
      // Обновляем локальное состояние
      const newCompletedLessons = new Set(completedLessons);
      newCompletedLessons.add(currentLessonId);
      setCompletedLessons(newCompletedLessons);
      
      // Обновляем прогресс
      if (response.progress_percent !== undefined) {
        setProgress(response.progress_percent);
      }

      // Переходим к следующему уроку
      goToNextLesson();
    } catch (err) {
      console.error('Error marking lesson as complete:', err);
      alert('Не удалось отметить урок как завершенный. Попробуйте еще раз.');
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const goToNextLesson = () => {
    if (!courseContent || !currentLessonId) return;

    // Находим текущий урок и следующий
    let foundCurrent = false;
    let nextLesson = null;

    for (const module of courseContent.modules) {
      for (const lesson of module.lessons) {
        if (foundCurrent) {
          nextLesson = lesson;
          break;
        }
        if (lesson.id === currentLessonId) {
          foundCurrent = true;
        }
      }
      if (nextLesson) break;
    }

    // Если есть следующий урок, переключаемся на него
    if (nextLesson) {
      selectLesson(nextLesson.id);
      // Прокручиваем к началу контента
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSectionComplete = (sectionId) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    const currentLesson = getCurrentLesson();
    if (currentLesson && currentLesson.sections) {
      const newProgress = (newCompleted.size / currentLesson.sections.length) * 100;
      setProgress(newProgress);
    }
  };

  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const selectLesson = (lessonId) => {
    setCurrentLessonId(lessonId);
    setCompletedSections(new Set());
    setProgress(0);
  };

  const getCurrentLesson = () => {
    if (!courseContent || !currentLessonId) return null;
    
    for (const module of courseContent.modules) {
      const lesson = module.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  const isLastLesson = () => {
    if (!courseContent || !currentLessonId) return true;

    const allLessons = courseContent.modules.flatMap(m => m.lessons);
    const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
    
    return currentIndex === allLessons.length - 1;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!courseContent) return <div className="error-message">Курс не найден</div>;

  const currentLesson = getCurrentLesson();

  // Если модулей или уроков нет
  if (!courseContent.modules || courseContent.modules.length === 0) {
    return (
      <div className="lesson-page">
        <SimpleHeader />
        <div className="lesson-container">
          <div className="empty-state">
            <h2>{courseContent.course_title}</h2>
            <p>Модули и уроки для этого курса пока не добавлены.</p>
            <p>Обратитесь к администратору для добавления учебных материалов.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-page">
      <SimpleHeader />
      
      <div className="lesson-container">
        {/* Боковая панель с содержанием */}
        <aside className="lesson-page-sidebar lesson-sidebar">
          <div className="course-info">
            <h3>{courseContent.course_title}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          
          <nav className="lesson-nav">
            <h4>Содержание курса</h4>
            <div className="modules-list">
              {courseContent.modules.map((module) => (
                <div key={module.id} className="module-item">
                  <div 
                    className="module-header"
                    onClick={() => toggleModule(module.id)}
                  >
                    <span className={`module-arrow ${expandedModules.has(module.id) ? 'expanded' : ''}`}>
                      ▶
                    </span>
                    <span className="module-title">{module.title}</span>
                  </div>
                  
                  {expandedModules.has(module.id) && (
                    <ul className="lessons-list">
                      {module.lessons.map((lesson) => (
                        <li 
                          key={lesson.id}
                          className={`lesson-item ${lesson.id === currentLessonId ? 'active' : ''} ${completedLessons.has(lesson.id) ? 'completed' : ''}`}
                          onClick={() => selectLesson(lesson.id)}
                        >
                          <span className={`completion-indicator ${completedLessons.has(lesson.id) ? 'completed' : ''}`}>
                            {completedLessons.has(lesson.id) && <span className="check-icon">✓</span>}
                          </span>
                          <span className="lesson-text">
                            {lesson.title}
                            {lesson.duration_minutes && (
                              <span className="lesson-duration"> ({lesson.duration_minutes} мин)</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Основной контент */}
        <main className="lesson-content">
          {currentLesson ? (
            <>
              <h1>{currentLesson.title}</h1>
              
              {currentLesson.sections && currentLesson.sections.length > 0 ? (
                <>
                  {currentLesson.sections.map((section) => (
                    <section 
                      key={section.id} 
                      className={`lesson-section lesson-section--${section.type}`}
                    >
                      {section.type === 'heading' && (
                        <>
                          {section.level === 1 && <h1>{section.content}</h1>}
                          {section.level === 2 && <h2>{section.content}</h2>}
                          {section.level === 3 && <h3>{section.content}</h3>}
                          
                          {/* Render section_in_blok for heading */}
                          {section.section_in_blok && section.section_in_blok.map((subSection, idx) => (
                            <div key={idx} className="sub-section">
                              {subSection.type === 'text' && <p>{subSection.content}</p>}
                            </div>
                          ))}
                        </>
                      )}
                      
                      {section.type === 'text' && (
                        <div className="text-content">
                          <p>{section.content}</p>
                        </div>
                      )}
                      
                      {section.type === 'formula' && (
                        <>
                          {section.title && <h3>{section.title}</h3>}
                          <FormulaBlock formula={section.content} />
                          
                          {/* Render section_in_blok for formula */}
                          {section.section_in_blok && section.section_in_blok.map((subSection, idx) => (
                            <div key={idx} className="sub-section">
                              {subSection.type === 'text' && <p>{subSection.content}</p>}
                            </div>
                          ))}
                        </>
                      )}
                      
                      {section.type === 'code' && (
                        <>
                          {section.title && <h3>{section.title}</h3>}
                          <CodeBlockHighlight 
                            code={section.content}
                            language={section.language || 'python'}
                          />
                          
                          {/* Render section_in_blok for code */}
                          {section.section_in_blok && section.section_in_blok.map((subSection, idx) => (
                            <div key={idx} className="sub-section">
                              {subSection.type === 'text' && <p>{subSection.content}</p>}
                            </div>
                          ))}
                        </>
                      )}
                      
                      {section.type === 'image' && (
                        <div className="image-content">
                          {section.title && <h3>{section.title}</h3>}
                          <img src={section.url} alt={section.alt || section.title || 'Изображение'} />
                          
                          {/* Render section_in_blok for image */}
                          {section.section_in_blok && section.section_in_blok.map((subSection, idx) => (
                            <div key={idx} className="sub-section">
                              {subSection.type === 'text' && <p>{subSection.content}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.type === 'video' && (
                        <div className="video-content">
                          {section.title && <h3>{section.title}</h3>}
                          <video controls src={section.url}>
                            Ваш браузер не поддерживает видео.
                          </video>
                          
                          {/* Render section_in_blok for video */}
                          {section.section_in_blok && section.section_in_blok.map((subSection, idx) => (
                            <div key={idx} className="sub-section">
                              {subSection.type === 'text' && <p>{subSection.content}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                  
                  {/* Кнопка "Далее" */}
                  <div className="lesson-navigation">
                    <button 
                      className="btn-next-lesson"
                      onClick={handleCompleteLesson}
                      disabled={isMarkingComplete}
                    >
                      {isMarkingComplete ? 'Сохранение...' : (isLastLesson() ? 'Завершить урок' : 'Далее')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="no-content">
                  <p>Содержимое урока пока не добавлено.</p>
                </div>
              )}
            </>
          ) : (
            <div className="no-lesson-selected">
              <p>Выберите урок из списка слева</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
