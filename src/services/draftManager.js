/**
 * DraftManager - Service for managing lesson draft auto-save functionality
 * 
 * Features:
 * - Auto-save drafts to localStorage every 30 seconds
 * - Load drafts with stale draft detection (7 days)
 * - Clear drafts after successful submission
 * - Check for draft existence
 */
class DraftManager {
  constructor() {
    this.STORAGE_KEY = 'curriculum_builder_draft';
    this.AUTO_SAVE_INTERVAL = 30000; // 30 seconds
    this.MAX_DRAFT_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    this.autoSaveTimer = null;
  }

  /**
   * Start auto-saving drafts at regular intervals
   * @param {number|null} lessonId - Lesson ID (null for new lesson)
   * @param {number} courseId - Course ID
   * @param {number} moduleId - Module ID
   * @param {Function} getEditorData - Function that returns current editor data
   */
  startAutoSave(lessonId, courseId, moduleId, getEditorData) {
    // Stop any existing timer
    this.stopAutoSave();

    // Start new auto-save timer
    this.autoSaveTimer = setInterval(() => {
      try {
        const data = getEditorData();
        this.saveDraft({
          lessonId,
          courseId,
          moduleId,
          title: data.title,
          duration_minutes: data.duration,
          editorContent: data.editorContent,
          contentBlocks: data.contentBlocks,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  /**
   * Stop auto-saving
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Save draft to localStorage
   * @param {Object} draft - Draft data
   * @param {number|null} draft.lessonId - Lesson ID
   * @param {number} draft.courseId - Course ID
   * @param {number} draft.moduleId - Module ID
   * @param {string} draft.title - Lesson title
   * @param {number} draft.duration_minutes - Lesson duration
   * @param {string} draft.editorContent - Serialized editor content
   * @param {Array} draft.contentBlocks - Content blocks array
   * @param {number} draft.timestamp - Save timestamp
   */
  saveDraft(draft) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  /**
   * Load draft from localStorage
   * Automatically removes stale drafts (older than 7 days)
   * @returns {Object|null} Draft data or null if no valid draft exists
   */
  loadDraft() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return null;
      }

      const draft = JSON.parse(data);

      // Check if draft is stale (older than 7 days)
      const age = Date.now() - draft.timestamp;
      if (age > this.MAX_DRAFT_AGE) {
        // Remove stale draft
        this.clearDraft();
        return null;
      }

      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      // Clear corrupted draft
      this.clearDraft();
      return null;
    }
  }

  /**
   * Clear draft from localStorage
   */
  clearDraft() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }

  /**
   * Check if a draft exists for the given lesson context
   * @param {number} courseId - Course ID
   * @param {number} moduleId - Module ID
   * @param {number|null} lessonId - Lesson ID (null for new lesson)
   * @returns {boolean} True if a matching draft exists
   */
  hasDraft(courseId, moduleId, lessonId) {
    const draft = this.loadDraft();
    if (!draft) {
      return false;
    }

    return (
      draft.courseId === courseId &&
      draft.moduleId === moduleId &&
      draft.lessonId === lessonId
    );
  }
}

// Export singleton instance
export const draftManager = new DraftManager();
export default DraftManager;
