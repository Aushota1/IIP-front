/**
 * JSONParser Usage Example
 * 
 * This file demonstrates how to use the JSONParser service
 * in the LessonEditor component to convert Rich Text Editor
 * content into JSON sections for the LESSONS_API.
 */

import { EditorState, ContentState, ContentBlock, genKey } from 'draft-js';
import { jsonParser } from './jsonParser';

/**
 * Example 1: Parse simple text content
 */
export function exampleSimpleText() {
  // Create editor state with simple text
  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'This is an introduction to the lesson.',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  // Parse to JSON sections
  const sections = jsonParser.parse(editorState, []);

  console.log('Simple text sections:', sections);
  // Output: [{ id: 1, type: 'text', content: 'This is an introduction to the lesson.' }]

  return sections;
}

/**
 * Example 2: Parse text with headings
 */
export function exampleWithHeadings() {
  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'header-one',
      text: 'Introduction',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'This lesson covers the basics.',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'header-two',
      text: 'Key Concepts',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'Here are the main ideas.',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  const sections = jsonParser.parse(editorState, []);

  console.log('Sections with headings:', sections);
  // Output: 4 text sections with heading and paragraph content

  return sections;
}

/**
 * Example 3: Parse content with code blocks
 */
export function exampleWithCodeBlock() {
  // Define a code content block
  const codeBlock = {
    id: 'block-code-1',
    type: 'code',
    title: 'Hello World Example',
    content: 'console.log("Hello, World!");',
    language: 'javascript',
    explanation: 'This code prints a greeting to the console.'
  };

  // Create editor state with text and code block marker
  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'Here is a simple JavaScript example:',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [code] Hello World Example',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'This demonstrates basic output.',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  // Parse with content blocks
  const sections = jsonParser.parse(editorState, [codeBlock]);

  console.log('Sections with code block:', sections);
  // Output: 
  // [
  //   { id: 1, type: 'text', content: 'Here is a simple JavaScript example:' },
  //   { id: 2, type: 'code', language: 'javascript', content: 'console.log("Hello, World!");' },
  //   { id: 3, type: 'text', content: 'This code prints a greeting to the console.' },
  //   { id: 4, type: 'text', content: 'This demonstrates basic output.' }
  // ]

  return sections;
}

/**
 * Example 4: Parse content with formula block
 */
export function exampleWithFormulaBlock() {
  const formulaBlock = {
    id: 'block-formula-1',
    type: 'formula',
    title: 'Pythagorean Theorem',
    content: 'a^2 + b^2 = c^2',
    explanation: 'This formula relates the sides of a right triangle.'
  };

  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'header-two',
      text: 'Mathematical Formulas',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [formula] Pythagorean Theorem',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  const sections = jsonParser.parse(editorState, [formulaBlock]);

  console.log('Sections with formula:', sections);
  // Output:
  // [
  //   { id: 1, type: 'text', content: 'Mathematical Formulas' },
  //   { id: 2, type: 'formula', title: 'Pythagorean Theorem', content: 'a^2 + b^2 = c^2' },
  //   { id: 3, type: 'text', content: 'This formula relates the sides of a right triangle.' }
  // ]

  return sections;
}

/**
 * Example 5: Parse content with image and video blocks
 */
export function exampleWithMediaBlocks() {
  const imageBlock = {
    id: 'block-image-1',
    type: 'image',
    title: 'Architecture Diagram',
    content: 'https://example.com/images/architecture.png'
  };

  const videoBlock = {
    id: 'block-video-1',
    type: 'video',
    title: 'Tutorial Video',
    content: 'https://youtube.com/watch?v=abc123'
  };

  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [image] Architecture Diagram',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'Watch this video for more details:',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [video] Tutorial Video',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  const sections = jsonParser.parse(editorState, [imageBlock, videoBlock]);

  console.log('Sections with media:', sections);
  // Output:
  // [
  //   { id: 1, type: 'image', url: 'https://example.com/images/architecture.png', alt: 'Architecture Diagram' },
  //   { id: 2, type: 'text', content: 'Watch this video for more details:' },
  //   { id: 3, type: 'video', url: 'https://youtube.com/watch?v=abc123', title: 'Tutorial Video' }
  // ]

  return sections;
}

