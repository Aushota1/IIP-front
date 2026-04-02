import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageBlockEditor from './ImageBlockEditor';

describe('ImageBlockEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL Input', () => {
    it('should render URL input field', () => {
      render(<ImageBlockEditor url="" onChange={mockOnChange} error="" />);

      expect(screen.getByLabelText(/URL изображения/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('https://example.com/image.png')).toBeInTheDocument();
    });

    it('should display current URL value', () => {
      render(
        <ImageBlockEditor
          url="https://example.com/test.png"
          onChange={mockOnChange}
          error=""
        />
      );

      expect(screen.getByDisplayValue('https://example.com/test.png')).toBeInTheDocument();
    });

    it('should call onChange when URL is modified', () => {
      render(<ImageBlockEditor url="" onChange={mockOnChange} error="" />);

      const input = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(input, { target: { value: 'https://example.com/new.png' } });

      expect(mockOnChange).toHaveBeenCalledWith('https://example.com/new.png');
    });

    it('should display error message when error prop is provided', () => {
      render(
        <ImageBlockEditor
          url="invalid"
          onChange={mockOnChange}
          error="Введите корректный URL"
        />
      );

      expect(screen.getByText('Введите корректный URL')).toBeInTheDocument();
    });

    it('should apply error class to input when error exists', () => {
      render(
        <ImageBlockEditor
          url="invalid"
          onChange={mockOnChange}
          error="Введите корректный URL"
        />
      );

      const input = screen.getByPlaceholderText('https://example.com/image.png');
      expect(input).toHaveClass('error');
    });
  });

  describe('Image Preview', () => {
    it('should show loading placeholder initially when URL is provided', () => {
      render(
        <ImageBlockEditor
          url="https://example.com/test.png"
          onChange={mockOnChange}
          error=""
        />
      );

      expect(screen.getByText('Загрузка изображения...')).toBeInTheDocument();
    });

    it('should not show preview when URL is empty', () => {
      render(<ImageBlockEditor url="" onChange={mockOnChange} error="" />);

      expect(screen.queryByText('Предварительный просмотр:')).not.toBeInTheDocument();
    });

    it('should display image when loaded successfully', async () => {
      render(
        <ImageBlockEditor
          url="https://example.com/test.png"
          onChange={mockOnChange}
          error=""
        />
      );

      const img = screen.getByAltText('Предварительный просмотр');
      
      // Simulate successful image load
      fireEvent.load(img);

      await waitFor(() => {
        expect(img).toHaveStyle({ display: 'block' });
      });

      expect(screen.queryByText('Загрузка изображения...')).not.toBeInTheDocument();
    });

    it('should display error placeholder when image fails to load', async () => {
      render(
        <ImageBlockEditor
          url="https://example.com/broken.png"
          onChange={mockOnChange}
          error=""
        />
      );

      const img = screen.getByAltText('Предварительный просмотр');
      
      // Simulate image load error
      fireEvent.error(img);

      await waitFor(() => {
        expect(screen.getByText('Не удалось загрузить изображение. Проверьте URL.')).toBeInTheDocument();
      });

      expect(screen.queryByText('Загрузка изображения...')).not.toBeInTheDocument();
    });

    it('should reset loading state when URL changes via input', () => {
      render(
        <ImageBlockEditor
          url="https://example.com/test1.png"
          onChange={mockOnChange}
          error=""
        />
      );

      const img = screen.getByAltText('Предварительный просмотр');
      fireEvent.load(img);

      // Change URL via input
      const input = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(input, { target: { value: 'https://example.com/test2.png' } });

      // Should show loading again
      expect(screen.getByText('Загрузка изображения...')).toBeInTheDocument();
    });
  });

  describe('Help Section', () => {
    it('should display recommendations', () => {
      render(<ImageBlockEditor url="" onChange={mockOnChange} error="" />);

      expect(screen.getByText('Рекомендации:')).toBeInTheDocument();
      expect(screen.getByText(/Используйте прямые ссылки на изображения/)).toBeInTheDocument();
      expect(screen.getByText(/Убедитесь, что изображение доступно по ссылке/)).toBeInTheDocument();
      expect(screen.getByText(/Рекомендуемый размер: не более 2MB/)).toBeInTheDocument();
    });
  });
});
