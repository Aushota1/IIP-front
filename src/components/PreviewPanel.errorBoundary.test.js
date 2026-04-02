import React from 'react';
import { render, screen } from '@testing-library/react';
import PreviewPanel from './PreviewPanel';

// Mock FormulaBlock to throw an error for testing
jest.mock('./FormulaBlock', () => {
  return function FormulaBlock({ formula }) {
    if (formula === 'THROW_ERROR') {
      throw new Error('Formula rendering failed');
    }
    return <div>Formula: {formula}</div>;
  };
});

describe('PreviewPanel ErrorBoundary', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Suppress console.error for error boundary tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('shows raw JSON fallback when rendering error occurs', () => {
    const sections = [
      {
        id: 1,
        type: 'text',
        content: 'Test content'
      },
      {
        id: 2,
        type: 'formula',
        content: 'THROW_ERROR', // This will trigger the error
        title: 'Test Formula'
      }
    ];

    render(<PreviewPanel sections={sections} onClose={mockOnClose} />);

    // Should show error fallback header
    expect(screen.getByText('Ошибка отображения предварительного просмотра')).toBeInTheDocument();
    expect(screen.getByText(/Не удалось отобразить контент урока/)).toBeInTheDocument();
    
    // Should show raw JSON - check for key parts of the JSON
    expect(screen.getByText(/"type": "text"/)).toBeInTheDocument();
    expect(screen.getByText(/"content": "Test content"/)).toBeInTheDocument();
    expect(screen.getByText(/"type": "formula"/)).toBeInTheDocument();
  });

  test('renders normally when no error occurs', () => {
    const sections = [
      {
        id: 1,
        type: 'text',
        content: 'Test content'
      },
      {
        id: 2,
        type: 'formula',
        content: 'E = mc^2',
        title: 'Einstein Formula'
      }
    ];

    render(<PreviewPanel sections={sections} onClose={mockOnClose} />);

    // Should render normally without error fallback
    expect(screen.queryByText('Ошибка отображения предварительного просмотра')).not.toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByText('Einstein Formula')).toBeInTheDocument();
  });

  test('error fallback includes all section data in JSON', () => {
    const sections = [
      {
        id: 1,
        type: 'text',
        content: 'First section'
      },
      {
        id: 2,
        type: 'formula',
        content: 'THROW_ERROR'
      },
      {
        id: 3,
        type: 'code',
        language: 'python',
        content: 'print("hello")'
      }
    ];

    render(<PreviewPanel sections={sections} onClose={mockOnClose} />);

    // Verify specific section data is visible in the JSON
    expect(screen.getByText(/"type": "text"/)).toBeInTheDocument();
    expect(screen.getByText(/"content": "First section"/)).toBeInTheDocument();
    expect(screen.getByText(/"language": "python"/)).toBeInTheDocument();
    expect(screen.getByText(/"content": "print\(\\"hello\\"\)"/)).toBeInTheDocument();
  });
});
