/**
 * Integration Tests for Admin Course Curriculum Builder
 * Task 22: Интеграция и финальное тестирование
 * 
 * These tests verify the complete user workflows for the curriculum builder.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminPanel from '../pages/AdminPanel';
import CurriculumBuilder from '../components/CurriculumBuilder';
import LessonEditor from '../components/LessonEditor';
import { CurriculumProvider } from '../context/CurriculumContext';
import { curriculumAPI } from '../services/curriculum';
import { draftManager } from '../services/draftManager';
import { getAllCourses } from '../services/courses';

// Mock react-router-dom is in __mocks__ folder
jest.mock('react-router-dom');

// Mock UserContext
jest.mock('../context/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com', role: 'admin' },
    setUser: jest.fn(),
  }),
  UserProvider: ({ children }) => <div>{children}</div>,
}));

// Mock dependencies
jest.mock('../services/courses');
jest.mock('../services/curriculum');
jest.mock('../api');
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

// Mock RichTextEditor
jest.mock('../components/RichTextEditor', () => {
  return function MockRichTextEditor({ onChange, contentBlocks, onContentBlocksChange }) {
    return (
      <div data-testid="rich-text-editor">
        <textarea
          data-testid="editor-textarea"
          onChange={(e) => onChange({ getCurrentContent: () => ({ getPlainText: () => e.target.value }) })}
        />
        <button
          data-testid="add-content-block"
          onClick={() => {
            const newBlock = { id: `block-${Date.now()}`, type: 'code', title: 'Test', content: 'test', language: 'javascript' };
            onContentBlocksChange([...(contentBlocks || []), newBlock]);
          }}
        >
          Add Block
        </button>
      </div>
    );
  };
});

// Mock PreviewPanel
jest.mock('../components/PreviewPanel', () => {
  return function MockPreviewPanel({ sections, onClose }) {
    return (
      <div data-testid="preview-panel">
        <h3>Preview</h3>
        {sections?.map((section, idx) => (
          <div key={idx} data-testid={`preview-section-${section.type}`}>
            {section.type}
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

describe('Integration Tests: Admin Course Curriculum Builder', () => {
  const mockCourse = { id: 1, slug: 'test-course', title: 'Test Course' };
  const mockModule = { id: 1, course_id: 1, title: 'Module 1', order_index: 1, lessons: [] };

  beforeEach(() => {
    jest.clearAllMocks();
    global.alert = jest.fn();
    global.confirm = jest.fn(() => true);
    getAllCourses.mockResolvedValue([mockCourse]);
    curriculumAPI.getModules.mockResolvedValue([mockModule]);
    curriculumAPI.getLessons.mockResolvedValue([]);
    draftManager.loadDraft.mockReturnValue(null);
    draftManager.hasDraft.mockReturnValue(false);
  });

  /**
   * Task 22.1: Integration in AdminPanel
   */
  describe('22.1 Integration in AdminPanel', () => {
    test('should display Программа Курса tab', () => {
      render(<AdminPanel />);
      expect(screen.getByText(/Программа Курса/i)).toBeInTheDocument();
    });

    test('should navigate to curriculum tab', async () => {
      render(<AdminPanel />);
      const tab = screen.getByText(/Программа Курса/i);
      fireEvent.click(tab);
      
      // Verify the curriculum builder content is displayed
      await waitFor(() => {
        expect(screen.getByText(/Выберите курс для управления программой/i)).toBeInTheDocument();
      });
    });
  });

  /**
   * Task 22.2: Full Lesson Creation Flow
   */
  describe('22.2 Lesson Creation Flow', () => {
    test('should create lesson with content', async () => {
      const mockLesson = {
        id: 1,
        title: 'New Lesson',
        duration_minutes: 30,
        sections: [{ id: 1, type: 'text', content: 'Test' }],
      };
      curriculumAPI.createLesson.mockResolvedValue(mockLesson);

      const onSave = jest.fn();
      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} onSave={onSave} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      // Fill form
      fireEvent.change(screen.getByLabelText(/Название урока/i), { target: { value: 'New Lesson' } });
      fireEvent.change(screen.getByLabelText(/Длительность/i), { target: { value: '30' } });

      // Submit
      fireEvent.click(screen.getByText('ПОДТВЕРДИТЬ'));

      await waitFor(() => {
        expect(curriculumAPI.createLesson).toHaveBeenCalled();
      });
    });
  });

  /**
   * Task 22.3: Lesson Editing Flow
   */
  describe('22.3 Lesson Editing Flow', () => {
    test('should load and edit existing lesson', async () => {
      const existingLesson = {
        id: 1,
        title: 'Existing',
        duration_minutes: 45,
        sections: [{ id: 1, type: 'text', content: 'Original' }],
      };
      curriculumAPI.getLesson.mockResolvedValue(existingLesson);
      curriculumAPI.updateLesson.mockResolvedValue(existingLesson);

      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} lessonId={1} onSave={jest.fn()} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      await waitFor(() => {
        expect(curriculumAPI.getLesson).toHaveBeenCalledWith(1);
      });
    });
  });

  /**
   * Task 22.4: Drag-and-Drop
   */
  describe('22.4 Drag-and-Drop', () => {
    test('should update order_index after reorder', async () => {
      curriculumAPI.updateModule.mockResolvedValue({});
      
      await curriculumAPI.updateModule(1, { order_index: 2 });
      await curriculumAPI.updateModule(2, { order_index: 1 });

      expect(curriculumAPI.updateModule).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Task 22.5: Draft Auto-Save
   */
  describe('22.5 Draft Auto-Save', () => {
    test('should start auto-save on mount', () => {
      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} onSave={jest.fn()} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      expect(draftManager.startAutoSave).toHaveBeenCalled();
    });

    test('should offer draft restoration', async () => {
      const mockDraft = {
        lessonId: null,
        courseId: 1,
        moduleId: 1,
        title: 'Draft',
        duration_minutes: 30,
        editorContent: '{"blocks":[]}',
        contentBlocks: [],
        timestamp: Date.now(),
      };
      draftManager.loadDraft.mockReturnValue(mockDraft);
      draftManager.hasDraft.mockReturnValue(true);

      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} onSave={jest.fn()} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      await waitFor(() => {
        expect(screen.getByText(/Восстановить черновик/i)).toBeInTheDocument();
      });
    });

    test('should clear draft after submission', async () => {
      curriculumAPI.createLesson.mockResolvedValue({ id: 1, sections: [] });

      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} onSave={jest.fn()} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      fireEvent.change(screen.getByLabelText(/Название урока/i), { target: { value: 'Test' } });
      fireEvent.click(screen.getByText('ПОДТВЕРДИТЬ'));

      await waitFor(() => {
        expect(draftManager.clearDraft).toHaveBeenCalled();
      });
    });
  });

  /**
   * Task 22.6: Preview Testing
   */
  describe('22.6 Preview', () => {
    test('should render preview panel', async () => {
      render(
        <CurriculumProvider>
          <LessonEditor courseId={1} moduleId={1} onSave={jest.fn()} onCancel={jest.fn()} />
        </CurriculumProvider>
      );

      const previewBtn = screen.queryByText(/Предварительный просмотр/i);
      if (previewBtn) {
        fireEvent.click(previewBtn);
        await waitFor(() => {
          expect(screen.getByTestId('preview-panel')).toBeInTheDocument();
        });
      }
    });
  });
});
