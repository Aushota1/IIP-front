import DraftManager, { draftManager } from './draftManager';

describe('DraftManager', () => {
  let manager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Create new instance for each test
    manager = new DraftManager();
  });

  afterEach(() => {
    // Stop any running timers
    manager.stopAutoSave();
    localStorage.clear();
  });

  describe('saveDraft', () => {
    it('should save draft to localStorage', () => {
      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test Lesson',
        duration_minutes: 30,
        editorContent: '{"blocks":[]}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      manager.saveDraft(draft);

      const saved = localStorage.getItem('curriculum_builder_draft');
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved)).toEqual(draft);
    });

    it('should handle save errors gracefully', () => {
      // Mock localStorage.setItem to throw error
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('Storage full');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      // Should not throw
      expect(() => manager.saveDraft(draft)).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      // Restore
      Storage.prototype.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('loadDraft', () => {
    it('should load draft from localStorage', () => {
      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test Lesson',
        duration_minutes: 30,
        editorContent: '{"blocks":[]}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(draft));

      const loaded = manager.loadDraft();
      expect(loaded).toEqual(draft);
    });

    it('should return null if no draft exists', () => {
      const loaded = manager.loadDraft();
      expect(loaded).toBeNull();
    });

    it('should remove stale drafts older than 7 days', () => {
      const staleDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Old Draft',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days old
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(staleDraft));

      const loaded = manager.loadDraft();
      expect(loaded).toBeNull();
      expect(localStorage.getItem('curriculum_builder_draft')).toBeNull();
    });

    it('should load drafts that are less than 7 days old', () => {
      const recentDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Recent Draft',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now() - (6 * 24 * 60 * 60 * 1000) // 6 days old
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(recentDraft));

      const loaded = manager.loadDraft();
      expect(loaded).toEqual(recentDraft);
    });

    it('should handle corrupted draft data', () => {
      localStorage.setItem('curriculum_builder_draft', 'invalid json');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const loaded = manager.loadDraft();
      expect(loaded).toBeNull();
      expect(localStorage.getItem('curriculum_builder_draft')).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('clearDraft', () => {
    it('should remove draft from localStorage', () => {
      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(draft));
      expect(localStorage.getItem('curriculum_builder_draft')).not.toBeNull();

      manager.clearDraft();
      expect(localStorage.getItem('curriculum_builder_draft')).toBeNull();
    });

    it('should handle clear errors gracefully', () => {
      const originalRemoveItem = Storage.prototype.removeItem;
      Storage.prototype.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => manager.clearDraft()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      Storage.prototype.removeItem = originalRemoveItem;
      consoleSpy.mockRestore();
    });
  });

  describe('hasDraft', () => {
    it('should return true if matching draft exists', () => {
      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(draft));

      expect(manager.hasDraft(1, 2, null)).toBe(true);
    });

    it('should return false if no draft exists', () => {
      expect(manager.hasDraft(1, 2, null)).toBe(false);
    });

    it('should return false if draft does not match context', () => {
      const draft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Test',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(draft));

      expect(manager.hasDraft(1, 3, null)).toBe(false); // Different moduleId
      expect(manager.hasDraft(2, 2, null)).toBe(false); // Different courseId
      expect(manager.hasDraft(1, 2, 5)).toBe(false); // Different lessonId
    });

    it('should return false if draft is stale', () => {
      const staleDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 2,
        title: 'Old Draft',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now() - (8 * 24 * 60 * 60 * 1000) // 8 days old
      };

      localStorage.setItem('curriculum_builder_draft', JSON.stringify(staleDraft));

      expect(manager.hasDraft(1, 2, null)).toBe(false);
    });
  });

  describe('startAutoSave', () => {
    it('should start auto-save timer', () => {
      jest.useFakeTimers();

      const getEditorData = jest.fn(() => ({
        title: 'Test',
        duration: 30,
        editorContent: '{}',
        contentBlocks: []
      }));

      manager.startAutoSave(null, 1, 2, getEditorData);

      expect(manager.autoSaveTimer).not.toBeNull();

      // Fast-forward time by 30 seconds
      jest.advanceTimersByTime(30000);

      expect(getEditorData).toHaveBeenCalled();
      expect(localStorage.getItem('curriculum_builder_draft')).not.toBeNull();

      jest.useRealTimers();
    });

    it('should stop existing timer before starting new one', () => {
      jest.useFakeTimers();

      const getEditorData1 = jest.fn(() => ({
        title: 'Test 1',
        duration: 30,
        editorContent: '{}',
        contentBlocks: []
      }));

      const getEditorData2 = jest.fn(() => ({
        title: 'Test 2',
        duration: 45,
        editorContent: '{}',
        contentBlocks: []
      }));

      manager.startAutoSave(null, 1, 2, getEditorData1);
      const firstTimer = manager.autoSaveTimer;

      manager.startAutoSave(null, 1, 2, getEditorData2);
      const secondTimer = manager.autoSaveTimer;

      expect(firstTimer).not.toBe(secondTimer);

      jest.advanceTimersByTime(30000);

      expect(getEditorData1).not.toHaveBeenCalled();
      expect(getEditorData2).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should handle errors during auto-save', () => {
      jest.useFakeTimers();

      const getEditorData = jest.fn(() => {
        throw new Error('Editor error');
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      manager.startAutoSave(null, 1, 2, getEditorData);

      jest.advanceTimersByTime(30000);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      jest.useRealTimers();
    });
  });

  describe('stopAutoSave', () => {
    it('should stop auto-save timer', () => {
      jest.useFakeTimers();

      const getEditorData = jest.fn(() => ({
        title: 'Test',
        duration: 30,
        editorContent: '{}',
        contentBlocks: []
      }));

      manager.startAutoSave(null, 1, 2, getEditorData);
      expect(manager.autoSaveTimer).not.toBeNull();

      manager.stopAutoSave();
      expect(manager.autoSaveTimer).toBeNull();

      // Timer should not fire after stopping
      jest.advanceTimersByTime(30000);
      expect(getEditorData).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should handle stopping when no timer is running', () => {
      expect(() => manager.stopAutoSave()).not.toThrow();
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(draftManager).toBeInstanceOf(DraftManager);
    });
  });
});
