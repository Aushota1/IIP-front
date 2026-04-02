import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorState } from 'draft-js';
import EditorToolbar from './EditorToolbar';

/**
 * Unit tests for EditorToolbar component
 * 
 * Tests cover:
 * - Toolbar button rendering
 * - Active state indication
 * - Click handlers for formatting
 * - Content block insertion
 */

describe('EditorToolbar', () => {
  let mockEditorState;
  let mockOnToggleInlineStyle;
  let mockOnToggleBlockType;
  let mockOnInsertContentBlock;
  let mockGetCurrentInlineStyle;
  let mockGetCurrentBlockType;

  beforeEach(() => {
    mockEditorState = EditorState.createEmpty();
    mockOnToggleInlineStyle = jest.fn();
    mockOnToggleBlockType = jest.fn();
    mockOnInsertContentBlock = jest.fn();
    
    // Mock style getters
    mockGetCurrentInlineStyle = jest.fn(() => new Set());
    mockGetCurrentBlockType = jest.fn(() => 'unstyled');
  });

  /**
   * Validates: Requirements 4.2, 5.1
   * Test that all toolbar buttons are rendered
   */
  it('should render all toolbar buttons', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    // Header buttons
    expect(screen.getByTitle('Заголовок 1')).toBeInTheDocument();
    expect(screen.getByTitle('Заголовок 2')).toBeInTheDocument();
    expect(screen.getByTitle('Заголовок 3')).toBeInTheDocument();

    // Inline style buttons
    expect(screen.getByTitle('Жирный')).toBeInTheDocument();
    expect(screen.getByTitle('Курсив')).toBeInTheDocument();
    expect(screen.getByTitle('Подчеркнутый')).toBeInTheDocument();

    // List buttons
    expect(screen.getByTitle('Маркированный список')).toBeInTheDocument();
    expect(screen.getByTitle('Нумерованный список')).toBeInTheDocument();

    // Content block buttons
    expect(screen.getByTitle('Вставить формулу')).toBeInTheDocument();
    expect(screen.getByTitle('Вставить код')).toBeInTheDocument();
    expect(screen.getByTitle('Вставить изображение')).toBeInTheDocument();
    expect(screen.getByTitle('Вставить видео')).toBeInTheDocument();
  });

  /**
   * Validates: Requirements 4.2
   * Test that clicking header buttons triggers block type toggle
   */
  it('should toggle block type when header buttons are clicked', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    // Test H1 button
    const h1Button = screen.getByTitle('Заголовок 1');
    fireEvent.mouseDown(h1Button);
    expect(mockOnToggleBlockType).toHaveBeenCalledWith('header-one');

    // Test H2 button
    mockOnToggleBlockType.mockClear();
    const h2Button = screen.getByTitle('Заголовок 2');
    fireEvent.mouseDown(h2Button);
    expect(mockOnToggleBlockType).toHaveBeenCalledWith('header-two');

    // Test H3 button
    mockOnToggleBlockType.mockClear();
    const h3Button = screen.getByTitle('Заголовок 3');
    fireEvent.mouseDown(h3Button);
    expect(mockOnToggleBlockType).toHaveBeenCalledWith('header-three');
  });

  /**
   * Validates: Requirements 4.2
   * Test that clicking inline style buttons triggers style toggle
   */
  it('should toggle inline style when formatting buttons are clicked', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    // Test Bold button
    const boldButton = screen.getByTitle('Жирный');
    fireEvent.mouseDown(boldButton);
    expect(mockOnToggleInlineStyle).toHaveBeenCalledWith('BOLD');

    // Test Italic button
    mockOnToggleInlineStyle.mockClear();
    const italicButton = screen.getByTitle('Курсив');
    fireEvent.mouseDown(italicButton);
    expect(mockOnToggleInlineStyle).toHaveBeenCalledWith('ITALIC');

    // Test Underline button
    mockOnToggleInlineStyle.mockClear();
    const underlineButton = screen.getByTitle('Подчеркнутый');
    fireEvent.mouseDown(underlineButton);
    expect(mockOnToggleInlineStyle).toHaveBeenCalledWith('UNDERLINE');
  });

  /**
   * Validates: Requirements 4.2
   * Test that clicking list buttons triggers block type toggle
   */
  it('should toggle list type when list buttons are clicked', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    // Test unordered list button
    const ulButton = screen.getByTitle('Маркированный список');
    fireEvent.mouseDown(ulButton);
    expect(mockOnToggleBlockType).toHaveBeenCalledWith('unordered-list-item');

    // Test ordered list button
    mockOnToggleBlockType.mockClear();
    const olButton = screen.getByTitle('Нумерованный список');
    fireEvent.mouseDown(olButton);
    expect(mockOnToggleBlockType).toHaveBeenCalledWith('ordered-list-item');
  });

  /**
   * Validates: Requirements 5.1
   * Test that clicking content block buttons triggers insertion
   */
  it('should insert content block when content block buttons are clicked', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    // Test formula button
    const formulaButton = screen.getByTitle('Вставить формулу');
    fireEvent.mouseDown(formulaButton);
    expect(mockOnInsertContentBlock).toHaveBeenCalledWith('formula');

    // Test code button
    mockOnInsertContentBlock.mockClear();
    const codeButton = screen.getByTitle('Вставить код');
    fireEvent.mouseDown(codeButton);
    expect(mockOnInsertContentBlock).toHaveBeenCalledWith('code');

    // Test image button
    mockOnInsertContentBlock.mockClear();
    const imageButton = screen.getByTitle('Вставить изображение');
    fireEvent.mouseDown(imageButton);
    expect(mockOnInsertContentBlock).toHaveBeenCalledWith('image');

    // Test video button
    mockOnInsertContentBlock.mockClear();
    const videoButton = screen.getByTitle('Вставить видео');
    fireEvent.mouseDown(videoButton);
    expect(mockOnInsertContentBlock).toHaveBeenCalledWith('video');
  });

  /**
   * Validates: Requirements 4.2
   * Test that active inline styles are indicated visually
   */
  it('should show active state for inline styles', () => {
    // Mock active BOLD style
    mockGetCurrentInlineStyle = jest.fn(() => new Set(['BOLD']));

    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    const boldButton = screen.getByTitle('Жирный');
    expect(boldButton).toHaveClass('active');

    const italicButton = screen.getByTitle('Курсив');
    expect(italicButton).not.toHaveClass('active');
  });

  /**
   * Validates: Requirements 4.2
   * Test that active block type is indicated visually
   */
  it('should show active state for block types', () => {
    // Mock active header-one block type
    mockGetCurrentBlockType = jest.fn(() => 'header-one');

    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    const h1Button = screen.getByTitle('Заголовок 1');
    expect(h1Button).toHaveClass('active');

    const h2Button = screen.getByTitle('Заголовок 2');
    expect(h2Button).not.toHaveClass('active');
  });

  /**
   * Validates: Requirements 4.2
   * Test that multiple inline styles can be active simultaneously
   */
  it('should show multiple active inline styles', () => {
    // Mock multiple active styles
    mockGetCurrentInlineStyle = jest.fn(() => new Set(['BOLD', 'ITALIC', 'UNDERLINE']));

    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    expect(screen.getByTitle('Жирный')).toHaveClass('active');
    expect(screen.getByTitle('Курсив')).toHaveClass('active');
    expect(screen.getByTitle('Подчеркнутый')).toHaveClass('active');
  });

  /**
   * Validates: Requirements 4.2
   * Test that preventDefault is called on button clicks
   */
  it('should prevent default behavior on button clicks', () => {
    render(
      <EditorToolbar
        editorState={mockEditorState}
        onToggleInlineStyle={mockOnToggleInlineStyle}
        onToggleBlockType={mockOnToggleBlockType}
        onInsertContentBlock={mockOnInsertContentBlock}
        getCurrentInlineStyle={mockGetCurrentInlineStyle}
        getCurrentBlockType={mockGetCurrentBlockType}
      />
    );

    const boldButton = screen.getByTitle('Жирный');
    const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');
    
    boldButton.dispatchEvent(event);
    
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
