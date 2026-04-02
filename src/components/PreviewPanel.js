import React from 'react';
import FormulaBlock from './FormulaBlock';
import CodeBlockHighlight from './CodeBlockHighlight';
import ErrorBoundary from './ErrorBoundary';
import '../styles/scss/components/_preview-panel.scss';

/**
 * PreviewPanelContent - Internal component for rendering preview content
 */
const PreviewPanelContent = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return (
      <div className="preview-content">
        <p className="empty-message">Нет контента для предварительного просмотра</p>
      </div>
    );
  }

  return (
    <div className="preview-content">
      {sections.map((section, index) => (
        <div key={section.id || index} className="preview-section">
          {section.title && <h3>{section.title}</h3>}
          
          {section.type === 'text' && (
            <div className="text-content">
              <p>{section.content}</p>
            </div>
          )}
          
          {section.type === 'formula' && (
            <div className="formula-content">
              <FormulaBlock formula={section.content} />
            </div>
          )}
          
          {section.type === 'code' && (
            <div className="code-content">
              <CodeBlockHighlight 
                code={section.content}
                language={section.language || 'javascript'}
              />
            </div>
          )}
          
          {section.type === 'image' && (
            <div className="image-content">
              <img 
                src={section.url} 
                alt={section.alt || 'Image'} 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="image-error" style={{ display: 'none' }}>
                <p>Не удалось загрузить изображение: {section.url}</p>
              </div>
            </div>
          )}
          
          {section.type === 'video' && (
            <div className="video-content">
              {section.url && section.url.includes('youtube.com') ? (
                <iframe
                  width="100%"
                  height="400"
                  src={section.url.replace('watch?v=', 'embed/')}
                  title={section.title || 'Video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="video-link">
                  <a href={section.url} target="_blank" rel="noopener noreferrer">
                    {section.title || 'Открыть видео'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * PreviewPanel - компонент для предварительного просмотра урока
 * Использует те же компоненты рендеринга что и LessonPage для консистентности
 * Обернут в ErrorBoundary для обработки ошибок рендеринга
 */
const PreviewPanel = ({ sections, onClose }) => {
  // Custom fallback UI that shows raw JSON when rendering fails
  const errorFallback = (
    <div className="preview-error-fallback">
      <div className="preview-error-fallback__header">
        <h3>Ошибка отображения предварительного просмотра</h3>
        <p>Не удалось отобразить контент урока. Ниже представлены данные в формате JSON:</p>
      </div>
      <div className="preview-error-fallback__json">
        <pre>{JSON.stringify(sections, null, 2)}</pre>
      </div>
    </div>
  );

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h2>Предварительный просмотр</h2>
        <button className="close-button" onClick={onClose} aria-label="Закрыть">
          ✕
        </button>
      </div>
      
      <ErrorBoundary fallback={errorFallback}>
        <PreviewPanelContent sections={sections} />
      </ErrorBoundary>
    </div>
  );
};

export default PreviewPanel;
