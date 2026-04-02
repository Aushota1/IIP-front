import { EditorState, ContentState, ContentBlock as DraftContentBlock, genKey } from 'draft-js';
import { jsonParser, JSONParser } from './jsonParser';

describe('JSONParser', () => {
  let parser;

  beforeEach(() => {
    parser = new JSONParser();
  });

  describe('createTextSection', () => {
    it('should create a text section with unique ID', () => {
      const section1 = parser.createTextSection('Hello world');
      const section2 = parser.createTextSection('Another text');

      expect(section1).toEqual({
        id: 1,
        type: 'text',
        content: 'Hello world'
      });

      expect(section2).toEqual({
        id: 2,
        type: 'text',
        content: 'Another text'
      });
    });

    it('should handle empty content', () => {
      const section = parser.createTextSection('');

      expect(section).toEqual({
        id: 1,
        type: 'text',
        content: ''
      });
    });
  });

  describe('convertContentBlock', () => {
    it('should convert formula block to FormulaSection', () => {
      const block = {
        id: 'block-1',
        type: 'formula',
        title: 'Einstein Equation',
        content: 'E = mc^2',
        explanation: ''
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(1);
      expect(sections[0]).toEqual({
        id: 1, // Extracted from block-1
        type: 'formula',
        title: 'Einstein Equation',
        content: 'E = mc^2'
      });
    });

    it('should convert code block to CodeSection with language', () => {
      const block = {
        id: 'block-2',
        type: 'code',
        title: 'Hello World',
        content: 'console.log("Hello");',
        language: 'javascript',
        explanation: ''
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(1);
      expect(sections[0]).toEqual({
        id: 2, // Extracted from block-2
        type: 'code',
        language: 'javascript',
        content: 'console.log("Hello");'
      });
    });

    it('should convert image block to ImageSection with url and alt', () => {
      const block = {
        id: 'block-3',
        type: 'image',
        title: 'Diagram',
        content: 'https://example.com/image.png',
        explanation: ''
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(1);
      expect(sections[0]).toEqual({
        id: 3, // Extracted from block-3
        type: 'image',
        url: 'https://example.com/image.png',
        alt: 'Diagram'
      });
    });

    it('should convert video block to VideoSection with url and title', () => {
      const block = {
        id: 'block-4',
        type: 'video',
        title: 'Tutorial Video',
        content: 'https://youtube.com/watch?v=123',
        explanation: ''
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(1);
      expect(sections[0]).toEqual({
        id: 4, // Extracted from block-4
        type: 'video',
        url: 'https://youtube.com/watch?v=123',
        title: 'Tutorial Video'
      });
    });

    it('should create additional text section for explanation if present', () => {
      const block = {
        id: 'block-5',
        type: 'code',
        title: 'Example',
        content: 'print("Hello")',
        language: 'python',
        explanation: 'This prints Hello to console'
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(2);
      expect(sections[0].type).toBe('code');
      expect(sections[0].id).toBe(5); // Extracted from block-5
      expect(sections[1]).toEqual({
        id: 1, // New ID for explanation text section
        type: 'text',
        content: 'This prints Hello to console'
      });
    });

    it('should not create explanation section if explanation is empty', () => {
      const block = {
        id: 'block-6',
        type: 'formula',
        title: 'Formula',
        content: 'x^2',
        explanation: ''
      };

      const sections = parser.convertContentBlock(block);

      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('formula');
    });

    it('should use default language for code blocks without language', () => {
      const block = {
        id: 'block-7',
        type: 'code',
        title: 'Code',
        content: 'some code'
      };

      const sections = parser.convertContentBlock(block);

      expect(sections[0].language).toBe('javascript');
    });

    it('should use default alt text for images without title', () => {
      const block = {
        id: 'block-8',
        type: 'image',
        content: 'https://example.com/img.jpg'
      };

      const sections = parser.convertContentBlock(block);

      expect(sections[0].alt).toBe('Image');
    });

    it('should use default title for videos without title', () => {
      const block = {
        id: 'block-9',
        type: 'video',
        content: 'https://youtube.com/watch?v=abc'
      };

      const sections = parser.convertContentBlock(block);

      expect(sections[0].title).toBe('Video');
    });
  });

  describe('parse', () => {
    it('should parse simple text content', () => {
      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Hello world',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, []);

      expect(sections).toHaveLength(1);
      expect(sections[0]).toEqual({
        id: 1,
        type: 'text',
        content: 'Hello world'
      });
    });

    it('should identify headings and create text sections', () => {
      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'header-one',
          text: 'Main Title',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Some content',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, []);

      expect(sections).toHaveLength(2);
      expect(sections[0]).toEqual({
        id: 1,
        type: 'text',
        content: 'Main Title'
      });
      expect(sections[1]).toEqual({
        id: 2,
        type: 'text',
        content: 'Some content'
      });
    });

    it('should find БЛОК!!! markers and convert ContentBlocks', () => {
      const contentBlock = {
        id: 'block-123',
        type: 'code',
        title: 'Example Code',
        content: 'console.log("test");',
        language: 'javascript'
      };

      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Introduction text',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [code] Example Code',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Conclusion text',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, [contentBlock]);

      expect(sections).toHaveLength(3);
      expect(sections[0].type).toBe('text');
      expect(sections[0].content).toBe('Introduction text');
      expect(sections[1].type).toBe('code');
      expect(sections[1].content).toBe('console.log("test");');
      expect(sections[2].type).toBe('text');
      expect(sections[2].content).toBe('Conclusion text');
    });

    it('should handle multiple content blocks', () => {
      const contentBlocks = [
        {
          id: 'block-1',
          type: 'formula',
          title: 'Formula 1',
          content: 'x^2'
        },
        {
          id: 'block-2',
          type: 'image',
          title: 'Image 1',
          content: 'https://example.com/img.png'
        }
      ];

      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [formula] Formula 1',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [image] Image 1',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, contentBlocks);

      expect(sections).toHaveLength(2);
      expect(sections[0].type).toBe('formula');
      expect(sections[1].type).toBe('image');
    });

    it('should assign unique IDs to sections', () => {
      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Text 1',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Text 2',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Text 3',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, []);

      expect(sections).toHaveLength(1);
      expect(sections[0].id).toBe(1);
    });
  });

  describe('validate', () => {
    it('should validate sections with all required fields', () => {
      const sections = [
        { id: 1, type: 'text', content: 'Hello' },
        { id: 2, type: 'code', language: 'python', content: 'print("hi")' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing id field', () => {
      const sections = [
        { type: 'text', content: 'Hello' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'id',
          message: 'Section ID is required'
        })
      );
    });

    it('should detect missing type field', () => {
      const sections = [
        { id: 1, content: 'Hello' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'type',
          message: 'Section type is required'
        })
      );
    });

    it('should detect missing content in text sections', () => {
      const sections = [
        { id: 1, type: 'text', content: '' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'content',
          message: 'Text content is required'
        })
      );
    });

    it('should detect missing language in code sections', () => {
      const sections = [
        { id: 1, type: 'code', content: 'code here' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'language',
          message: 'Code language is required'
        })
      );
    });

    it('should detect invalid LaTeX syntax', () => {
      const sections = [
        { id: 1, type: 'formula', content: 'x^{2' } // unbalanced braces
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'content',
          message: 'Invalid LaTeX syntax: unbalanced braces'
        })
      );
    });

    it('should detect missing url in image sections', () => {
      const sections = [
        { id: 1, type: 'image', alt: 'Image' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'url',
          message: 'Image URL is required'
        })
      );
    });

    it('should detect invalid url in image sections', () => {
      const sections = [
        { id: 1, type: 'image', url: 'not-a-url', alt: 'Image' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'url',
          message: 'Invalid image URL'
        })
      );
    });

    it('should detect missing alt in image sections', () => {
      const sections = [
        { id: 1, type: 'image', url: 'https://example.com/img.png' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'alt',
          message: 'Image alt text is required'
        })
      );
    });

    it('should detect missing title in video sections', () => {
      const sections = [
        { id: 1, type: 'video', url: 'https://youtube.com/watch?v=123' }
      ];

      const result = parser.validate(sections);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          field: 'title',
          message: 'Video title is required'
        })
      );
    });
  });

  describe('isValidLatex', () => {
    it('should validate balanced braces', () => {
      expect(parser.isValidLatex('x^{2}')).toBe(true);
      expect(parser.isValidLatex('\\frac{a}{b}')).toBe(true);
      expect(parser.isValidLatex('{{{}}}')).toBe(true);
    });

    it('should detect unbalanced braces', () => {
      expect(parser.isValidLatex('x^{2')).toBe(false);
      expect(parser.isValidLatex('x^2}')).toBe(false);
      expect(parser.isValidLatex('{{{}}')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(parser.isValidLatex('')).toBe(true);
    });
  });

  describe('isValidUrl', () => {
    it('should validate http and https URLs', () => {
      expect(parser.isValidUrl('http://example.com')).toBe(true);
      expect(parser.isValidUrl('https://example.com')).toBe(true);
      expect(parser.isValidUrl('https://example.com/path/to/resource')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(parser.isValidUrl('not-a-url')).toBe(false);
      expect(parser.isValidUrl('ftp://example.com')).toBe(false);
      expect(parser.isValidUrl('')).toBe(false);
    });
  });

  describe('resetCounter', () => {
    it('should reset section ID counter', () => {
      parser.createTextSection('Text 1');
      parser.createTextSection('Text 2');
      
      parser.resetCounter();
      
      const section = parser.createTextSection('Text 3');
      expect(section.id).toBe(1);
    });
  });

  describe('Section ID Preservation', () => {
    it('should preserve section IDs from existing content blocks when editing', () => {
      // Simulate editing an existing lesson where content blocks have IDs like block-10, block-20
      const contentBlocks = [
        {
          id: 'block-10',
          type: 'code',
          title: 'Example Code',
          content: 'console.log("test");',
          language: 'javascript',
          explanation: ''
        },
        {
          id: 'block-20',
          type: 'formula',
          title: 'Math Formula',
          content: 'E = mc^2',
          explanation: ''
        }
      ];

      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'Introduction text',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [code] Example Code',
        }),
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [formula] Math Formula',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, contentBlocks);

      // Check that section IDs are preserved from the original content blocks
      expect(sections).toHaveLength(3);
      expect(sections[0].type).toBe('text');
      expect(sections[0].id).toBe(1); // New text section gets new ID
      expect(sections[1].type).toBe('code');
      expect(sections[1].id).toBe(10); // Preserved from block-10
      expect(sections[2].type).toBe('formula');
      expect(sections[2].id).toBe(20); // Preserved from block-20
    });

    it('should assign new IDs to new content blocks without existing IDs', () => {
      const contentBlocks = [
        {
          id: 'new-block-1', // Not in block-{id} format
          type: 'image',
          title: 'New Image',
          content: 'https://example.com/new.png',
          explanation: ''
        }
      ];

      const blocks = [
        new DraftContentBlock({
          key: genKey(),
          type: 'unstyled',
          text: 'БЛОК!!! [image] New Image',
        })
      ];

      const contentState = ContentState.createFromBlockArray(blocks);
      const editorState = EditorState.createWithContent(contentState);

      const sections = parser.parse(editorState, contentBlocks);

      // New block without proper ID format should get a new ID
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('image');
      expect(sections[0].id).toBe(1); // Gets new ID from counter
    });
  });
});
