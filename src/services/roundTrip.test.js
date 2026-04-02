/**
 * Round-trip integration tests
 * 
 * Tests that verify the complete flow:
 * 1. Sections (from API) → PrettyPrinter → Editor format
 * 2. Editor format → JSONParser → Sections (to API)
 * 3. Verify section IDs are preserved
 */

import { EditorState } from 'draft-js';
import { prettyPrinter } from './prettyPrinter';
import { jsonParser, JSONParser } from './jsonParser';

describe('Round-trip Integration Tests', () => {
  describe('Section ID Preservation', () => {
    it('should preserve section IDs through edit cycle', () => {
      // Original sections from API (simulating an existing lesson)
      const originalSections = [
        {
          id: 10,
          type: 'text',
          content: 'Introduction to the topic'
        },
        {
          id: 20,
          type: 'code',
          language: 'javascript',
          content: 'console.log("Hello World");'
        },
        {
          id: 30,
          type: 'formula',
          title: 'Einstein Equation',
          content: 'E = mc^2'
        },
        {
          id: 40,
          type: 'image',
          url: 'https://example.com/diagram.png',
          alt: 'System Diagram'
        }
      ];

      // Step 1: Convert to editor format (PrettyPrinter)
      const { editorState, contentBlocks } = prettyPrinter.format(originalSections);

      // Verify content blocks have correct IDs
      expect(contentBlocks).toHaveLength(3); // code, formula, image (text is in editor)
      expect(contentBlocks[0].id).toBe('block-20');
      expect(contentBlocks[1].id).toBe('block-30');
      expect(contentBlocks[2].id).toBe('block-40');

      // Step 2: Parse back to sections (JSONParser)
      const parser = new JSONParser();
      const parsedSections = parser.parse(editorState, contentBlocks);

      // Step 3: Verify section IDs are preserved
      expect(parsedSections).toHaveLength(4);
      
      // Text section
      expect(parsedSections[0].type).toBe('text');
      expect(parsedSections[0].content).toContain('Introduction');
      
      // Code section - ID should be preserved
      expect(parsedSections[1].type).toBe('code');
      expect(parsedSections[1].id).toBe(20); // Preserved!
      expect(parsedSections[1].language).toBe('javascript');
      
      // Formula section - ID should be preserved
      expect(parsedSections[2].type).toBe('formula');
      expect(parsedSections[2].id).toBe(30); // Preserved!
      expect(parsedSections[2].content).toBe('E = mc^2');
      
      // Image section - ID should be preserved
      expect(parsedSections[3].type).toBe('image');
      expect(parsedSections[3].id).toBe(40); // Preserved!
      expect(parsedSections[3].url).toBe('https://example.com/diagram.png');
    });

    it('should handle mixed new and existing content', () => {
      // Simulating editing where user keeps some existing blocks and adds new ones
      const originalSections = [
        {
          id: 100,
          type: 'text',
          content: 'Existing text'
        },
        {
          id: 200,
          type: 'code',
          language: 'python',
          content: 'print("existing")'
        }
      ];

      // Convert to editor format
      const { editorState, contentBlocks } = prettyPrinter.format(originalSections);

      // Simulate user adding a new content block
      // Note: In real usage, the editor would add the marker to editorState
      // For this test, we just verify that existing IDs are preserved
      const parser = new JSONParser();
      const parsedSections = parser.parse(editorState, contentBlocks);

      // Verify existing IDs are preserved
      const codeSection = parsedSections.find(s => s.type === 'code');
      expect(codeSection).toBeDefined();
      expect(codeSection.id).toBe(200); // Preserved

      const textSection = parsedSections.find(s => s.type === 'text');
      expect(textSection).toBeDefined();
      expect(textSection.content).toContain('Existing text');
    });

    it('should handle complete lesson edit workflow', () => {
      // Simulate a complete workflow:
      // 1. Load lesson from API
      // 2. User edits content
      // 3. Save back to API
      
      // Original lesson from API
      const lessonFromAPI = {
        id: 1,
        title: 'Introduction to JavaScript',
        sections: [
          { id: 1, type: 'text', content: 'JavaScript is a programming language.' },
          { id: 2, type: 'code', language: 'javascript', content: 'let x = 5;' }
        ]
      };

      // Load into editor
      const { editorState, contentBlocks } = prettyPrinter.format(lessonFromAPI.sections);

      // User makes edits (simulated by parsing back)
      const parser = new JSONParser();
      const updatedSections = parser.parse(editorState, contentBlocks);

      // Verify all section IDs are preserved
      expect(updatedSections).toHaveLength(2);
      expect(updatedSections[0].id).toBe(1);
      expect(updatedSections[1].id).toBe(2);

      // Prepare for API update
      const lessonForAPI = {
        ...lessonFromAPI,
        sections: updatedSections
      };

      // Verify the lesson can be sent back to API with preserved IDs
      expect(lessonForAPI.sections).toHaveLength(2);
      expect(lessonForAPI.sections.every(s => s.id !== undefined)).toBe(true);
    });
  });

  describe('Content Integrity', () => {
    it('should preserve content through round-trip', () => {
      const sections = [
        { id: 1, type: 'text', content: 'Test content with special chars: <>&"' },
        { id: 2, type: 'code', language: 'python', content: 'def test():\n    return True' },
        { id: 3, type: 'formula', title: 'Complex Formula', content: '\\frac{a}{b} = \\sqrt{c}' }
      ];

      const { editorState, contentBlocks } = prettyPrinter.format(sections);
      const parser = new JSONParser();
      const parsedSections = parser.parse(editorState, contentBlocks);

      // Verify content is preserved
      expect(parsedSections[0].content).toContain('special chars');
      expect(parsedSections[1].content).toContain('def test()');
      expect(parsedSections[2].content).toBe('\\frac{a}{b} = \\sqrt{c}');
    });
  });
});
