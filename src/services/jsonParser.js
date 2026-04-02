/**
 * JSONParser Service
 * 
 * Converts Rich Text Editor content (Draft.js EditorState) and ContentBlocks
 * into the JSON structure required by LESSONS_API.
 * 
 * Features:
 * - Extracts text blocks from EditorState
 * - Identifies headings and creates text sections with formatting
 * - Finds "БЛОК!!!" markers in text
 * - Converts ContentBlocks to corresponding Section objects
 * - Assigns unique IDs to sections
 * - Validates section structure
 */

/**
 * JSONParser class
 */
class JSONParser {
  constructor() {
    this.sectionIdCounter = 1;
  }

  /**
   * Parse editor content into JSON sections
   * @param {EditorState} editorState - Draft.js editor state
   * @param {Array} contentBlocks - Array of content blocks
   * @returns {Array} Array of Section objects
   */
  parse(editorState, contentBlocks) {
    const sections = [];
    const contentState = editorState.getCurrentContent();
    const blocks = contentState.getBlocksAsArray();
    
    let i = 0;
    while (i < blocks.length) {
      const block = blocks[i];
      const text = block.getText();
      const type = block.getType();
      
      // Handle heading blocks
      if (type.startsWith('header-')) {
        const level = this.getHeadingLevel(type);
        const headingSection = {
          id: this.sectionIdCounter++,
          type: 'heading',
          level: level,
          content: text
        };
        
        // Собираем текст после заголовка до следующего блока/заголовка
        const subSections = [];
        i++;
        while (i < blocks.length) {
          const nextBlock = blocks[i];
          const nextText = nextBlock.getText();
          const nextType = nextBlock.getType();
          
          // Если встретили БЛОК!!! или новый заголовок - останавливаемся
          if (nextText.startsWith('БЛОК!!!') || nextType.startsWith('header-')) {
            break;
          }
          
          // Добавляем текст в section_in_blok
          if (nextText.trim()) {
            subSections.push({
              type: 'text',
              content: nextText.trim()
            });
          }
          i++;
        }
        
        if (subSections.length > 0) {
          headingSection.section_in_blok = subSections;
        }
        
        sections.push(headingSection);
        continue;
      }
      
      // Check for content block marker
      if (text.startsWith('БЛОК!!!')) {
        // Find corresponding content block
        const blockId = this.extractBlockId(text);
        const contentBlock = contentBlocks.find(cb => cb.id === blockId || text.includes(cb.title));
        
        if (contentBlock) {
          // Собираем текст после блока до следующего блока/заголовка
          const subSections = [];
          i++;
          while (i < blocks.length) {
            const nextBlock = blocks[i];
            const nextText = nextBlock.getText();
            const nextType = nextBlock.getType();
            
            // Если встретили БЛОК!!! или новый заголовок - останавливаемся
            if (nextText.startsWith('БЛОК!!!') || nextType.startsWith('header-')) {
              break;
            }
            
            // Добавляем текст в section_in_blok
            if (nextText.trim()) {
              subSections.push({
                type: 'text',
                content: nextText.trim()
              });
            }
            i++;
          }
          
          const convertedSections = this.convertContentBlock(contentBlock, subSections);
          sections.push(...convertedSections);
          continue;
        }
      }
      
      // Обычный текст (не после заголовка или блока)
      if (text.trim()) {
        sections.push({
          id: this.sectionIdCounter++,
          type: 'text',
          content: text.trim()
        });
      }
      
      i++;
    }
    
    return sections;
  }

  /**
   * Get heading level from block type
   * @param {string} blockType - Block type like 'header-one'
   * @returns {number} Heading level (1-3)
   */
  getHeadingLevel(blockType) {
    const levelMap = {
      'header-one': 1,
      'header-two': 2,
      'header-three': 3
    };
    return levelMap[blockType] || 1;
  }

