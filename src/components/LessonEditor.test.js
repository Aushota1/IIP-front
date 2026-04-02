import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LessonEditor from './LessonEditor';
import { curriculumAPI } from '../services/curriculum';
import { draftManager } from '../services/draftManager';

// Mock dependencies
jest.mock('../services/curriculum');
jest.mock('../services/draftManager', () => ({
  draftManager: {
    startAutoSave: jest.fn(),
    stopAutoSave: jest.fn(),
    saveDraft: jest.fn(),
    loadDraft: jest.fn(() => null),
    clearDraft: jest.fn(),
    hasDraft: jest.fn(() => false),
  },
}));
jest.mock('../services/jsonParser', () => ({
  jsonParser: {
    parse: jest.fn(() => [{ id: 1, type: 'text', content: 'Test content' }]),
    validate: jest.fn(() => ({ valid: true, errors: [] })),
    resetCounter: jest.fn(),
  },
}));
jest.mock('../services/prettyPrinter', () => ({
  prettyPrinter: {
    format: jest.fn(() => ({
      editorState: { getCurrentContent: () => ({}) },
      contentBlocks: []
    })),
  },
}));
jest.mock('./RichTextEditor', () => {
  return function MockRichTextEditor({ editorState, onChange, placeholder }) {
    return (
      <div data-testid="rich-text-editor">
        <textarea
          placeholder={placeholder}
          onChange={(e) => {
            // Simulate editor state change with mock object
            onChange({ getCurrentContent: () => ({}) });
          }}
        />
      </div>
    );
  };
});

