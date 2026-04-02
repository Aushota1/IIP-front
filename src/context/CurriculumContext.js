import React, { createContext, useContext, useState } from 'react';

// Create the context
const CurriculumContext = createContext(undefined);

/**
 * CurriculumProvider - Manages state for the curriculum builder
 * 
 * State includes:
 * - selectedCourse: Currently selected course
 * - modules: List of modules for the selected course
 * - currentLesson: Lesson being edited
 * - editorState: Draft.js editor state
 * - isDraft: Whether current lesson is a draft
 * - validationErrors: Array of validation errors
 */
export const CurriculumProvider = ({ children }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [isDraft, setIsDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const value = {
    // State
    selectedCourse,
    modules,
    currentLesson,
    editorState,
    isDraft,
    validationErrors,
    
    // Setters
    setSelectedCourse,
    setModules,
    setCurrentLesson,
    setEditorState,
    setIsDraft,
    setValidationErrors,
  };

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
};

/**
 * useCurriculum - Hook to access curriculum context
 * @throws {Error} If used outside CurriculumProvider
 */
export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider');
  }
  return context;
};

export default CurriculumContext;
