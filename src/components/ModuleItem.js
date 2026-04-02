import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { curriculumAPI } from '../services/curriculum';
import LessonsListDraggable from './LessonsListDraggable';
import LessonEditor from './LessonEditor';

/**
 * ModuleItem - Displays a single module with lessons and drag-and-drop support
 * 
 * @param {Object} props
 * @param {Object} props.module - Module object
 * @param {number} props.courseId - ID of the course
 * @param {boolean} props.isExpanded - Whether module is expanded
 * @param {Function} props.onToggle - Handler for toggling expansion
 * @param {Function} props.onUpdate - Handler for updating module
 * @param {Function} props.onDelete - Handler for deleting module
 */
const ModuleItem = ({
  module,
  courseId,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}) => {
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [creatingLesson, setCreatingLesson] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(module.title);
  const [editDescription, setEditDescription] = useState(module.description || '');
  const [editingLessonId, setEditingLessonId] = useState(null);

  // Setup drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Load lessons when module is expanded
  useEffect(() => {
    if (isExpanded && lessons.length === 0) {
      loadLessons();
    }
  }, [isExpanded]);

  /**
   * Load lessons for this module
   */
  const loadLessons = async () => {
    try {
      setLoadingLessons(true);
      setError(null);
      const data = await curriculumAPI.getLessons(courseId, module.id);
      setLessons(data || []);
    } catch (err) {
      console.error('Failed to load lessons:', err);
      setError(err.message || 'Не удалось загрузить уроки');
    } finally {
      setLoadingLessons(false);
    }
  };

  /**
   * Create a new lesson for this module
   */
  const handleCreateLesson = async () => {
    try {
      setCreatingLesson(true);
      setError(null);

      // Calculate order_index based on existing lessons
      const orderIndex = lessons.length + 1;

      const newLesson = await curriculumAPI.createLesson(courseId, module.id, {
        title: `Урок ${orderIndex}`,
        order_index: orderIndex,
        duration_minutes: 30,
        sections: [],
      });

      // Update lessons list without reload
      setLessons([...lessons, newLesson]);
    } catch (err) {
      console.error('Failed to create lesson:', err);
      setError(err.message || 'Не удалось создать урок');
    } finally {
      setCreatingLesson(false);
    }
  };

  /**
   * Handle module edit save
   */
  const handleEditSave = async () => {
    if (editTitle.trim() === module.title && editDescription.trim() === (module.description || '')) {
      setIsEditing(false);
      return;
    }

    try {
      const updateData = { title: editTitle.trim() };
      if (editDescription.trim() !== (module.description || '')) {
        updateData.description = editDescription.trim();
      }
      await onUpdate(module.id, updateData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update module:', err);
      setEditTitle(module.title); // Reset on error
      setEditDescription(module.description || '');
    }
  };

  /**
   * Handle module edit cancel
   */
  const handleEditCancel = () => {
    setEditTitle(module.title);
    setEditDescription(module.description || '');
    setIsEditing(false);
  };

  /**
   * Handle module deletion
   */
  const handleDelete = () => {
    const confirmMessage = lessons.length > 0
      ? `Вы уверены, что хотите удалить модуль "${module.title}"? Все уроки (${lessons.length}) будут удалены.`
      : `Вы уверены, что хотите удалить модуль "${module.title}"?`;

    if (window.confirm(confirmMessage)) {
      onDelete(module.id);
    }
  };

  /**
   * Handle lesson deletion
   */
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот урок?')) {
      return;
    }

    try {
      await curriculumAPI.deleteLesson(lessonId);
      setLessons(lessons.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      setError(err.message || 'Не удалось удалить урок');
    }
  };

  /**
   * Handle lesson edit
   */
  const handleEditLesson = (lessonId) => {
    setEditingLessonId(lessonId);
  };

  /**
   * Handle lesson save from editor
   */
  const handleSaveLesson = (savedLesson) => {
    // Update lessons list
    setLessons(lessons.map(l => l.id === savedLesson.id ? savedLesson : l));
    setEditingLessonId(null);
  };

  /**
   * Handle lesson editor cancel
   */
  const handleCancelLessonEdit = () => {
    setEditingLessonId(null);
  };

  /**
   * Handle lessons reordering
   */
  const handleLessonsReorder = async (updates) => {
    try {
      // Optimistically update UI
      const updatedLessons = lessons.map((lesson) => {
        const update = updates.find((u) => u.id === lesson.id);
        return update ? { ...lesson, order_index: update.order_index } : lesson;
      });
      setLessons(updatedLessons);

      // Send PUT requests for each affected lesson
      await Promise.all(
        updates.map((update) =>
          curriculumAPI.updateLesson(update.id, { order_index: update.order_index })
        )
      );
    } catch (err) {
      console.error('Failed to reorder lessons:', err);
      setError(err.message || 'Не удалось изменить порядок уроков');
      // Reload lessons on error
      loadLessons();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="module-item"
      data-order-index={module.order_index}
    >
      <div className="module-header">
        <div className="module-info">
          <button
            className="module-drag-handle"
            {...attributes}
            {...listeners}
            aria-label="Перетащить модуль"
          >
            <span className="drag-icon">⋮⋮</span>
          </button>
          
          <button
            className="module-toggle"
            onClick={onToggle}
            aria-label={isExpanded ? 'Свернуть модуль' : 'Развернуть модуль'}
          >
            <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>
              ▶
            </span>
          </button>
          
          <span className="module-order">{module.order_index}</span>
          
          {isEditing ? (
            <div className="module-edit-form">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="module-title-input"
                placeholder="Название модуля"
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="module-description-input"
                placeholder="Описание модуля (опционально)"
                rows={2}
              />
              <div className="module-edit-actions">
                <button
                  onClick={handleEditSave}
                  className="btn btn-sm btn-primary"
                  type="button"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleEditCancel}
                  className="btn btn-sm btn-outline"
                  type="button"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="module-text">
              <h4 className="module-title">{module.title}</h4>
              {module.description && (
                <p className="module-description">{module.description}</p>
              )}
            </div>
          )}
        </div>

        <div className="module-actions">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-outline"
              >
                Редактировать
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-sm btn-danger"
              >
                Удалить
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="module-content">
          {loadingLessons && (
            <div className="lessons-loading">
              <p>Загрузка уроков...</p>
            </div>
          )}

          {error && (
            <div className="lessons-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
              <button onClick={loadLessons} className="btn btn-sm btn-outline">
                Повторить
              </button>
            </div>
          )}

          {!loadingLessons && !error && (
            <>
              {editingLessonId ? (
                <LessonEditor
                  courseId={courseId}
                  moduleId={module.id}
                  lessonId={editingLessonId}
                  onSave={handleSaveLesson}
                  onCancel={handleCancelLessonEdit}
                />
              ) : (
                <>
                  <LessonsListDraggable
                    lessons={lessons}
                    onLessonsReorder={handleLessonsReorder}
                    onLessonDelete={handleDeleteLesson}
                    onLessonEdit={handleEditLesson}
                  />

                  <div className="module-footer">
                    <button
                      onClick={handleCreateLesson}
                      disabled={creatingLesson}
                      className="btn btn-outline"
                    >
                      {creatingLesson ? 'Создание...' : '+ Создать урок'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleItem;
