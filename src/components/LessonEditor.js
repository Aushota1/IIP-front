import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import RichTextEditor from './RichTextEditor';
import PreviewPanel from './PreviewPanel';
import { jsonParser } from '../services/jsonParser';
import { prettyPrinter } from '../services/prettyPrinter';
import { curriculumAPI } from '../services/curriculum';
import { draftManager } from '../services/draftManager';
import { useNotification } from './NotificationContainer';
import { MdClose, MdCheck, MdVisibility } from 'react-icons/md';

/**
 * LessonEditor - Component for creating and editing lessons
 * 
 * Features:
 * - Rich text editing with Draft.js
 * - Content block insertion (formula, code, image, video)
 * - JSON parsing and validation
 * - API integration for creating/updating lessons
 * - Error handling and validation feedback
 * 
 * @param {Object} props
 * @param {number} props.courseId - Course ID
 * @param {number} props.moduleId - Module ID
 * @param {number|null} props.lessonId - Lesson ID (null for new lesson)
 * @param {Function} props.onSave - Callback when lesson is saved
 * @param {Function} props.onCancel - Callback when editing is cancelled
 */
const LessonEditor = ({ courseId, moduleId, lessonId = null, onSave, onCancel }) => {
  // Notification system
  const { showSuccess, showError } = useNotification();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [contentBlocks, setContentBlocks] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Draft restoration state
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [pendingDraft, setPendingDraft] = useState(null);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewSections, setPreviewSections] = useState([]);

  /**
   * Load lesson data if editing existing lesson
   */
  useEffect(() => {
    if (lessonId) {
      loadLesson();
    } else {
      // Check for draft when creating new lesson
      checkForDraft();
    }
  }, [lessonId]);

  /**
   * Start auto-save when component mounts
   * Stop auto-save when component unmounts
   */
  useEffect(() => {
    // Start auto-save
    draftManager.startAutoSave(lessonId, courseId, moduleId, getEditorData);

    // Cleanup: stop auto-save on unmount
    return () => {
      draftManager.stopAutoSave();
    };
  }, [lessonId, courseId, moduleId]);

  /**
   * Get current editor data for auto-save
   * @returns {Object} Current editor data
   */
  const getEditorData = () => {
    const contentState = editorState.getCurrentContent();
    const editorContent = JSON.stringify(convertToRaw(contentState));

    return {
      title,
      description,
      duration: durationMinutes,
      editorContent,
      contentBlocks
    };
  };

  /**
   * Check for existing draft and show restoration dialog
   */
  const checkForDraft = () => {
    const draft = draftManager.loadDraft();

    if (draft && draftManager.hasDraft(courseId, moduleId, lessonId)) {
      setShowDraftDialog(true);
      setPendingDraft(draft);
    }
  };

  /**
   * Restore draft data to editor
   */
  const handleRestoreDraft = () => {
    if (pendingDraft) {
      try {
        const contentState = convertFromRaw(JSON.parse(pendingDraft.editorContent));
        const newEditorState = EditorState.createWithContent(contentState);

        setTitle(pendingDraft.title);
        setDescription(pendingDraft.description || '');
        setDurationMinutes(pendingDraft.duration_minutes);
        setEditorState(newEditorState);
        setContentBlocks(pendingDraft.contentBlocks);

        setShowDraftDialog(false);
        setPendingDraft(null);
      } catch (error) {
        console.error('Failed to restore draft:', error);
        alert('Ошибка восстановления черновика');
        handleDiscardDraft();
      }
    }
  };

  /**
   * Discard draft and continue with empty editor
   */
  const handleDiscardDraft = () => {
    draftManager.clearDraft();
    setShowDraftDialog(false);
    setPendingDraft(null);
  };

  /**
   * Load lesson from API
   */
  const loadLesson = async () => {
    setLoading(true);
    try {
      const lesson = await curriculumAPI.getLesson(lessonId);
      
      // Set basic fields
      setTitle(lesson.title || '');
      setDescription(lesson.description || '');
      setDurationMinutes(lesson.duration_minutes || 30);
      
      // Use PrettyPrinter to convert sections back to editor format
      const { editorState: newEditorState, contentBlocks: newContentBlocks } = 
        prettyPrinter.format(lesson.sections);
      setEditorState(newEditorState);
      setContentBlocks(newContentBlocks);
      
    } catch (error) {
      console.error('Failed to load lesson:', error);
      alert('Ошибка загрузки урока: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate form fields
   * @returns {boolean} True if valid
   */
  const validateForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Название урока обязательно';
    }

    if (!durationMinutes || durationMinutes <= 0) {
      errors.duration = 'Длительность должна быть больше 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle confirm button click
   */
  const handleConfirm = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Reset validation errors
    setValidationErrors([]);

    // Parse editor content to JSON
    let sections;
    try {
      jsonParser.resetCounter();
      sections = jsonParser.parse(editorState, contentBlocks);
    } catch (error) {
      console.error('Failed to parse lesson content:', error);
      alert('Ошибка парсинга контента: ' + error.message);
      return;
    }

    // Validate sections
    const validationResult = jsonParser.validate(sections);
    
    if (!validationResult || !validationResult.valid) {
      setValidationErrors(validationResult?.errors || [{ message: 'Validation failed' }]);
      return;
    }

    // Prepare lesson data
    const lessonData = {
      title: title.trim(),
      description: description.trim(),
      duration_minutes: parseInt(durationMinutes, 10),
      sections: sections,
    };

    // Log the data BEFORE sending
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║           LESSON DATA TO BE SENT TO BACKEND               ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('Lesson ID:', lessonId || 'NEW LESSON');
    console.log('Course ID:', courseId);
    console.log('Module ID:', moduleId);
    console.log('\n📦 FULL JSON PAYLOAD:');
    console.log(JSON.stringify(lessonData, null, 2));
    console.log('\n📊 SECTIONS COUNT:', sections.length);
    console.log('📝 SECTIONS BREAKDOWN:');
    sections.forEach((section, index) => {
      console.log(`  ${index + 1}. Type: ${section.type}, Content length: ${section.content?.length || 0}`);
    });
    console.log('════════════════════════════════════════════════════════════\n');

    // Save JSON to file (auto-download)
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `lesson_${lessonId || 'new'}_${timestamp}.json`;
      const jsonString = JSON.stringify(lessonData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      console.log('💾 JSON saved to:', filename);
    } catch (error) {
      console.error('Failed to save JSON file:', error);
    }

    // Add order_index for new lessons
    if (!lessonId) {
      // TODO: Calculate order_index based on existing lessons
      lessonData.order_index = 1;
    }

    // Save lesson
    setSaving(true);
    try {
      let savedLesson;
      
      console.log('=== SAVING LESSON ===');
      console.log('Lesson ID:', lessonId);
      console.log('Course ID:', courseId);
      console.log('Module ID:', moduleId);
      console.log('Lesson Data being sent to backend:');
      console.log(JSON.stringify(lessonData, null, 2));
      console.log('===================');
      
      if (lessonId) {
        // Update existing lesson
        savedLesson = await curriculumAPI.updateLesson(lessonId, lessonData);
        console.log('✅ Lesson updated successfully:', savedLesson);
        showSuccess('Урок успешно обновлен!');
      } else {
        // Create new lesson
        savedLesson = await curriculumAPI.createLesson(courseId, moduleId, lessonData);
        console.log('✅ Lesson created successfully:', savedLesson);
        showSuccess('Урок успешно создан!');
      }

      // Clear draft after successful submission
      draftManager.clearDraft();

      // Call onSave callback
      if (onSave) {
        onSave(savedLesson);
      }
    } catch (error) {
      console.error('Failed to save lesson:', error);
      
      // Handle validation errors from API
      if (error.status === 422 && error.details) {
        showError('Ошибка валидации: ' + JSON.stringify(error.details));
      } else {
        showError('Ошибка сохранения урока: ' + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  /**
   * Handle editor state change
   */
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  /**
   * Handle content blocks change
   */
  const handleContentBlocksChange = (newContentBlocks) => {
    setContentBlocks(newContentBlocks);
  };

  /**
   * Handle preview button click
   */
  const handlePreview = () => {
    // Parse editor content to JSON for preview
    try {
      jsonParser.resetCounter();
      const sections = jsonParser.parse(editorState, contentBlocks);
      setPreviewSections(sections);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to parse content for preview:', error);
      alert('Ошибка создания предварительного просмотра: ' + error.message);
    }
  };

  /**
   * Handle preview close
   */
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewSections([]);
  };

  if (loading) {
    return (
      <div className="lesson-editor-loading">
        <div className="spinner"></div>
        <p>Загрузка урока...</p>
      </div>
    );
  }

  return (
    <div className="lesson-editor">
      {/* Draft Restoration Dialog */}
      {showDraftDialog && (
        <div className="draft-dialog-overlay">
          <div className="draft-dialog">
            <h3>Восстановить черновик?</h3>
            <p>
              Найден сохраненный черновик урока. Хотите восстановить его?
            </p>
            {pendingDraft && (
              <div className="draft-info">
                <p><strong>Название:</strong> {pendingDraft.title || '(без названия)'}</p>
                <p><strong>Сохранено:</strong> {new Date(pendingDraft.timestamp).toLocaleString('ru-RU')}</p>
              </div>
            )}
            <div className="draft-dialog-actions">
              <button
                className="btn-secondary"
                onClick={handleDiscardDraft}
                type="button"
              >
                Отклонить
              </button>
              <button
                className="btn-primary"
                onClick={handleRestoreDraft}
                type="button"
              >
                Восстановить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lesson-editor-header">
        <h2>{lessonId ? 'Редактировать урок' : 'Создать урок'}</h2>
        <button 
          className="close-button" 
          onClick={handleCancel}
          type="button"
          disabled={saving}
        >
          <MdClose />
        </button>
      </div>

      <div className="lesson-editor-body">
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="lesson-title">
            Название урока <span className="required">*</span>
          </label>
          <input
            type="text"
            id="lesson-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название урока"
            className={formErrors.title ? 'error' : ''}
            disabled={saving}
          />
          {formErrors.title && (
            <span className="error-message">{formErrors.title}</span>
          )}
        </div>

        {/* Description Input */}
        <div className="form-group">
          <label htmlFor="lesson-description">
            Описание урока
          </label>
          <textarea
            id="lesson-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание урока (опционально)"
            rows={2}
            disabled={saving}
          />
        </div>

        {/* Duration Input */}
        <div className="form-group">
          <label htmlFor="lesson-duration">
            Длительность (минуты) <span className="required">*</span>
          </label>
          <input
            type="number"
            id="lesson-duration"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
            min="1"
            max="300"
            className={formErrors.duration ? 'error' : ''}
            disabled={saving}
          />
          {formErrors.duration && (
            <span className="error-message">{formErrors.duration}</span>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="form-group">
          <label>
            Содержание урока <span className="required">*</span>
          </label>
          <RichTextEditor
            editorState={editorState}
            onChange={handleEditorChange}
            contentBlocks={contentBlocks}
            onContentBlocksChange={handleContentBlocksChange}
            placeholder="Начните вводить текст урока..."
          />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <h4>Ошибки валидации:</h4>
            <ul>
              {validationErrors.map((error, index) => (
                <li key={index}>
                  Секция {error.sectionId}, поле "{error.field}": {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lesson-editor-footer">
        <button
          className="btn-secondary"
          onClick={handleCancel}
          type="button"
          disabled={saving}
        >
          Отмена
        </button>
        <button
          className="btn-preview"
          onClick={handlePreview}
          type="button"
          disabled={saving}
        >
          <MdVisibility />
          Предварительный просмотр
        </button>
        <button
          className="btn-primary"
          onClick={handleConfirm}
          type="button"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-small"></span>
              Сохранение...
            </>
          ) : (
            <>
              <MdCheck />
              ПОДТВЕРДИТЬ
            </>
          )}
        </button>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <PreviewPanel 
          sections={previewSections}
          onClose={handleClosePreview}
        />
      )}
    </div>
  );
};

export default LessonEditor;
