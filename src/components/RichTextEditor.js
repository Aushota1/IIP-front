import React, { useRef, useEffect, useState } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, Modifier, SelectionState } from 'draft-js';
import EditorToolbar from './EditorToolbar';
import ContentBlockEditor from './ContentBlockEditor';

/**
 * RichTextEditor - Rich text editor component using Draft.js
 * 
 * Features:
 * - Text formatting (bold, italic, underline)
 * - Block types (headers, lists)
 * - Content block insertion (formula, code, image, video)
 * - Maintains cursor position during formatting
 * 
 * @param {Object} props
 * @param {EditorState} props.editorState - Draft.js editor state
 * @param {Function} props.onChange - Callback when editor state changes
 * @param {Array} props.contentBlocks - Array of content blocks
 * @param {Function} props.onContentBlocksChange - Callback when content blocks change
 * @param {string} props.placeholder - Placeholder text
 */
const RichTextEditor = ({
  editorState,
  onChange,
  contentBlocks = [],
  onContentBlocksChange,
  placeholder = 'Начните вводить текст урока...',
}) => {
  const editorRef = useRef(null);
  const [showBlockEditor, setShowBlockEditor] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [blockTypeToInsert, setBlockTypeToInsert] = useState('code');

  /**
   * Focus editor on mount
   */
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  /**
   * Handle keyboard commands
   * @param {string} command - Keyboard command
   * @returns {string} - 'handled' or 'not-handled'
   */
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      onChange(newState);
      return 'handled';
    }

    return 'not-handled';
  };

  /**
   * Handle return key press
   * Ensures that pressing Enter after a content block marker creates a new editable block
   */
  const handleReturn = (e, editorState) => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const currentBlock = content.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();
    
    // Check if current block is a content block marker
    const isMarkerBlock = blockText.match(/^БЛОК!!!\s*\[(\w+)\]\s*(.+)$/);
    
    if (isMarkerBlock) {
      // Split the block to create a new editable block after the marker
      const newContentState = Modifier.splitBlock(content, selection);
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        'split-block'
      );
      onChange(newEditorState);
      return 'handled';
    }
    
    return 'not-handled';
  };

  /**
   * Map keyboard shortcuts to commands
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {string|null} - Command name or null
   */
  const keyBindingFn = (e) => {
    return getDefaultKeyBinding(e);
  };

  /**
   * Toggle inline style (Bold, Italic, Underline)
   * @param {string} style - Inline style name
   */
  const toggleInlineStyle = (style) => {
    onChange(RichUtils.toggleInlineStyle(editorState, style));
  };

  /**
   * Toggle block type (Headers, Lists)
   * @param {string} blockType - Block type name
   */
  const toggleBlockType = (blockType) => {
    onChange(RichUtils.toggleBlockType(editorState, blockType));
  };

  /**
   * Get current inline style
   * @returns {DraftInlineStyle} - Current inline style
   */
  const getCurrentInlineStyle = () => {
    return editorState.getCurrentInlineStyle();
  };

  /**
   * Get current block type
   * @returns {string} - Current block type
   */
  const getCurrentBlockType = () => {
    const selection = editorState.getSelection();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());
    return block.getType();
  };

  /**
   * Handle content block insertion request
   * @param {string} blockType - Type of block to insert
   */
  const handleInsertContentBlock = (blockType) => {
    setBlockTypeToInsert(blockType);
    setEditingBlock(null);
    setShowBlockEditor(true);
  };

  /**
   * Handle content block save
   * @param {Object} blockData - Block data from editor
   */
  const handleBlockSave = (blockData) => {
    // Add or update block in contentBlocks array
    let updatedBlocks;
    if (editingBlock) {
      updatedBlocks = contentBlocks.map((block) =>
        block.id === blockData.id ? blockData : block
      );
    } else {
      updatedBlocks = [...contentBlocks, blockData];
    }

    if (onContentBlocksChange) {
      onContentBlocksChange(updatedBlocks);
    }

    // Insert marker into editor
    if (!editingBlock) {
      insertBlockMarker(blockData);
    }

    setShowBlockEditor(false);
    setEditingBlock(null);
  };

  /**
   * Insert block marker into editor
   * @param {Object} blockData - Block data
   */
  const insertBlockMarker = (blockData) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // Create marker text
    const markerText = `БЛОК!!! [${blockData.type}] ${blockData.title}`;

    // Insert marker
    let newContentState = Modifier.insertText(
      contentState,
      selection,
      markerText,
      null
    );

    // Add a new line after the marker to allow cursor placement
    const blockMap = newContentState.getBlockMap();
    const blockArray = blockMap.toArray();
    const lastBlock = blockArray[blockArray.length - 1];
    
    // Check if the marker was inserted at the end or if it's the last block
    const selectionAfterInsert = newContentState.getSelectionAfter();
    const currentBlock = newContentState.getBlockForKey(selectionAfterInsert.getStartKey());
    const nextBlock = newContentState.getBlockAfter(currentBlock.getKey());
    
    // If there's no block after the current one, or if we're at the end of the current block,
    // insert a new empty block
    if (!nextBlock || selectionAfterInsert.getStartOffset() === currentBlock.getLength()) {
      newContentState = Modifier.splitBlock(newContentState, selectionAfterInsert);
    }

    // Create new editor state and move cursor to the new line
    let newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );

    // Move selection to the new empty block after the marker
    const newSelection = newContentState.getSelectionAfter();
    newEditorState = EditorState.forceSelection(newEditorState, newSelection);

    onChange(newEditorState);
  };

  /**
   * Handle block editor cancel
   */
  const handleBlockCancel = () => {
    setShowBlockEditor(false);
    setEditingBlock(null);
  };

  /**
   * Custom block renderer for content block markers
   */
  const blockRendererFn = (contentBlock) => {
    const text = contentBlock.getText();
    
    // Check if this block is a content block marker
    const markerMatch = text.match(/^БЛОК!!!\s*\[(\w+)\]\s*(.+)$/);
    
    if (markerMatch) {
      const [, blockType, blockTitle] = markerMatch;
      
      return {
        component: ContentBlockMarker,
        editable: false,
        props: {
          blockType,
          blockTitle,
          onEdit: () => handleEditBlockMarker(text, contentBlock.getKey()),
        },
      };
    }
    
    return null;
  };

  /**
   * Handle editing a content block marker
   */
  const handleEditBlockMarker = (markerText, blockKey) => {
    // Parse marker text to find the block
    const markerMatch = markerText.match(/^БЛОК!!!\s*\[(\w+)\]\s*(.+)$/);
    
    if (markerMatch) {
      const [, blockType, blockTitle] = markerMatch;
      
      // Find the corresponding content block
      const block = contentBlocks.find(
        (b) => b.type === blockType && b.title === blockTitle
      );
      
      if (block) {
        setEditingBlock(block);
        setBlockTypeToInsert(blockType);
        setShowBlockEditor(true);
      }
    }
  };

  return (
    <div className="rich-text-editor">
      <EditorToolbar
        editorState={editorState}
        onToggleInlineStyle={toggleInlineStyle}
        onToggleBlockType={toggleBlockType}
        onInsertContentBlock={handleInsertContentBlock}
        getCurrentInlineStyle={getCurrentInlineStyle}
        getCurrentBlockType={getCurrentBlockType}
      />
      
      <div className="editor-container">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={onChange}
          handleKeyCommand={handleKeyCommand}
          handleReturn={handleReturn}
          keyBindingFn={keyBindingFn}
          placeholder={placeholder}
          spellCheck={true}
          blockRendererFn={blockRendererFn}
        />
      </div>

      {showBlockEditor && (
        <ContentBlockEditor
          block={editingBlock}
          initialType={blockTypeToInsert}
          onSave={handleBlockSave}
          onCancel={handleBlockCancel}
        />
      )}
    </div>
  );
};

/**
 * ContentBlockMarker - Custom component for rendering content block markers
 */
const ContentBlockMarker = ({ blockProps }) => {
  const { blockType, blockTitle, onEdit } = blockProps;
  
  return (
    <div 
      className={`content-block-marker ${blockType}-block`}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onEdit();
        }
      }}
    >
      <span className="block-type-badge">{blockType}</span>
      <span className="block-title">{blockTitle}</span>
    </div>
  );
};

export default RichTextEditor;