/**
 * Example 6: Complete lesson with validation
 */
export function exampleCompleteLesson() {
  // Reset counter for clean IDs
  jsonParser.resetCounter();

  const contentBlocks = [
    {
      id: 'block-1',
      type: 'code',
      title: 'Function Example',
      content: 'function add(a, b) {\n  return a + b;\n}',
      language: 'javascript',
      explanation: 'This function adds two numbers.'
    },
    {
      id: 'block-2',
      type: 'formula',
      title: 'Sum Formula',
      content: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}',
      explanation: ''
    }
  ];

  const blocks = [
    new ContentBlock({
      key: genKey(),
      type: 'header-one',
      text: 'Introduction to Functions',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'Functions are reusable blocks of code.',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [code] Function Example',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'header-two',
      text: 'Mathematical Background',
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: 'БЛОК!!! [formula] Sum Formula',
    })
  ];

  const contentState = ContentState.createFromBlockArray(blocks);
  const editorState = EditorState.createWithContent(contentState);

  // Parse
  const sections = jsonParser.parse(editorState, contentBlocks);

  // Validate
  const validationResult = jsonParser.validate(sections);

  console.log('Complete lesson sections:', sections);
  console.log('Validation result:', validationResult);

  if (validationResult.valid) {
    console.log('✓ Lesson is valid and ready to submit!');
  } else {
    console.error('✗ Validation errors:', validationResult.errors);
  }

  return { sections, validationResult };
}

/**
 * Example 7: How to use in LessonEditor component
 * 
 * This is a pseudo-code example showing integration in React component
 */
export const LessonEditorIntegrationExample = `
import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import RichTextEditor from './RichTextEditor';
import { jsonParser } from '../services/jsonParser';
import { curriculumAPI } from '../services/curriculum';

function LessonEditor({ courseId, moduleId, lessonId }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [contentBlocks, setContentBlocks] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async () => {
    // Reset counter for clean IDs
    jsonParser.resetCounter();
    
    // Parse editor content to JSON sections
    const sections = jsonParser.parse(editorState, contentBlocks);
    
    // Validate sections
    const validationResult = jsonParser.validate(sections);
    
    if (!validationResult.valid) {
      setErrors(validationResult.errors);
      return;
    }
    
    // Prepare lesson data
    const lessonData = {
      title,
      duration_minutes: duration,
      order_index: 1, // Calculate based on existing lessons
      sections
    };
    
    try {
      if (lessonId) {
        // Update existing lesson
        await curriculumAPI.updateLesson(lessonId, lessonData);
      } else {
        // Create new lesson
        await curriculumAPI.createLesson(courseId, moduleId, lessonData);
      }
      
      // Success - redirect or show notification
      console.log('Lesson saved successfully!');
    } catch (error) {
      console.error('Failed to save lesson:', error);
    }
  };

  return (
    <div className="lesson-editor">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lesson Title"
      />
      
      <RichTextEditor
        editorState={editorState}
        onChange={setEditorState}
        contentBlocks={contentBlocks}
        onContentBlocksChange={setContentBlocks}
      />
      
      {errors.length > 0 && (
        <div className="validation-errors">
          {errors.map((error, index) => (
            <div key={index} className="error">
              Section {error.sectionId}: {error.message}
            </div>
          ))}
        </div>
      )}
      
      <button onClick={handleSubmit}>ПОДТВЕРДИТЬ</button>
    </div>
  );
}
`;

// Run examples if this file is executed directly
if (require.main === module) {
  console.log('\n=== Example 1: Simple Text ===');
  exampleSimpleText();

  console.log('\n=== Example 2: With Headings ===');
  exampleWithHeadings();

  console.log('\n=== Example 3: With Code Block ===');
  exampleWithCodeBlock();

  console.log('\n=== Example 4: With Formula Block ===');
  exampleWithFormulaBlock();

  console.log('\n=== Example 5: With Media Blocks ===');
  exampleWithMediaBlocks();

  console.log('\n=== Example 6: Complete Lesson ===');
  exampleCompleteLesson();
}
