/**
 * PrettyPrinter Service
 * 
 * Converts JSON sections (from LESSONS_API) back into Rich Text Editor format
 * (Draft.js EditorState) and ContentBlocks for editing.
 * 
 * This is the reverse operation of JSONParser - it takes structured JSON
 * and converts it back to an editable format.
 * 
 * Features:
 * - Converts text sections to Draft.js text blocks
 * - Converts code/formula/image/video sections to ContentBlocks
 * - Inserts "БЛОК!!!" markers for each ContentBlock
 * - Preserves section order and content
 */

import { EditorState, ContentState, ContentBlock as DraftContentBlock, genKey, CharacterMetadata } from 'draft-js';
import { List, Repeat } from 'immutable';

/**
 * PrettyPrinter class
 */
class PrettyPrinter {
  /**
   * Format JSON sections into editor format
   * @param {Array} sections - Array of Section objects from API
   * @returns {Object} { editorState, contentBlocks }
   */
  format(sections) {
    const contentBlocks = [];
    const draftBlocks = [];
    
    sections.forEach((section) => {
      switch (section.type) {
        case 'heading':
          // Add heading block to editor
          const headingType = this.getHeadingType(section.level);
          draftBlocks.push(this.createTextBlock(section.content, headingType));
          
          // Process section_in_blok if exists
          if (section.section_in_blok && Array.isArray(section.section_in_blok)) {
            section.section_in_blok.forEach((subSection) => {
              if (subSection.type === 'text' && subSection.content) {
                draftBlocks.push(this.createTextBlock(subSection.content));
              }
            });
          }
          break;
          
        case 'text':
          // Add text block to editor
          draftBlocks.push(this.createTextBlock(section.content));
          break;
          
        case 'code':
          // Extract explanation from section_in_blok
          let codeExplanation = '';
          if (section.section_in_blok && Array.isArray(section.section_in_blok)) {
            codeExplanation = section.section_in_blok
              .filter(sub => sub.type === 'text' && sub.content)
              .map(sub => sub.content)
              .join('\n');
          }
          
          const codeBlock = {
            id: `block-${section.id}`,
            type: 'code',
            title: section.title || 'Code Block',
            content: section.content,
            language: section.language || 'javascript',
            explanation: codeExplanation
          };
          contentBlocks.push(codeBlock);
          
          // Add marker to editor
          draftBlocks.push(this.createTextBlock(`БЛОК!!! [code] ${codeBlock.title}`));
          break;
          
        case 'formula':
          // Extract explanation from section_in_blok
          let formulaExplanation = '';
          if (section.section_in_blok && Array.isArray(section.section_in_blok)) {
            formulaExplanation = section.section_in_blok
              .filter(sub => sub.type === 'text' && sub.content)
              .map(sub => sub.content)
              .join('\n');
          }
          
          const formulaBlock = {
            id: `block-${section.id}`,
            type: 'formula',
            title: section.title || 'Formula',
            content: section.content,
            explanation: formulaExplanation
          };
          contentBlocks.push(formulaBlock);
          
          // Add marker to editor
          draftBlocks.push(this.createTextBlock(`БЛОК!!! [formula] ${formulaBlock.title}`));
          break;
          
        case 'image':
          // Extract explanation from section_in_blok
          let imageExplanation = '';
          if (section.section_in_blok && Array.isArray(section.section_in_blok)) {
            imageExplanation = section.section_in_blok
              .filter(sub => sub.type === 'text' && sub.content)
              .map(sub => sub.content)
              .join('\n');
          }
          
          const imageBlock = {
            id: `block-${section.id}`,
            type: 'image',
            title: section.alt || 'Image',
            content: section.url,
            explanation: imageExplanation
          };
          contentBlocks.push(imageBlock);
          
          // Add marker to editor
          draftBlocks.push(this.createTextBlock(`БЛОК!!! [image] ${imageBlock.title}`));
          break;
          
        case 'video':
          // Extract explanation from section_in_blok
          let videoExplanation = '';
          if (section.section_in_blok && Array.isArray(section.section_in_blok)) {
            videoExplanation = section.section_in_blok
              .filter(sub => sub.type === 'text' && sub.content)
              .map(sub => sub.content)
              .join('\n');
          }
          
          const videoBlock = {
            id: `block-${section.id}`,
            type: 'video',
            title: section.title || 'Video',
            content: section.url,
            explanation: videoExplanation
          };
          contentBlocks.push(videoBlock);
          
          // Add marker to editor
          draftBlocks.push(this.createTextBlock(`БЛОК!!! [video] ${videoBlock.title}`));
          break;
          
        default:
          // Unknown section type, add as text
          if (section.content) {
            draftBlocks.push(this.createTextBlock(section.content));
          }
      }
    });
    
    // Create ContentState from blocks
    const contentState = ContentState.createFromBlockArray(draftBlocks);
    const editorState = EditorState.createWithContent(contentState);
    
    return { editorState, contentBlocks };
  }

  /**
   * Get Draft.js heading type from level
   * @param {number} level - Heading level (1-3)
   * @returns {string} Draft.js block type
   */
  getHeadingType(level) {
    switch (level) {
      case 1:
        return 'header-one';
      case 2:
        return 'header-two';
      case 3:
        return 'header-three';
      default:
        return 'unstyled';
    }
  }

  /**
   * Create a Draft.js ContentBlock from text
   * @param {string} text - Text content
   * @param {string} type - Block type (unstyled, header-one, etc.)
   * @returns {ContentBlock} Draft.js ContentBlock
   */
  createTextBlock(text, type = 'unstyled') {
    return new DraftContentBlock({
      key: genKey(),
      type: type,
      text: text,
      characterList: List(Repeat(CharacterMetadata.create(), text.length))
    });
  }

  /**
   * Create multiple text blocks from multi-line text
   * @param {string} text - Multi-line text content
   * @param {string} type - Block type
   * @returns {Array} Array of Draft.js ContentBlocks
   */
  createTextBlocks(text, type = 'unstyled') {
    const lines = text.split('\n');
    return lines.map(line => this.createTextBlock(line, type));
  }
}

// Export class and singleton instance
export { PrettyPrinter };
export const prettyPrinter = new PrettyPrinter();
export default prettyPrinter;
