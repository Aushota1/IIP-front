import React, { useState } from 'react';
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
import ModuleItem from './ModuleItem';

/**
 * ModulesList - Displays list of modules with expand/collapse functionality and drag-and-drop
 * 
 * @param {Object} props
 * @param {number} props.courseId - ID of the selected course
 * @param {Array} props.modules - Array of module objects
 * @param {Function} props.onModuleCreate - Handler for creating new module
 * @param {Function} props.onModuleUpdate - Handler for updating module
 * @param {Function} props.onModuleDelete - Handler for deleting module
 * @param {Function} props.onModuleReorder - Handler for reordering modules
 * @param {boolean} props.creating - Whether module creation is in progress
 */
const ModulesList = ({
  courseId,
  modules,
  onModuleCreate,
  onModuleUpdate,
  onModuleDelete,
  onModuleReorder,
  creating = false,
}) => {
  const [expandedModules, setExpandedModules] = useState(new Set());

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
   * Toggle module expansion state
   */
  const toggleModule = (moduleId) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  /**
   * Handle drag end event
   * Updates order_index for affected modules
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedModules.findIndex((m) => m.id === active.id);
    const newIndex = sortedModules.findIndex((m) => m.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update UI
    const reorderedModules = arrayMove(sortedModules, oldIndex, newIndex);

    // Update order_index for all affected modules
    const updates = reorderedModules.map((module, index) => ({
      id: module.id,
      order_index: index + 1,
    }));

    // Call the reorder handler with updates
    if (onModuleReorder) {
      await onModuleReorder(updates);
    }
  };

  // Sort modules by order_index
  const sortedModules = [...modules].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="modules-container">
      <div className="modules-header">
        <h3>Модули ({modules.length})</h3>
        <button
          onClick={onModuleCreate}
          disabled={creating}
          className="btn btn-primary"
        >
          {creating ? 'Создание...' : '+ Создать модуль'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedModules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="modules-list">
            {sortedModules.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                courseId={courseId}
                isExpanded={expandedModules.has(module.id)}
                onToggle={() => toggleModule(module.id)}
                onUpdate={onModuleUpdate}
                onDelete={onModuleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ModulesList;