  /**
   * Extract block ID from marker text
   * @param {string} markerText - Marker text like "БЛОК!!! [code] Title"
   * @returns {string|null} Block ID or null
   */
  extractBlockId(markerText) {
    // Try to extract block ID from marker
    // Format: "БЛОК!!! [type] title" or "БЛОК!!! [type] block-id"
    const match = markerText.match(/БЛОК!!!\s*\[.*?\]\s*(.+)/);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract section ID from content block ID
   * @param {string} blockId - Block ID like "block-123"
   * @returns {number|null} Section ID or null
   */
  extractSectionId(blockId) {
    if (!blockId) return null;
    const match = blockId.match(/^block-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Create text section
   * @param {string} content - Text content
   * @param {string} format - Block format (unstyled, header-one, etc.)
   * @returns {Object} TextSection object
   */
  createTextSection(content, format = 'unstyled') {
    return {
      id: this.sectionIdCounter++,
      type: 'text',
      content: content
    };
  }

  /**
   * Convert ContentBlock to Section objects
   * @param {Object} block - ContentBlock object
   * @param {Array} subSections - Sub-sections to add to section_in_blok
   * @returns {Array} Array of Section objects
   */
  convertContentBlock(block, subSections = []) {
    const sections = [];
    
    // Try to extract existing section ID from block ID
    const existingSectionId = this.extractSectionId(block.id);
    const sectionId = existingSectionId || this.sectionIdCounter++;
    
    switch (block.type) {
      case 'formula':
        const formulaSection = {
          id: sectionId,
          type: 'formula',
          title: block.title || undefined,
          content: block.content
        };
        if (subSections.length > 0) {
          formulaSection.section_in_blok = subSections;
        }
        sections.push(formulaSection);
        break;
        
      case 'code':
        const codeSection = {
          id: sectionId,
          type: 'code',
          language: block.language || 'javascript',
          title: block.title || undefined,
          content: block.content
        };
        if (subSections.length > 0) {
          codeSection.section_in_blok = subSections;
        }
        sections.push(codeSection);
        break;
        
      case 'image':
        const imageSection = {
          id: sectionId,
          type: 'image',
          url: block.content,
          title: block.title || undefined,
          alt: block.title || 'Image'
        };
        if (subSections.length > 0) {
          imageSection.section_in_blok = subSections;
        }
        sections.push(imageSection);
        break;
        
      case 'video':
        const videoSection = {
          id: sectionId,
          type: 'video',
          url: block.content,
          title: block.title || 'Video'
        };
        if (subSections.length > 0) {
          videoSection.section_in_blok = subSections;
        }
        sections.push(videoSection);
        break;
        
      default:
        // Unknown block type, skip
        break;
    }
    
    // Add explanation as separate text section if present
    if (block.explanation && block.explanation.trim()) {
      sections.push({
        id: this.sectionIdCounter++,
        type: 'text',
        content: block.explanation.trim()
      });
    }
    
    return sections;
  }

  /**
   * Validate sections structure
   * @param {Array} sections - Array of Section objects
   * @returns {Object} ValidationResult { valid: boolean, errors: Array }
   */
  validate(sections) {
    const errors = [];
    
    sections.forEach((section, index) => {
      // Validate required fields
      if (!section.id) {
        errors.push({
          sectionId: section.id || index,
          field: 'id',
          message: 'Section ID is required'
        });
      }
      
      if (!section.type) {
        errors.push({
          sectionId: section.id || index,
          field: 'type',
          message: 'Section type is required'
        });
      }
      
      // Type-specific validation
      switch (section.type) {
        case 'text':
          if (!section.content || !section.content.trim()) {
            errors.push({
              sectionId: section.id,
              field: 'content',
              message: 'Text content is required'
            });
          }
          break;
        
        case 'heading':
          if (!section.content || !section.content.trim()) {
            errors.push({
              sectionId: section.id,
              field: 'content',
              message: 'Heading content is required'
            });
          }
          if (!section.level || section.level < 1 || section.level > 3) {
            errors.push({
              sectionId: section.id,
              field: 'level',
              message: 'Heading level must be 1, 2, or 3'
            });
          }
          break;
          
        case 'code':
          if (!section.language) {
            errors.push({
              sectionId: section.id,
              field: 'language',
              message: 'Code language is required'
            });
          }
          if (!section.content || !section.content.trim()) {
            errors.push({
              sectionId: section.id,
              field: 'content',
              message: 'Code content is required'
            });
          }
          break;
          
        case 'formula':
          if (!section.content || !section.content.trim()) {
            errors.push({
              sectionId: section.id,
              field: 'content',
              message: 'Formula content is required'
            });
          }
          // Validate LaTeX syntax
          if (section.content && !this.isValidLatex(section.content)) {
            errors.push({
              sectionId: section.id,
              field: 'content',
              message: 'Invalid LaTeX syntax: unbalanced braces'
            });
          }
          break;
          
        case 'image':
          if (!section.url) {
            errors.push({
              sectionId: section.id,
              field: 'url',
              message: 'Image URL is required'
            });
          }
          if (section.url && !this.isValidUrl(section.url)) {
            errors.push({
              sectionId: section.id,
              field: 'url',
              message: 'Invalid image URL'
            });
          }
          if (!section.alt) {
            errors.push({
              sectionId: section.id,
              field: 'alt',
              message: 'Image alt text is required'
            });
          }
          break;
          
        case 'video':
          if (!section.url) {
            errors.push({
              sectionId: section.id,
              field: 'url',
              message: 'Video URL is required'
            });
          }
          if (section.url && !this.isValidUrl(section.url)) {
            errors.push({
              sectionId: section.id,
              field: 'url',
              message: 'Invalid video URL'
            });
          }
          if (!section.title) {
            errors.push({
              sectionId: section.id,
              field: 'title',
              message: 'Video title is required'
            });
          }
          break;
          
        default:
          errors.push({
            sectionId: section.id,
            field: 'type',
            message: `Unknown section type: ${section.type}`
          });
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate LaTeX syntax (check for balanced braces)
   * @param {string} latex - LaTeX string
   * @returns {boolean} True if valid
   */
  isValidLatex(latex) {
    let braceCount = 0;
    for (const char of latex) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount < 0) return false;
    }
    return braceCount === 0;
  }

  /**
   * Validate URL format
   * @param {string} url - URL string
   * @returns {boolean} True if valid
   */
  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Reset section ID counter
   * Useful for testing or when starting a new lesson
   */
  resetCounter() {
    this.sectionIdCounter = 1;
  }
}

// Export class and singleton instance
export { JSONParser };
export const jsonParser = new JSONParser();
export default jsonParser;
