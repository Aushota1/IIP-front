import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl } from 'react-icons/fa';
import { MdTitle, MdCode, MdImage, MdVideoLibrary } from 'react-icons/md';
import { BiMath } from 'react-icons/bi';

/**
 * EditorToolbar - Toolbar for rich text editor with formatting controls
 * 
 * Features:
 * - Inline styles: Bold, Italic, Underline
 * - Block types: H1, H2, H3, Unordered List, Ordered List
 * - Content blocks: Formula, Code, Image, Video
 * - Active state indication based on current selection
 * 
 * @param {Object} props
 * @param {EditorState} props.editorState - Draft.js editor state
 * @param {Function} props.onToggleInlineStyle - Toggle inline style callback
 * @param {Function} props.onToggleBlockType - Toggle block type callback
 * @param {Function} props.onInsertContentBlock - Insert content block callback
 * @param {Function} props.getCurrentInlineStyle - Get current inline style
 * @param {Function} props.getCurrentBlockType - Get current block type
 */
const EditorToolbar = ({
  editorState,
  onToggleInlineStyle,
  onToggleBlockType,
  onInsertContentBlock,
  getCurrentInlineStyle,
  getCurrentBlockType,
}) => {
  const currentStyle = getCurrentInlineStyle();
  const currentBlockType = getCurrentBlockType();

  /**
   * Check if inline style is active
   * @param {string} style - Style name
   * @returns {boolean}
   */
  const isInlineStyleActive = (style) => {
    return currentStyle.has(style);
  };

  /**
   * Check if block type is active
   * @param {string} blockType - Block type name
   * @returns {boolean}
   */
  const isBlockTypeActive = (blockType) => {
    return currentBlockType === blockType;
  };

  /**
   * Handle inline style button click
   * @param {MouseEvent} e - Click event
   * @param {string} style - Style name
   */
  const handleInlineStyleClick = (e, style) => {
    e.preventDefault();
    onToggleInlineStyle(style);
  };

  /**
   * Handle block type button click
   * @param {MouseEvent} e - Click event
   * @param {string} blockType - Block type name
   */
  const handleBlockTypeClick = (e, blockType) => {
    e.preventDefault();
    onToggleBlockType(blockType);
  };

  /**
   * Handle content block insertion
   * @param {MouseEvent} e - Click event
   * @param {string} blockType - Content block type
   */
  const handleContentBlockClick = (e, blockType) => {
    e.preventDefault();
    onInsertContentBlock(blockType);
  };

  return (
    <div className="editor-toolbar">
      {/* Block Type Controls */}
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isBlockTypeActive('header-one') ? 'active' : ''}`}
          onMouseDown={(e) => handleBlockTypeClick(e, 'header-one')}
          title="Заголовок 1"
          type="button"
        >
          <MdTitle />
          <span className="button-label">H1</span>
        </button>

        <button
          className={`toolbar-button ${isBlockTypeActive('header-two') ? 'active' : ''}`}
          onMouseDown={(e) => handleBlockTypeClick(e, 'header-two')}
          title="Заголовок 2"
          type="button"
        >
          <MdTitle />
          <span className="button-label">H2</span>
        </button>

        <button
          className={`toolbar-button ${isBlockTypeActive('header-three') ? 'active' : ''}`}
          onMouseDown={(e) => handleBlockTypeClick(e, 'header-three')}
          title="Заголовок 3"
          type="button"
        >
          <MdTitle />
          <span className="button-label">H3</span>
        </button>
      </div>

      <div className="toolbar-divider"></div>

      {/* Inline Style Controls */}
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isInlineStyleActive('BOLD') ? 'active' : ''}`}
          onMouseDown={(e) => handleInlineStyleClick(e, 'BOLD')}
          title="Жирный"
          type="button"
        >
          <FaBold />
        </button>

        <button
          className={`toolbar-button ${isInlineStyleActive('ITALIC') ? 'active' : ''}`}
          onMouseDown={(e) => handleInlineStyleClick(e, 'ITALIC')}
          title="Курсив"
          type="button"
        >
          <FaItalic />
        </button>

        <button
          className={`toolbar-button ${isInlineStyleActive('UNDERLINE') ? 'active' : ''}`}
          onMouseDown={(e) => handleInlineStyleClick(e, 'UNDERLINE')}
          title="Подчеркнутый"
          type="button"
        >
          <FaUnderline />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      {/* List Controls */}
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isBlockTypeActive('unordered-list-item') ? 'active' : ''}`}
          onMouseDown={(e) => handleBlockTypeClick(e, 'unordered-list-item')}
          title="Маркированный список"
          type="button"
        >
          <FaListUl />
        </button>

        <button
          className={`toolbar-button ${isBlockTypeActive('ordered-list-item') ? 'active' : ''}`}
          onMouseDown={(e) => handleBlockTypeClick(e, 'ordered-list-item')}
          title="Нумерованный список"
          type="button"
        >
          <FaListOl />
        </button>
      </div>

      <div className="toolbar-divider"></div>

      {/* Content Block Controls */}
      <div className="toolbar-group">
        <button
          className="toolbar-button content-block-button"
          onMouseDown={(e) => handleContentBlockClick(e, 'formula')}
          title="Вставить формулу"
          type="button"
        >
          <BiMath />
          <span className="button-label">Формула</span>
        </button>

        <button
          className="toolbar-button content-block-button"
          onMouseDown={(e) => handleContentBlockClick(e, 'code')}
          title="Вставить код"
          type="button"
        >
          <MdCode />
          <span className="button-label">Код</span>
        </button>

        <button
          className="toolbar-button content-block-button"
          onMouseDown={(e) => handleContentBlockClick(e, 'image')}
          title="Вставить изображение"
          type="button"
        >
          <MdImage />
          <span className="button-label">Изображение</span>
        </button>

        <button
          className="toolbar-button content-block-button"
          onMouseDown={(e) => handleContentBlockClick(e, 'video')}
          title="Вставить видео"
          type="button"
        >
          <MdVideoLibrary />
          <span className="button-label">Видео</span>
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
