import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContentBlockEditor from './ContentBlockEditor';

describe('ContentBlockEditor', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Block Type Selection', () => {
    it('should support all content types', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const types = ['Формула', 'Изображение', 'Видео', 'Таблица'];
      types.forEach((type) => {
        expect(screen.getByText(type)).toBeInTheDocument();
      });

      // "Код" appears multiple times, so check it exists
      expect(screen.getAllByText('Код').length).toBeGreaterThan(0);
    });

    it('should change block type when type button is clicked', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const formulaButton = screen.getByText('Формула');
      fireEvent.click(formulaButton);

      expect(formulaButton).toHaveClass('active');
    });
  });

  describe('Required Fields', () => {
    it('should require title field', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const titleLabel = screen.getByText(/Название блока/);
      expect(titleLabel.querySelector('.required')).toBeInTheDocument();
    });

    it('should require content field', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const contentLabels = screen.getAllByText(/Код/);
      const contentLabel = contentLabels.find(el => el.tagName === 'LABEL');
      expect(contentLabel.querySelector('.required')).toBeInTheDocument();
    });

    it('should show error when title is empty', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('Название блока обязательно')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should show error when content is empty', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Block' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('Содержимое блока обязательно')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Optional Explanation Field', () => {
    it('should include optional explanation field', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const explanationLabel = screen.getByText(/Пояснение \(опционально\)/);
      expect(explanationLabel).toBeInTheDocument();

      const explanationField = screen.getByPlaceholderText(
        'Добавьте пояснение к блоку...'
      );
      expect(explanationField).not.toBeRequired();
    });
  });

  describe('Code Block Type', () => {
    it('should show language selector for code blocks', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      expect(screen.getByText(/Язык программирования/)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should have default language selection', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const languageSelect = screen.getByRole('combobox');
      expect(languageSelect.value).toBe('javascript');
    });
  });

  describe('Image Block Type', () => {
    it('should show URL input for image blocks', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="image"
        />
      );

      fireEvent.click(screen.getByText('Изображение'));

      expect(screen.getByText(/URL изображения/)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('https://example.com/image.png')
      ).toBeInTheDocument();
    });

    it('should validate image URL format - invalid URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="image"
        />
      );

      fireEvent.click(screen.getByText('Изображение'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Image' } });

      const urlInput = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('Введите корректный URL (должен начинаться с http:// или https://)')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate image URL format - missing image extension', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="image"
        />
      );

      fireEvent.click(screen.getByText('Изображение'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Image' } });

      const urlInput = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/notanimage' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('URL должен указывать на изображение (.jpg, .png, .gif, .webp, .svg)')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should accept valid image URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="image"
        />
      );

      fireEvent.click(screen.getByText('Изображение'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Image' } });

      const urlInput = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(urlInput, { target: { value: 'https://example.com/image.png' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'image',
          title: 'Test Image',
          content: 'https://example.com/image.png',
        })
      );
    });

    it('should prevent saving block with invalid URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="image"
        />
      );

      fireEvent.click(screen.getByText('Изображение'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Image' } });

      const urlInput = screen.getByPlaceholderText('https://example.com/image.png');
      fireEvent.change(urlInput, { target: { value: 'ftp://example.com/image.png' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Video Block Type', () => {
    it('should show URL input for video blocks', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      expect(screen.getByText(/URL видео/)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/https:\/\/youtube.com/)
      ).toBeInTheDocument();
    });

    it('should validate video URL format - invalid URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Video' } });

      const urlInput = screen.getByPlaceholderText(/https:\/\/youtube.com/);
      fireEvent.change(urlInput, { target: { value: 'not-a-url' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('Введите корректный URL (должен начинаться с http:// или https://)')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should validate video URL format - unsupported platform', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Video' } });

      const urlInput = screen.getByPlaceholderText(/https:\/\/youtube.com/);
      fireEvent.change(urlInput, { target: { value: 'https://example.com/notvideo' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(screen.getByText('URL должен быть ссылкой на YouTube, Vimeo или видео файл (.mp4, .webm, .ogg)')).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('should accept valid YouTube URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Video' } });

      const urlInput = screen.getByPlaceholderText(/https:\/\/youtube.com/);
      fireEvent.change(urlInput, { target: { value: 'https://youtube.com/watch?v=abc123' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'video',
          title: 'Test Video',
          content: 'https://youtube.com/watch?v=abc123',
        })
      );
    });

    it('should accept valid Vimeo URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Video' } });

      const urlInput = screen.getByPlaceholderText(/https:\/\/youtube.com/);
      fireEvent.change(urlInput, { target: { value: 'https://vimeo.com/123456' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'video',
          title: 'Test Video',
          content: 'https://vimeo.com/123456',
        })
      );
    });

    it('should accept direct video file URL', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="video"
        />
      );

      fireEvent.click(screen.getByText('Видео'));

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Video' } });

      const urlInput = screen.getByPlaceholderText(/https:\/\/youtube.com/);
      fireEvent.change(urlInput, { target: { value: 'https://example.com/video.mp4' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'video',
          title: 'Test Video',
          content: 'https://example.com/video.mp4',
        })
      );
    });
  });

  describe('Formula Block Type', () => {
    it('should show LaTeX textarea for formula blocks', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="formula"
        />
      );

      fireEvent.click(screen.getByText('Формула'));

      expect(screen.getByText(/Формула \(LaTeX\)/)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Например: E = mc\^2/)
      ).toBeInTheDocument();
    });
  });

  describe('Save and Cancel', () => {
    it('should call onSave with correct data when valid', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const titleInput = screen.getByPlaceholderText('Введите название блока');
      fireEvent.change(titleInput, { target: { value: 'Test Code Block' } });

      const codeInput = screen.getByPlaceholderText('Введите код...');
      fireEvent.change(codeInput, { target: { value: 'console.log("test");' } });

      const saveButton = screen.getByText('Сохранить');
      fireEvent.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'code',
          title: 'Test Code Block',
          content: 'console.log("test");',
          language: 'javascript',
        })
      );
    });

    it('should call onCancel when cancel button is clicked', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const cancelButton = screen.getByText('Отмена');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should call onCancel when close button is clicked', () => {
      render(
        <ContentBlockEditor
          block={null}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          initialType="code"
        />
      );

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Edit Existing Block', () => {
    it('should populate fields when editing existing block', () => {
      const existingBlock = {
        id: 'block-123',
        type: 'code',
        title: 'Existing Block',
        content: 'const x = 10;',
        language: 'javascript',
        explanation: 'This is a test',
      };

      render(
        <ContentBlockEditor
          block={existingBlock}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByDisplayValue('Existing Block')).toBeInTheDocument();
      expect(screen.getByDisplayValue('const x = 10;')).toBeInTheDocument();
      expect(screen.getByDisplayValue('This is a test')).toBeInTheDocument();
    });
  });
});
