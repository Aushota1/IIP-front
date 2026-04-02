/**
 * PrettyPrinter Usage Examples
 * 
 * Demonstrates how to use the PrettyPrinter service to convert
 * JSON sections from the API back into editable format.
 */

import { prettyPrinter } from './prettyPrinter';

// Example 1: Simple text lesson
console.log('=== Example 1: Simple Text Lesson ===');
const simpleLesson = [
  { id: 1, type: 'text', content: 'Welcome to this lesson!' },
  { id: 2, type: 'text', content: 'This is a simple introduction.' }
];

const result1 = prettyPrinter.format(simpleLesson);
console.log('Editor text:', result1.editorState.getCurrentContent().getPlainText());
console.log('Content blocks:', result1.contentBlocks);

// Example 2: Lesson with code block
console.log('\n=== Example 2: Lesson with Code Block ===');
const lessonWithCode = [
  { id: 1, type: 'text', content: 'Here is a Python example:' },
  {
    id: 2,
    type: 'code',
    language: 'python',
    content: 'def hello():\n    print("Hello, World!")'
  },
  { id: 3, type: 'text', content: 'This function prints a greeting.' }
];

const result2 = prettyPrinter.format(lessonWithCode);
console.log('Editor text:', result2.editorState.getCurrentContent().getPlainText());
console.log('Content blocks:', result2.contentBlocks);

// Example 3: Lesson with formula
console.log('\n=== Example 3: Lesson with Formula ===');
const lessonWithFormula = [
  { id: 1, type: 'text', content: 'The Pythagorean theorem states:' },
  {
    id: 2,
    type: 'formula',
    title: 'Pythagorean Theorem',
    content: 'a^2 + b^2 = c^2'
  },
  { id: 3, type: 'text', content: 'Where a and b are the legs and c is the hypotenuse.' }
];

const result3 = prettyPrinter.format(lessonWithFormula);
console.log('Editor text:', result3.editorState.getCurrentContent().getPlainText());
console.log('Content blocks:', result3.contentBlocks);

// Example 4: Lesson with image
console.log('\n=== Example 4: Lesson with Image ===');
const lessonWithImage = [
  { id: 1, type: 'text', content: 'Here is a diagram:' },
  {
    id: 2,
    type: 'image',
    url: 'https://example.com/diagram.png',
    alt: 'System Architecture Diagram'
  },
  { id: 3, type: 'text', content: 'This shows the overall system design.' }
];

const result4 = prettyPrinter.format(lessonWithImage);
console.log('Editor text:', result4.editorState.getCurrentContent().getPlainText());
console.log('Content blocks:', result4.contentBlocks);

// Example 5: Lesson with video
console.log('\n=== Example 5: Lesson with Video ===');
const lessonWithVideo = [
  { id: 1, type: 'text', content: 'Watch this tutorial:' },
  {
    id: 2,
    type: 'video',
    url: 'https://youtube.com/watch?v=abc123',
    title: 'Introduction to React'
  },
  { id: 3, type: 'text', content: 'This video covers the basics.' }
];

const result5 = prettyPrinter.format(lessonWithVideo);
console.log('Editor text:', result5.editorState.getCurrentContent().getPlainText());
console.log('Content blocks:', result5.contentBlocks);

// Example 6: Complex lesson with multiple content types
console.log('\n=== Example 6: Complex Lesson ===');
const complexLesson = [
  { id: 1, type: 'text', content: 'Introduction to Algorithms' },
  { id: 2, type: 'text', content: 'Let\'s start with a simple sorting algorithm.' },
  {
    id: 3,
    type: 'code',
    language: 'javascript',
    content: 'function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n      }\n    }\n  }\n  return arr;\n}'
  },
  { id: 4, type: 'text', content: 'The time complexity is:' },
  {
    id: 5,
    type: 'formula',
    title: 'Time Complexity',
    content: 'O(n^2)'
  },
  { id: 6, type: 'text', content: 'Here is a visualization:' },
  {
    id: 7,
    type: 'image',
    url: 'https://example.com/bubble-sort.gif',
    alt: 'Bubble Sort Animation'
  },
  { id: 8, type: 'text', content: 'For more details, watch this video:' },
  {
    id: 9,
    type: 'video',
    url: 'https://youtube.com/watch?v=sorting123',
    title: 'Bubble Sort Explained'
  },
  { id: 10, type: 'text', content: 'Summary: Bubble sort is simple but inefficient for large datasets.' }
];

const result6 = prettyPrinter.format(complexLesson);
console.log('Editor text:', result6.editorState.getCurrentContent().getPlainText());
console.log('Number of content blocks:', result6.contentBlocks.length);
console.log('Content block types:', result6.contentBlocks.map(b => b.type));

// Example 7: Using in LessonEditor component
console.log('\n=== Example 7: Integration with LessonEditor ===');
console.log(`
// In LessonEditor.js:

useEffect(() => {
  if (lessonId) {
    // Load existing lesson
    curriculumAPI.getLesson(lessonId).then(lesson => {
      // Convert JSON sections to editor format
      const { editorState, contentBlocks } = prettyPrinter.format(lesson.sections);
      
      // Set editor state
      setEditorState(editorState);
      setContentBlocks(contentBlocks);
      setTitle(lesson.title);
      setDuration(lesson.duration_minutes);
    });
  }
}, [lessonId]);
`);

// Example 8: Round-trip conversion (parse -> format)
console.log('\n=== Example 8: Round-Trip Conversion ===');
console.log(`
// This demonstrates the round-trip property:
// sections -> format -> editorState -> parse -> sections

import { jsonParser } from './jsonParser';
import { prettyPrinter } from './prettyPrinter';

const originalSections = [
  { id: 1, type: 'text', content: 'Hello' },
  { id: 2, type: 'code', language: 'python', content: 'print("test")' }
];

// Convert to editor format
const { editorState, contentBlocks } = prettyPrinter.format(originalSections);

// Convert back to sections
jsonParser.resetCounter();
const parsedSections = jsonParser.parse(editorState, contentBlocks);

// Should be equivalent (ignoring IDs)
console.log('Original:', originalSections);
console.log('After round-trip:', parsedSections);
`);

export default prettyPrinter;
