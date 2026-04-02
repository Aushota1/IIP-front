import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModulesList from './ModulesList';

// Mock ModuleItem component
jest.mock('./ModuleItem', () => {
  return function MockModuleItem({ module, isExpanded, onToggle }) {
    return (
      <div data-testid={`module-${module.id}`}>
        <span>{module.title}</span>
        <span>{module.order_index}</span>
        <button onClick={onToggle}>Toggle</button>
      </div>
    );
  };
});

describe('ModulesList', () => {
  const mockModules = [
    { id: 1, title: 'Module 1', order_index: 1 },
    { id: 2, title: 'Module 2', order_index: 2 },
    { id: 3, title: 'Module 3', order_index: 3 },
  ];

  const defaultProps = {
    courseId: 1,
    modules: mockModules,
    onModuleCreate: jest.fn(),
    onModuleUpdate: jest.fn(),
    onModuleDelete: jest.fn(),
    creating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display modules count in header', () => {
    render(<ModulesList {...defaultProps} />);
    expect(screen.getByText('Модули (3)')).toBeInTheDocument();
  });

  it('should display "Создать модуль" button', () => {
    render(<ModulesList {...defaultProps} />);
    expect(screen.getByText('+ Создать модуль')).toBeInTheDocument();
  });

  it('should call onModuleCreate when create button is clicked', () => {
    render(<ModulesList {...defaultProps} />);
    fireEvent.click(screen.getByText('+ Создать модуль'));
    expect(defaultProps.onModuleCreate).toHaveBeenCalledTimes(1);
  });

  it('should disable create button when creating is true', () => {
    render(<ModulesList {...defaultProps} creating={true} />);
    const button = screen.getByText('Создание...');
    expect(button).toBeDisabled();
  });

  it('should display modules in order_index order', () => {
    const unorderedModules = [
      { id: 3, title: 'Module 3', order_index: 3 },
      { id: 1, title: 'Module 1', order_index: 1 },
      { id: 2, title: 'Module 2', order_index: 2 },
    ];

    render(<ModulesList {...defaultProps} modules={unorderedModules} />);

    const moduleElements = screen.getAllByTestId(/module-/);
    expect(moduleElements[0]).toHaveAttribute('data-testid', 'module-1');
    expect(moduleElements[1]).toHaveAttribute('data-testid', 'module-2');
    expect(moduleElements[2]).toHaveAttribute('data-testid', 'module-3');
  });

  it('should toggle module expansion when toggle button is clicked', () => {
    render(<ModulesList {...defaultProps} />);
    
    const toggleButtons = screen.getAllByText('Toggle');
    
    // Initially not expanded
    fireEvent.click(toggleButtons[0]);
    
    // Click again to collapse
    fireEvent.click(toggleButtons[0]);
  });

  it('should handle multiple modules being expanded simultaneously', () => {
    render(<ModulesList {...defaultProps} />);
    
    const toggleButtons = screen.getAllByText('Toggle');
    
    // Expand first module
    fireEvent.click(toggleButtons[0]);
    
    // Expand second module
    fireEvent.click(toggleButtons[1]);
    
    // Both should be expanded (no errors)
  });
});
