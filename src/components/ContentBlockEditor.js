import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import ImageBlockEditor from './ImageBlockEditor';
import VideoBlockEditor from './VideoBlockEditor';

/**
 * ContentBlockEditor - Editor for creating/editing content blocks
 * 
 * Supports block types:
 * - formula: LaTeX mathematical formulas
 * - code: Code snippets with language selection
 * - image: Image URL with preview
 * - video: Video URL
 * - table: Table data (future implementation)
 * 
 * @param {Object} props
 * @param {Object|null} props.block - Existing block to edit (null for new block)
 * @param {Function} props.onSave - Callback when block is saved
 * @param {Function} props.onCancel - Callback when editing is cancelled
 * @param {string} props.initialType - Initial block type for new blocks
 */
const ContentBlockEditor = ({ block, onSave, onCancel, initialType = 'code' }) => {
  const [blockType, setBlockType] = useState(block?.type || initialType);
  const [title, setTitle] = useState(block?.title || '');
  const [content, setContent] = useState(block?.content || '');
  const [language, setLanguage] = useState(block?.language || 'javascript');
  const [explanation, setExplanation] = useState(block?.explanation || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (block) {
      setBlockType(block.type);
      setTitle(block.title || '');
      setContent(block.content || '');
      setLanguage(block.language || 'javascript');
      setExplanation(block.explanation || '');
    }
  }, [block]);

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} - True if valid
   */
  const isValidUrl = (url) => {
    if (!url || !url.trim()) return false;
    
    try {
      const urlObj = new URL(url);
      // Check for valid protocol (http or https)
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }
      // Check for valid hostname
      if (!urlObj.hostname || urlObj.hostname.length === 0) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Validate image URL format
   * @param {string} url - Image URL to validate
   * @returns {string|null} - Error message or null if valid
   */
  const validateImageUrl = (url) => {
    if (!isValidUrl(url)) {
      return 'Введите корректный URL (должен начинаться с http:// или https://)';
    }
    
    // Check if URL ends with common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
    const urlLower = url.toLowerCase();
    const hasImageExtension = imageExtensions.some(ext => urlLower.includes(ext));
    
    if (!hasImageExtension) {
      return 'URL должен указывать на изображение (.jpg, .png, .gif, .webp, .svg)';
    }
    
    return null;
  };

  /**
   * Validate video URL format
   * @param {string} url - Video URL to validate
   * @returns {string|null} - Error message or null if valid
   */
  const validateVideoUrl = (url) => {
    if (!isValidUrl(url)) {
      return 'Введите корректный URL (должен начинаться с http:// или https://)';
    }
    
    // Check for supported video platforms or direct video links
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
    const isVimeo = url.includes('vimeo.com');
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const hasVideoExtension = videoExtensions.some(ext => url.toLowerCase().includes(ext));
    
    if (!isYouTube && !isVimeo && !hasVideoExtension) {
      return 'URL должен быть ссылкой на YouTube, Vimeo или видео файл (.mp4, .webm, .ogg)';
    }
    
    return null;
  };

  /**
   * Validate block data
   * @returns {boolean} - True if valid
   */
  const validate = () => {
    const newErrors = {};

    // Title is required
    if (!title.trim()) {
      newErrors.title = 'Название блока обязательно';
    }

    // Content is required
    if (!content.trim()) {
      newErrors.content = 'Содержимое блока обязательно';
    }

    // Type-specific validation
    if (blockType === 'image') {
      const imageError = validateImageUrl(content);
      if (imageError) {
        newErrors.content = imageError;
      }
    }

    if (blockType === 'video') {
      const videoError = validateVideoUrl(content);
      if (videoError) {
        newErrors.content = videoError;
      }
    }

    if (blockType === 'code' && !language) {
      newErrors.language = 'Выберите язык программирования';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle save button click
   */
  const handleSave = () => {
    if (!validate()) {
      return;
    }

    const blockData = {
      id: block?.id || `block-${Date.now()}`,
      type: blockType,
      title: title.trim(),
      content: content.trim(),
      explanation: explanation.trim() || undefined,
    };

    if (blockType === 'code') {
      blockData.language = language;
    }

    onSave(blockData);
  };

  /**
   * Handle block type change
   */
  const handleTypeChange = (newType) => {
    setBlockType(newType);
    setErrors({});
  };

  /**
   * Render content input based on block type
   */
  const renderContentInput = () => {
    switch (blockType) {
      case 'formula':
        return (
          <div className="form-group">
            <label htmlFor="content">
              Формула (LaTeX) <span className="required">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Например: E = mc^2 или \frac{a}{b}"
              rows={6}
              className={errors.content ? 'error' : ''}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <small className="help-text">
              Используйте LaTeX синтаксис. Примеры: x^2, \frac{'{a}{b}'}, \sqrt{'{x}'}
            </small>
          </div>
        );

      case 'code':
        return (
          <>
            <div className="form-group">
              <label htmlFor="language">
                Язык программирования <span className="required">*</span>
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={errors.language ? 'error' : ''}
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
              {errors.language && <span className="error-message">{errors.language}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="content">
                Код <span className="required">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Введите код..."
                rows={10}
                className={`code-textarea ${errors.content ? 'error' : ''}`}
              />
              {errors.content && <span className="error-message">{errors.content}</span>}
            </div>
          </>
        );

      case 'image':
        return (
          <ImageBlockEditor
            url={content}
            onChange={setContent}
            error={errors.content}
          />
        );

      case 'video':
        return (
          <VideoBlockEditor
            url={content}
            onChange={setContent}
            error={errors.content}
          />
        );

      case 'table':
        return (
          <div className="form-group">
            <label htmlFor="content">
              Данные таблицы <span className="required">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите данные таблицы..."
              rows={8}
              className={errors.content ? 'error' : ''}
            />
            {errors.content && <span className="error-message">{errors.content}</span>}
            <small className="help-text">
              Функциональность таблиц будет добавлена в будущем
            </small>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="content-block-editor-overlay">
      <div className="content-block-editor">
        <div className="editor-header">
          <h3>{block ? 'Редактировать блок' : 'Создать блок'}</h3>
          <button className="close-button" onClick={onCancel} type="button">
            <MdClose />
          </button>
        </div>

        <div className="editor-body">
          {/* Block Type Selection */}
          <div className="form-group">
            <label>
              Тип блока <span className="required">*</span>
            </label>
            <div className="block-type-selector">
              <button
                type="button"
                className={`type-button ${blockType === 'formula' ? 'active' : ''}`}
                onClick={() => handleTypeChange('formula')}
                data-type="formula"
              >
                Формула
              </button>
              <button
                type="button"
                className={`type-button ${blockType === 'code' ? 'active' : ''}`}
                onClick={() => handleTypeChange('code')}
                data-type="code"
              >
                Код
              </button>
              <button
                type="button"
                className={`type-button ${blockType === 'image' ? 'active' : ''}`}
                onClick={() => handleTypeChange('image')}
                data-type="image"
              >
                Изображение
              </button>
              <button
                type="button"
                className={`type-button ${blockType === 'video' ? 'active' : ''}`}
                onClick={() => handleTypeChange('video')}
                data-type="video"
              >
                Видео
              </button>
              <button
                type="button"
                className={`type-button ${blockType === 'table' ? 'active' : ''}`}
                onClick={() => handleTypeChange('table')}
                data-type="table"
              >
                Таблица
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title">
              Название блока <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название блока"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Content Input (type-specific) */}
          {renderContentInput()}

          {/* Explanation Input (optional) */}
          <div className="form-group">
            <label htmlFor="explanation">Пояснение (опционально)</label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Добавьте пояснение к блоку..."
              rows={3}
            />
          </div>
        </div>

        <div className="editor-footer">
          <button className="btn-secondary" onClick={onCancel} type="button">
            Отмена
          </button>
          <button className="btn-primary" onClick={handleSave} type="button">
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentBlockEditor;
