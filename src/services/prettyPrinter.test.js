/**
 * PrettyPrinter Service Tests
 * 
 * Tests for converting JSON sections back to editor format
 */

import { PrettyPrinter } from './prettyPrinter';
import { EditorState } from 'draft-js';

describe('PrettyPrinter', () => {
  let prettyPrinter;

  beforeEach(() => {
    prettyPrinter = new PrettyPrinter();
  });

  describe('format', () => {
    test('should convert empty sections array to empty editor state', () => {
      const sections = [];
      const result = prettyPrinter.format(sections);

      expect(result).toHaveProperty('editorState');
      expect(result).toHaveProperty('contentBlocks');
      expect(result.contentBlocks).toEqual([]);
      expect(EditorState.createEmpty().getCurrentContent().getPlainText()).toBe('');
    });

    test('should convert text section to editor text block', () => {
      const sections = [
        { id: 1, type: 'text', content: 'Hello World' }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toBe('Hello World');
      expect(result.contentBlocks).toEqual([]);
    });

    test('should convert multiple text sections to multiple text blocks', () => {
      const sections = [
        { id: 1, type: 'text', content: 'First paragraph' },
        { id: 2, type: 'text', content: 'Second paragraph' }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('First paragraph');
      expect(plainText).toContain('Second paragraph');
      expect(result.contentBlocks).toEqual([]);
    });

    test('should convert code section to ContentBlock with marker', () => {
      const sections = [
        {
          id: 1,
          type: 'code',
          language: 'python',
          content: 'print("Hello")'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('БЛОК!!!');
      expect(plainText).toContain('[code]');
      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0]).toMatchObject({
        type: 'code',
        content: 'print("Hello")',
        language: 'python'
      });
    });

    test('should convert formula section to ContentBlock with marker', () => {
      const sections = [
        {
          id: 1,
          type: 'formula',
          title: 'Pythagorean Theorem',
          content: 'a^2 + b^2 = c^2'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('БЛОК!!!');
      expect(plainText).toContain('[formula]');
      expect(plainText).toContain('Pythagorean Theorem');
      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0]).toMatchObject({
        type: 'formula',
        title: 'Pythagorean Theorem',
        content: 'a^2 + b^2 = c^2'
      });
    });

    test('should convert image section to ContentBlock with marker', () => {
      const sections = [
        {
          id: 1,
          type: 'image',
          url: 'https://example.com/image.jpg',
          alt: 'Example Image'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('БЛОК!!!');
      expect(plainText).toContain('[image]');
      expect(plainText).toContain('Example Image');
      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0]).toMatchObject({
        type: 'image',
        title: 'Example Image',
        content: 'https://example.com/image.jpg'
      });
    });

    test('should convert video section to ContentBlock with marker', () => {
      const sections = [
        {
          id: 1,
          type: 'video',
          url: 'https://youtube.com/watch?v=123',
          title: 'Tutorial Video'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('БЛОК!!!');
      expect(plainText).toContain('[video]');
      expect(plainText).toContain('Tutorial Video');
      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0]).toMatchObject({
        type: 'video',
        title: 'Tutorial Video',
        content: 'https://youtube.com/watch?v=123'
      });
    });

    test('should handle mixed sections (text and content blocks)', () => {
      const sections = [
        { id: 1, type: 'text', content: 'Introduction' },
        {
          id: 2,
          type: 'code',
          language: 'javascript',
          content: 'console.log("test");'
        },
        { id: 3, type: 'text', content: 'Explanation' },
        {
          id: 4,
          type: 'formula',
          title: 'Formula',
          content: 'E = mc^2'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('Introduction');
      expect(plainText).toContain('БЛОК!!! [code]');
      expect(plainText).toContain('Explanation');
      expect(plainText).toContain('БЛОК!!! [formula]');
      expect(result.contentBlocks).toHaveLength(2);
      expect(result.contentBlocks[0].type).toBe('code');
      expect(result.contentBlocks[1].type).toBe('formula');
    });

    test('should preserve section order', () => {
      const sections = [
        { id: 1, type: 'text', content: 'First' },
        { id: 2, type: 'text', content: 'Second' },
        { id: 3, type: 'text', content: 'Third' }
      ];

      const result = prettyPrinter.format(sections);
      const blocks = result.editorState.getCurrentContent().getBlocksAsArray();

      expect(blocks[0].getText()).toBe('First');
      expect(blocks[1].getText()).toBe('Second');
      expect(blocks[2].getText()).toBe('Third');
    });

    test('should handle code section without language (default to javascript)', () => {
      const sections = [
        {
          id: 1,
          type: 'code',
          content: 'const x = 1;'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0].language).toBe('javascript');
    });

    test('should handle formula section without title', () => {
      const sections = [
        {
          id: 1,
          type: 'formula',
          content: 'x + y = z'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0].title).toBe('Formula');
    });

    test('should handle image section without alt text', () => {
      const sections = [
        {
          id: 1,
          type: 'image',
          url: 'https://example.com/img.jpg'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0].title).toBe('Image');
    });

    test('should handle video section without title', () => {
      const sections = [
        {
          id: 1,
          type: 'video',
          url: 'https://example.com/video.mp4'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks).toHaveLength(1);
      expect(result.contentBlocks[0].title).toBe('Video');
    });

    test('should generate unique block IDs based on section IDs', () => {
      const sections = [
        {
          id: 42,
          type: 'code',
          language: 'python',
          content: 'print("test")'
        },
        {
          id: 99,
          type: 'formula',
          content: 'a + b'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks[0].id).toBe('block-42');
      expect(result.contentBlocks[1].id).toBe('block-99');
    });

    test('should handle unknown section type as text', () => {
      const sections = [
        {
          id: 1,
          type: 'unknown',
          content: 'Some content'
        }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toBe('Some content');
      expect(result.contentBlocks).toEqual([]);
    });

    test('should skip sections without content', () => {
      const sections = [
        { id: 1, type: 'text', content: 'Valid text' },
        { id: 2, type: 'unknown' }, // No content
        { id: 3, type: 'text', content: 'More text' }
      ];

      const result = prettyPrinter.format(sections);
      const plainText = result.editorState.getCurrentContent().getPlainText();

      expect(plainText).toContain('Valid text');
      expect(plainText).toContain('More text');
    });

    test('should initialize explanation field as empty string', () => {
      const sections = [
        {
          id: 1,
          type: 'code',
          language: 'python',
          content: 'print("test")'
        }
      ];

      const result = prettyPrinter.format(sections);

      expect(result.contentBlocks[0].explanation).toBe('');
    });
  });

  describe('createTextBlock', () => {
    test('should create text block with default unstyled type', () => {
      const block = prettyPrinter.createTextBlock('Test text');

      expect(block.getText()).toBe('Test text');
      expect(block.getType()).toBe('unstyled');
    });

    test('should create text block with custom type', () => {
      const block = prettyPrinter.createTextBlock('Heading', 'header-one');

      expect(block.getText()).toBe('Heading');
      expect(block.getType()).toBe('header-one');
    });

    test('should handle empty text', () => {
      const block = prettyPrinter.createTextBlock('');

      expect(block.getText()).toBe('');
      expect(block.getType()).toBe('unstyled');
    });
  });

  describe('createTextBlocks', () => {
    test('should create multiple blocks from multi-line text', () => {
      const blocks = prettyPrinter.createTextBlocks('Line 1\nLine 2\nLine 3');

      expect(blocks).toHaveLength(3);
      expect(blocks[0].getText()).toBe('Line 1');
      expect(blocks[1].getText()).toBe('Line 2');
      expect(blocks[2].getText()).toBe('Line 3');
    });

    test('should create single block from single-line text', () => {
      const blocks = prettyPrinter.createTextBlocks('Single line');

      expect(blocks).toHaveLength(1);
      expect(blocks[0].getText()).toBe('Single line');
    });

    test('should apply custom type to all blocks', () => {
      const blocks = prettyPrinter.createTextBlocks('Line 1\nLine 2', 'header-two');

      expect(blocks[0].getType()).toBe('header-two');
      expect(blocks[1].getType()).toBe('header-two');
    });
  });
});
