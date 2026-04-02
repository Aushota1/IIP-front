import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import RichTextEditor from './RichTextEditor';

/**
 * RichTextEditorExample - Example usage of RichTextEditor component
 * 
 * This component demonstrates:
 * - Initializing EditorState
 * - Handling editor state changes
 * - Handling content block insertion
 * - Maintaining cursor position during formatting
 */
const RichTextEditorExample = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [contentBlocks, setContentBlocks] = useState([]);

  /**
   * Handle editor state changes
   * @param {EditorState} newEditorState - New editor state
   */
  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  /**
   * Handle content block insertion
   * @param {string} blockType - Type of content block (formula, code, image, video)
   */
  const handleInsertContentBlock = (blockType) => {
    // In a real implementation, this would open a modal/dialog
    // to collect block details (title, content, etc.)
    console.log(`Insert content block: ${blockType}`);
    
    // Example: Add a placeholder content block
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      title: `${blockType} block`,
      content: '',
    };
    
    setContentBlocks([...contentBlocks, newBlock]);
    
    // In a real implementation, you would also insert a marker
    // into the editor state at the current cursor position
  };

  /**
   * Get current editor content as plain text (for debugging)
   */
  const getCurrentContent = () => {
    const content = editorState.getCurrentContent();
    return content.getPlainText();
  };

  return (
    <div className="rich-text-editor-example">
      <h2>Rich Text Editor Example</h2>
      
      <div className="editor-wrapper">
        <RichTextEditor
          editorState={editorState}
          onChange={handleEditorChange}
          onInsertContentBlock={handleInsertContentBlock}
          placeholder="Start typing your lesson content..."
        />
      </div>

      <div className="editor-debug">
        <h3>Debug Info</h3>
        <div>
          <strong>Content Blocks:</strong> {contentBlocks.length}
        </div>
        <div>
          <strong>Plain Text Length:</strong> {getCurrentContent().length}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditorExample;
