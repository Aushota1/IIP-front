import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ModuleItem from './ModuleItem';
import { curriculumAPI } from '../services/curriculum';

// Mock curriculum API
jest.mock('../services/curriculum', () => ({
  curriculumAPI: {
    getLessons: jest.fn(),
    createLesson: jest.fn(),
  },
}));

describe('ModuleItem', () => {
  const mockModule = {
    id: 1,
    title: 'Test Module',
    order_index: 1,
  };

  const mockLessons = [
    { id: 1, title: 'Lesson 1', order_index: 1, duration_minutes: 30 },
    { id: 2, title: 'Lesson 2', order_index: 2, duration_minutes: 45 },
  ];

  const defaultProps = {
    module: mockModule,
    courseId: 1,
    isExpanded: false,
    onToggle: jest.fn(),
    onUpdate: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    curriculumAPI.getLessons.mockResolvedValue(mockLessons);
    curriculumAPI.createLesson.mockResolvedValue({
      id: 3,
      title: 'Урок 3',
      order_index: 3,
      duration_minutes: 30,
    });
  });

  it('should display module title and order_index', () => {
    render(<ModuleItem {...defaultProps} />);
    expect(screen.getByText('Test Module')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    render(<ModuleItem {...defaultProps} />);
    expect(screen.getByText('Редактировать')).toBeInTheDocument();
    expect(screen.getByText('Удалить')).toBeInTheDocument();
  });

  it('should call onToggle when toggle button is clicked', () => {
    render(<ModuleItem {...defaultProps} />);
    const toggleButton = screen.getByLabelText('Развернуть модуль');
    fireEvent.click(toggleButton);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should load lessons when expanded', async () => {
    const { rerender } = render(<ModuleItem {...defaultProps} />);
    
    // Expand module
    rerender(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(curriculumAPI.getLessons).toHaveBeenCalledWith(1, 1);
    });
  });

  it('should display lessons when expanded and loaded', async () => {
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Lesson 1')).toBeInTheDocument();
      expect(screen.getByText('Lesson 2')).toBeInTheDocument();
      expect(screen.getByText('30 мин')).toBeInTheDocument();
      expect(screen.getByText('45 мин')).toBeInTheDocument();
    });
  });

  it('should display lessons in order_index order', async () => {
    const unorderedLessons = [
      { id: 2, title: 'Lesson 2', order_index: 2, duration_minutes: 45 },
      { id: 1, title: 'Lesson 1', order_index: 1, duration_minutes: 30 },
    ];
    curriculumAPI.getLessons.mockResolvedValue(unorderedLessons);

    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      const lessonTitles = screen.getAllByText(/Lesson/);
      expect(lessonTitles[0]).toHaveTextContent('Lesson 1');
      expect(lessonTitles[1]).toHaveTextContent('Lesson 2');
    });
  });

  it('should display "Создать урок" button when expanded', async () => {
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('+ Создать урок')).toBeInTheDocument();
    });
  });

  it('should create lesson with correct order_index', async () => {
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('+ Создать урок')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('+ Создать урок'));

    await waitFor(() => {
      expect(curriculumAPI.createLesson).toHaveBeenCalledWith(
        1,
        1,
        expect.objectContaining({
          title: 'Урок 3',
          order_index: 3,
          duration_minutes: 30,
          sections: [],
        })
      );
    });
  });

  it('should display empty state when module has no lessons', async () => {
    curriculumAPI.getLessons.mockResolvedValue([]);
    
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('У этого модуля пока нет уроков')).toBeInTheDocument();
    });
  });

  it('should display error message when lessons fail to load', async () => {
    curriculumAPI.getLessons.mockRejectedValue(new Error('Network error'));
    
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should allow editing module title', async () => {
    render(<ModuleItem {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Редактировать'));
    
    const input = screen.getByDisplayValue('Test Module');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'Updated Module' } });
    fireEvent.blur(input);
    
    await waitFor(() => {
      expect(defaultProps.onUpdate).toHaveBeenCalledWith(1, { title: 'Updated Module' });
    });
  });

  it('should show confirmation dialog when deleting module with lessons', async () => {
    window.confirm = jest.fn(() => true);
    
    render(<ModuleItem {...defaultProps} isExpanded={true} />);
    
    await waitFor(() => {
      expect(screen.getByText('Lesson 1')).toBeInTheDocument();
    });

    // Get the module delete button (first one in the module-actions div)
    const moduleDeleteButton = screen.getAllByText('Удалить')[0];
    fireEvent.click(moduleDeleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Все уроки (2) будут удалены')
    );
    expect(defaultProps.onDelete).toHaveBeenCalledWith(1);
  });

  it('should show confirmation dialog when deleting module without lessons', () => {
    window.confirm = jest.fn(() => true);
    
    render(<ModuleItem {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Удалить'));
    
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Вы уверены, что хотите удалить модуль "Test Module"?')
    );
    expect(defaultProps.onDelete).toHaveBeenCalledWith(1);
  });

  it('should not delete module if confirmation is cancelled', () => {
    window.confirm = jest.fn(() => false);
    
    render(<ModuleItem {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Удалить'));
    
    expect(window.confirm).toHaveBeenCalled();
    expect(defaultProps.onDelete).not.toHaveBeenCalled();
  });
});
