/**
 * @file Type definitions for Curriculum Builder
 * These JSDoc type definitions provide type safety and documentation
 */

/**
 * @typedef {Object} Course
 * @property {number} id - Unique course identifier
 * @property {string} slug - URL-friendly course identifier
 * @property {string} title - Course title
 */

/**
 * @typedef {Object} LessonSummary
 * @property {number} id - Unique lesson identifier
 * @property {string} title - Lesson title
 * @property {number} duration_minutes - Lesson duration in minutes
 * @property {number} order_index - Position in module
 */

/**
 * @typedef {Object} Module
 * @property {number} id - Unique module identifier
 * @property {number} course_id - Parent course ID
 * @property {string} title - Module title
 * @property {number} order_index - Position in course
 * @property {LessonSummary[]} lessons - Lessons in this module
 */

/**
 * @typedef {Object} TextSection
 * @property {number} id - Unique section identifier
 * @property {'text'} type - Section type
 * @property {string} content - Text content (plain text or markdown)
 */

/**
 * @typedef {Object} CodeSection
 * @property {number} id - Unique section identifier
 * @property {'code'} type - Section type
 * @property {string} language - Programming language (python, javascript, etc.)
 * @property {string} content - Code content
 */

/**
 * @typedef {Object} FormulaSection
 * @property {number} id - Unique section identifier
 * @property {'formula'} type - Section type
 * @property {string} [title] - Optional formula title
 * @property {string} content - LaTeX formula content
 */

/**
 * @typedef {Object} ImageSection
 * @property {number} id - Unique section identifier
 * @property {'image'} type - Section type
 * @property {string} url - Image URL
 * @property {string} alt - Alt text for accessibility
 */

/**
 * @typedef {Object} VideoSection
 * @property {number} id - Unique section identifier
 * @property {'video'} type - Section type
 * @property {string} url - Video URL
 * @property {string} title - Video title
 */

/**
 * @typedef {TextSection | CodeSection | FormulaSection | ImageSection | VideoSection} Section
 */

/**
 * @typedef {Object} Lesson
 * @property {number} id - Unique lesson identifier
 * @property {number} course_id - Parent course ID
 * @property {number} module_id - Parent module ID
 * @property {string} title - Lesson title
 * @property {number} order_index - Position in module
 * @property {number} duration_minutes - Lesson duration in minutes
 * @property {Section[]} sections - Lesson content sections
 */

/**
 * @typedef {Object} ContentBlock
 * @property {string} id - Temporary ID for editor
 * @property {'formula' | 'code' | 'image' | 'video' | 'table'} type - Block type
 * @property {string} title - Block title (required)
 * @property {string} content - Block content (LaTeX for formula, code for code, URL for image/video)
 * @property {string} [language] - Programming language (for code blocks)
 * @property {string} [explanation] - Optional explanation text
 */

/**
 * @typedef {Object} ValidationError
 * @property {number} sectionId - ID of section with error
 * @property {string} field - Field name with error
 * @property {string} message - Error message
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {ValidationError[]} errors - Array of validation errors
 */

/**
 * @typedef {Object} LessonDraft
 * @property {number | null} lessonId - Lesson ID (null for new lesson)
 * @property {number} courseId - Course ID
 * @property {number} moduleId - Module ID
 * @property {string} title - Lesson title
 * @property {number} duration_minutes - Lesson duration
 * @property {string} editorContent - Serialized EditorState
 * @property {ContentBlock[]} contentBlocks - Content blocks
 * @property {number} timestamp - Draft creation timestamp
 */

export {};
