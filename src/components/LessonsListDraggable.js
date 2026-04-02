import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import LessonItemDraggable from './LessonItemDraggable';

/**
 * LessonsListDraggable - Displays draggable list of lessons within a module
 * 
 * @param {Object} props
 * @param {Array} props.lessons - Array of lesson objects
 * @param {Function} props.onLessonsReorder - Handler for reordering lessons
 * @param {Function} props.onLessonDelete - Handler for deleting a lesson
 * @param {Function} props.onLessonEdit - Handler for editing a lesson
 */
const LessonsListDraggable = ({ lessons, onLessonsReorder, onLessonDelete, onLessonEdit }) => {
  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event
   * Updates order_index for affected lessons
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedLessons.findIndex((l) => l.id === active.id);
    const newIndex = sortedLessons.findIndex((l) => l.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const reorderedLessons = arrayMove(sortedLessons, oldIndex, newIndex);

    // Update order_index for all affected lessons
    const updates = reorderedLessons.map((lesson, index) => ({
      id: lesson.id,
      order_index: index + 1,
    }));

    // Call the reorder handler with updates
    if (onLessonsReorder) {
      await onLessonsReorder(updates);
    }
  };

  // Sort lessons by order_index
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index);

  if (lessons.length === 0) {
    return (
      <div className="lessons-list">
        <div className="lessons-empty">
          <p>У этого модуля пока нет уроков</p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedLessons.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="lessons-list">
          {sortedLessons.map((lesson) => (
            <LessonItemDraggable
              key={lesson.id}
              lesson={lesson}
              onDelete={onLessonDelete}
              onEdit={onLessonEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default LessonsListDraggable;
