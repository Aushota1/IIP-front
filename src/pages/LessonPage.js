import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import FormulaBlock from '../components/FormulaBlock';
import CodeBlockHighlight from '../components/CodeBlockHighlight';
import '../styles/scss/pages/_lesson-page.scss';

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [expandedModules, setExpandedModules] = useState(new Set([1])); // Первый модуль открыт по умолчанию

  useEffect(() => {
    // Загрузка данных урока
    fetchLessonData();
  }, [courseId, lessonId]);

  const fetchLessonData = async () => {
    // TODO: Заменить на реальный API
    const mockLesson = {
      id: lessonId,
      title: 'Введение в линейные модели',
      sections: [
        {
          id: 1,
          type: 'text',
          title: 'Математическое описание',
          content: 'Линейные модели являются одним из основных инструментов машинного обучения. Они используются для задач регрессии и классификации.'
        },
        {
          id: 2,
          type: 'formula',
          title: 'Линейная функция',
          content: 'y = w_1x_1 + w_2x_2 + \\ldots + w_nx_n + b'
        },
        {
          id: 3,
          type: 'text',
          title: 'Градиентный спуск',
          content: 'Для обучения линейных моделей используется метод градиентного спуска, который итеративно минимизирует функцию потерь.'
        },
        {
          id: 4,
          type: 'formula',
          content: '\\nabla_w L = \\frac{2}{N} X^T(Xw - y)'
        },
        {
          id: 5,
          type: 'code',
          language: 'python',
          title: 'Пример реализации',
          content: `import numpy as np

def linear_model(X, w, b):
    """
    Линейная модель
    X: матрица признаков (N x D)
    w: веса (D,)
    b: смещение (скаляр)
    """
    return np.dot(X, w) + b

def gradient_descent(X, y, learning_rate=0.01, epochs=100):
    n_samples, n_features = X.shape
    w = np.zeros(n_features)
    b = 0
    
    for epoch in range(epochs):
        # Предсказание
        y_pred = linear_model(X, w, b)
        
        # Градиенты
        dw = (2/n_samples) * np.dot(X.T, (y_pred - y))
        db = (2/n_samples) * np.sum(y_pred - y)
        
        # Обновление весов
        w -= learning_rate * dw
        b -= learning_rate * db
    
    return w, b`
        }
      ]
    };

    const mockCourse = {
      id: courseId,
      title: 'Машинное обучение',
      modules: [
        {
          id: 1,
          title: 'Модуль 1: Основы',
          lessons: [
            { id: '1', title: 'Введение в ML', completed: false },
            { id: '2', title: 'Линейные модели', completed: false },
            { id: '3', title: 'Градиентный спуск', completed: false }
          ]
        },
        {
          id: 2,
          title: 'Модуль 2: Классификация',
          lessons: [
            { id: '4', title: 'Логистическая регрессия', completed: false },
            { id: '5', title: 'SVM', completed: false },
            { id: '6', title: 'Метрики качества', completed: false }
          ]
        },
        {
          id: 3,
          title: 'Модуль 3: Регрессия',
          lessons: [
            { id: '7', title: 'Линейная регрессия', completed: false },
            { id: '8', title: 'Регуляризация', completed: false }
          ]
        }
      ]
    };

    setLesson(mockLesson);
    setCourse(mockCourse);
  };

  const handleSectionComplete = (sectionId) => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(sectionId);
    setCompletedSections(newCompleted);
    
    const newProgress = (newCompleted.size / lesson.sections.length) * 100;
    setProgress(newProgress);
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

  if (!lesson || !course) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="lesson-page">
      <SimpleHeader />
      
      <div className="lesson-container">
        {/* Боковая панель с содержанием */}
        <aside className="lesson-sidebar">
          <div className="course-info">
            <h3>{course.title}</h3>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          
          <nav className="lesson-nav">
            <h4>Содержание курса</h4>
            <div className="modules-list">
              {course.modules.map((module) => (
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
                      {module.lessons.map((l) => (
                        <li 
                          key={l.id}
                          className={`lesson-item ${l.id === lessonId ? 'active' : ''} ${l.completed ? 'completed' : ''}`}
                          onClick={() => navigate(`/courses/${courseId}/lessons/${l.id}`)}
                        >
                          {l.completed && <span className="check-icon">✓</span>}
                          {l.title}
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
          <h1>{lesson.title}</h1>
          
          {lesson.sections.map((section) => (
            <section 
              key={section.id} 
              className={`lesson-section ${completedSections.has(section.id) ? 'completed' : ''}`}
            >
              {section.title && <h2>{section.title}</h2>}
              
              {section.type === 'text' && (
                <div className="text-content">
                  <p>{section.content}</p>
                </div>
              )}
              
              {section.type === 'formula' && (
                <FormulaBlock formula={section.content} />
              )}
              
              {section.type === 'code' && (
                <CodeBlockHighlight 
                  code={section.content}
                  language={section.language}
                />
              )}
              
              <button 
                className="mark-complete"
                onClick={() => handleSectionComplete(section.id)}
                disabled={completedSections.has(section.id)}
              >
                {completedSections.has(section.id) ? '✓ Прочитано' : 'Отметить как прочитанное'}
              </button>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