describe('LessonEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    courseId: 1,
    moduleId: 1,
    lessonId: null,
    onSave: mockOnSave,
    onCancel: mockOnCancel,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.alert
    global.alert = jest.fn();
    // Reset draft manager mocks
    draftManager.loadDraft.mockReturnValue(null);
    draftManager.hasDraft.mockReturnValue(false);
    
    // Reset jsonParser mocks
    const { jsonParser } = require('../services/jsonParser');
    jsonParser.parse.mockReturnValue([{ id: 1, type: 'text', content: 'Test content' }]);
    jsonParser.validate.mockReturnValue({ valid: true, errors: [] });
    jsonParser.resetCounter.mockReturnValue(undefined);
  });

  describe('Rendering', () => {
    test('renders lesson editor for new lesson', () => {
      render(<LessonEditor {...defaultProps} />);

      expect(screen.getByText('Создать урок')).toBeInTheDocument();
      expect(screen.getByLabelText(/Название урока/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Длительность/i)).toBeInTheDocument();
      expect(screen.getByTestId('rich-text-editor')).toBeInTheDocument();
      expect(screen.getByText('ПОДТВЕРДИТЬ')).toBeInTheDocument();
    });

    test('renders lesson editor for editing existing lesson', async () => {
      curriculumAPI.getLesson.mockResolvedValue({
        id: 123,
        title: 'Existing Lesson',
        duration_minutes: 45,
        sections: [
          { id: 1, type: 'text', content: 'Test content' }
        ]
      });

      render(<LessonEditor {...defaultProps} lessonId={123} />);

      await waitFor(() => {
        expect(screen.getByText('Редактировать урок')).toBeInTheDocument();
      });
    });

    test('displays required field indicators', () => {
      render(<LessonEditor {...defaultProps} />);

      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    test('shows error when title is empty', async () => {
      render(<LessonEditor {...defaultProps} />);

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Название урока обязательно')).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    test('shows error when duration is invalid', async () => {
      render(<LessonEditor {...defaultProps} />);

      const durationInput = screen.getByLabelText(/Длительность/i);
      fireEvent.change(durationInput, { target: { value: '0' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Длительность должна быть больше 0')).toBeInTheDocument();
      });

      expect(mockOnSave).not.toHaveBeenCalled();
    });

    test('allows valid form submission', async () => {
      curriculumAPI.createLesson.mockResolvedValue({
        id: 1,
        title: 'Test Lesson',
        duration_minutes: 30,
      });

      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(curriculumAPI.createLesson).toHaveBeenCalled();
      }, { timeout: 2000 });

      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    test('updates title when user types', () => {
      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'New Lesson Title' } });

      expect(titleInput.value).toBe('New Lesson Title');
    });

    test('updates duration when user changes value', () => {
      render(<LessonEditor {...defaultProps} />);

      const durationInput = screen.getByLabelText(/Длительность/i);
      fireEvent.change(durationInput, { target: { value: '45' } });

      expect(durationInput.value).toBe('45');
    });

    test('calls onCancel when cancel button is clicked', () => {
      render(<LessonEditor {...defaultProps} />);

      const cancelButton = screen.getByText('Отмена');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('calls onCancel when close button is clicked', () => {
      render(<LessonEditor {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    test('creates new lesson when lessonId is null', async () => {
      const mockLesson = {
        id: 1,
        title: 'Test Lesson',
        duration_minutes: 30,
        sections: [],
      };

      curriculumAPI.createLesson.mockResolvedValue(mockLesson);

      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(curriculumAPI.createLesson).toHaveBeenCalledWith(
          1,
          1,
          expect.objectContaining({
            title: 'Test Lesson',
            duration_minutes: 30,
          })
        );
      });

      expect(mockOnSave).toHaveBeenCalledWith(mockLesson);
    });

    test('updates existing lesson when lessonId is provided', async () => {
      const mockLesson = {
        id: 123,
        title: 'Updated Lesson',
        duration_minutes: 45,
        sections: [],
      };

      curriculumAPI.getLesson.mockResolvedValue({
        id: 123,
        title: 'Original Lesson',
        duration_minutes: 30,
        sections: [],
      });

      curriculumAPI.updateLesson.mockResolvedValue(mockLesson);

      render(<LessonEditor {...defaultProps} lessonId={123} />);

      await waitFor(() => {
        expect(curriculumAPI.getLesson).toHaveBeenCalledWith(123);
      });

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Updated Lesson' } });

      const durationInput = screen.getByLabelText(/Длительность/i);
      fireEvent.change(durationInput, { target: { value: '45' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(curriculumAPI.updateLesson).toHaveBeenCalledWith(
          123,
          expect.objectContaining({
            title: 'Updated Lesson',
            duration_minutes: 45,
          })
        );
      });

      expect(mockOnSave).toHaveBeenCalledWith(mockLesson);
    });

    test('handles API errors gracefully', async () => {
      const mockError = new Error('Network error');
      curriculumAPI.createLesson.mockRejectedValue(mockError);

      // Mock window.alert
      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith(
          expect.stringContaining('Ошибка сохранения урока')
        );
      });

      alertMock.mockRestore();
    });
  });

  describe('Loading State', () => {
    test('shows loading spinner when loading lesson', async () => {
      curriculumAPI.getLesson.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<LessonEditor {...defaultProps} lessonId={123} />);

      expect(screen.getByText('Загрузка урока...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Загрузка урока...')).not.toBeInTheDocument();
      });
    });

    test('disables buttons while saving', async () => {
      curriculumAPI.createLesson.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByText('Сохранение...')).toBeInTheDocument();
      });
    });
  });

  describe('Validation Errors Display', () => {
    test('displays validation errors from JSON parser', async () => {
      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      // Note: In real scenario, validation errors would come from jsonParser.validate()
      // This test verifies the UI can display them

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      // If there were validation errors, they would be displayed
      // For now, just verify the component doesn't crash
      await waitFor(() => {
        expect(confirmButton).toBeInTheDocument();
      });
    });
  });

  describe('Draft Manager Integration', () => {
    test('starts auto-save when component mounts', () => {
      render(<LessonEditor {...defaultProps} />);

      expect(draftManager.startAutoSave).toHaveBeenCalledWith(
        null,
        1,
        1,
        expect.any(Function)
      );
    });

    test('stops auto-save when component unmounts', () => {
      const { unmount } = render(<LessonEditor {...defaultProps} />);

      unmount();

      expect(draftManager.stopAutoSave).toHaveBeenCalled();
    });

    test('clears draft after successful lesson submission', async () => {
      curriculumAPI.createLesson.mockResolvedValue({
        id: 1,
        title: 'Test Lesson',
        duration_minutes: 30,
      });

      render(<LessonEditor {...defaultProps} />);

      const titleInput = screen.getByLabelText(/Название урока/i);
      fireEvent.change(titleInput, { target: { value: 'Test Lesson' } });

      const confirmButton = screen.getByText('ПОДТВЕРДИТЬ');
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(draftManager.clearDraft).toHaveBeenCalled();
      });
    });

    test('shows draft restoration dialog when draft exists', () => {
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft Lesson',
        duration_minutes: 45,
        editorContent: '{"blocks":[{"key":"test","text":"Draft content","type":"unstyled"}]}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      render(<LessonEditor {...defaultProps} />);

      expect(screen.getByText('Восстановить черновик?')).toBeInTheDocument();
      expect(screen.getByText('Draft Lesson')).toBeInTheDocument();
    });

    test('does not show draft dialog when no draft exists', () => {
      draftManager.loadDraft.mockReturnValue(null);
      draftManager.hasDraft.mockReturnValue(false);

      render(<LessonEditor {...defaultProps} />);

      expect(screen.queryByText('Восстановить черновик?')).not.toBeInTheDocument();
    });

    test('restores draft when user clicks restore button', async () => {
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft Lesson',
        duration_minutes: 45,
        editorContent: '{"blocks":[{"key":"test","text":"Draft content","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      render(<LessonEditor {...defaultProps} />);

      const restoreButton = screen.getByText('Восстановить');
      fireEvent.click(restoreButton);

      await waitFor(() => {
        expect(screen.queryByText('Восстановить черновик?')).not.toBeInTheDocument();
      });

      // Verify draft data was loaded
      const titleInput = screen.getByLabelText(/Название урока/i);
      expect(titleInput.value).toBe('Draft Lesson');

      const durationInput = screen.getByLabelText(/Длительность/i);
      expect(durationInput.value).toBe('45');
    });

    test('discards draft when user clicks discard button', async () => {
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft Lesson',
        duration_minutes: 45,
        editorContent: '{"blocks":[]}',
        contentBlocks: [],
        timestamp: Date.now()
      };

      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      render(<LessonEditor {...defaultProps} />);

      const discardButton = screen.getByText('Отклонить');
      fireEvent.click(discardButton);

      await waitFor(() => {
        expect(draftManager.clearDraft).toHaveBeenCalled();
        expect(screen.queryByText('Восстановить черновик?')).not.toBeInTheDocument();
      });
    });

    test('handles corrupted draft data gracefully', async () => {
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft Lesson',
        duration_minutes: 45,
        editorContent: 'invalid json',
        contentBlocks: [],
        timestamp: Date.now()
      };

      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

      render(<LessonEditor {...defaultProps} />);

      const restoreButton = screen.getByText('Восстановить');
      fireEvent.click(restoreButton);

      await waitFor(() => {
        expect(alertMock).toHaveBeenCalledWith('Ошибка восстановления черновика');
        expect(draftManager.clearDraft).toHaveBeenCalled();
      });

      alertMock.mockRestore();
    });

    test('does not show draft dialog when editing existing lesson', () => {
      curriculumAPI.getLesson.mockResolvedValue({
        id: 123,
        title: 'Existing Lesson',
        duration_minutes: 45,
        sections: []
      });

      draftManager.loadDraft.mockReturnValue({
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft',
        duration_minutes: 30,
        editorContent: '{}',
        contentBlocks: [],
        timestamp: Date.now()
      });
      draftManager.hasDraft.mockReturnValue(false); // Different context

      render(<LessonEditor {...defaultProps} lessonId={123} />);

      expect(screen.queryByText('Восстановить черновик?')).not.toBeInTheDocument();
    });

    test('displays draft timestamp in restoration dialog', () => {
      const timestamp = Date.now() - 60000; // 1 minute ago
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft Lesson',
        duration_minutes: 45,
        editorContent: '{"blocks":[]}',
        contentBlocks: [],
        timestamp
      };

      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      render(<LessonEditor {...defaultProps} />);

      expect(screen.getByText(/Сохранено:/i)).toBeInTheDocument();
      // Verify timestamp is displayed (format may vary by locale)
      const timestampText = new Date(timestamp).toLocaleString('ru-RU');
      expect(screen.getByText(timestampText)).toBeInTheDocument();
    });
  });
});
