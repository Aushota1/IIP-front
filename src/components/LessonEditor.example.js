/**
 * LessonEditor Integration Example
 * 
 * This file demonstrates how to integrate the LessonEditor component
 * into the CurriculumBuilder or ModulesList components.
 */

import React, { useState } from 'react';
import LessonEditor from './LessonEditor';

/**
 * Example 1: Using LessonEditor in a modal/overlay
 */
export const LessonEditorModalExample = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(1);
  const [selectedModule, setSelectedModule] = useState(1);
  const [editingLessonId, setEditingLessonId] = useState(null);

  const handleCreateLesson = (moduleId) => {
    setSelectedModule(moduleId);
    setEditingLessonId(null);
    setShowEditor(true);
  };

  const handleEditLesson = (lessonId, moduleId) => {
    setSelectedModule(moduleId);
    setEditingLessonId(lessonId);
    setShowEditor(true);
  };

  const handleSave = (lesson) => {
    console.log('Lesson saved:', lesson);
    setShowEditor(false);
    // Refresh lessons list or update state
  };

  const handleCancel = () => {
    setShowEditor(false);
  };

  return (
    <div>
      <button onClick={() => handleCreateLesson(1)}>
        Создать урок
      </button>

      {showEditor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LessonEditor
              courseId={selectedCourse}
              moduleId={selectedModule}
              lessonId={editingLessonId}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Example 2: Using LessonEditor in a separate page/route
 */
export const LessonEditorPageExample = () => {
  const courseId = 1; // From route params or context
  const moduleId = 1; // From route params or context
  const lessonId = null; // From route params (null for new lesson)

  const handleSave = (lesson) => {
    console.log('Lesson saved:', lesson);
    // Navigate back to curriculum builder
    // history.push('/admin/curriculum');
  };

  const handleCancel = () => {
    // Navigate back to curriculum builder
    // history.push('/admin/curriculum');
  };

  return (
    <div className="lesson-editor-page">
      <LessonEditor
        courseId={courseId}
        moduleId={moduleId}
        lessonId={lessonId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
};

/**
 * Example 3: Integration with ModulesList component
 */
export const ModulesListWithEditorExample = () => {
  const [showEditor, setShowEditor] = useState(false);
  const [editorProps, setEditorProps] = useState({});

  const handleCreateLessonClick = (courseId, moduleId) => {
    setEditorProps({
      courseId,
      moduleId,
      lessonId: null,
    });
    setShowEditor(true);
  };

  const handleEditLessonClick = (courseId, moduleId, lessonId) => {
    setEditorProps({
      courseId,
      moduleId,
      lessonId,
    });
    setShowEditor(true);
  };

  const handleLessonSaved = (lesson) => {
    console.log('Lesson saved:', lesson);
    setShowEditor(false);
    // Refresh the modules list to show the new/updated lesson
  };

  const handleEditorCancelled = () => {
    setShowEditor(false);
  };

  return (
    <div className="curriculum-builder">
      {!showEditor ? (
        <div className="modules-list">
          {/* ModulesList component with buttons */}
          <button onClick={() => handleCreateLessonClick(1, 1)}>
            Создать урок в модуле 1
          </button>
          <button onClick={() => handleEditLessonClick(1, 1, 123)}>
            Редактировать урок 123
          </button>
        </div>
      ) : (
        <LessonEditor
          {...editorProps}
          onSave={handleLessonSaved}
          onCancel={handleEditorCancelled}
        />
      )}
    </div>
  );
};

/**
 * Example 4: Using LessonEditor with Context API
 */
import { useCurriculum } from '../context/CurriculumContext';

export const LessonEditorWithContextExample = () => {
  const {
    selectedCourse,
    currentModule,
    currentLesson,
    setCurrentLesson,
    refreshLessons,
  } = useCurriculum();

  const [showEditor, setShowEditor] = useState(false);

  const handleSave = async (lesson) => {
    console.log('Lesson saved:', lesson);
    setShowEditor(false);
    setCurrentLesson(null);
    // Refresh lessons list
    await refreshLessons(selectedCourse.id, currentModule.id);
  };

  const handleCancel = () => {
    setShowEditor(false);
    setCurrentLesson(null);
  };

  if (!showEditor) {
    return (
      <button onClick={() => setShowEditor(true)}>
        {currentLesson ? 'Редактировать урок' : 'Создать урок'}
      </button>
    );
  }

  return (
    <LessonEditor
      courseId={selectedCourse.id}
      moduleId={currentModule.id}
      lessonId={currentLesson?.id || null}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

/**
 * CSS for modal overlay (add to your SCSS file)
 */
const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.lesson-editor-page {
  width: 100%;
  height: 100vh;
  padding: 2rem;
}
`;

export default {
  LessonEditorModalExample,
  LessonEditorPageExample,
  ModulesListWithEditorExample,
  LessonEditorWithContextExample,
};
