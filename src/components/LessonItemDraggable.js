import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * LessonItemDraggable - Displays a single draggable lesson item
 * 
 * @param {Object} props
 * @param {Object} props.lesson - Lesson object
 * @param {Function} props.onDelete - Handler for deleting the lesson
 * @param {Function} props.onEdit - Handler for editing the lesson
 */
const LessonItemDraggable = ({ lesson, onDelete, onEdit }) => {
  // Setup drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(lesson.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(lesson.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="lesson-item"
    >
      <div className="lesson-info">
        <button
          className="lesson-drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Перетащить урок"
        >
          <span className="drag-icon">⋮⋮</span>
        </button>
        
        <span className="lesson-order">{lesson.order_index}</span>
        <span className="lesson-title">{lesson.title}</span>
        <span className="lesson-duration">
          {lesson.duration_minutes} мин
        </span>
      </div>
      <div className="lesson-actions">
        <button 
          className="btn btn-sm btn-outline"
          onClick={handleEdit}
        >
          Редактировать
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-sm btn-danger"
        >
          Удалить
        </button>
      </div>
    </div>
  );
};

export default LessonItemDraggable;
