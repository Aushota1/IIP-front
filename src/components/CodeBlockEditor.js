import React from 'react';

/**
 * CodeBlockEditor - Specialized editor for code blocks
 * 
 * @param {Object} props
 * @param {string} props.content - Code content
 * @param {string} props.language - Programming language
 * @param {Function} props.onContentChange - Callback when content changes
 * @param {Function} props.onLanguageChange - Callback when language changes
 * @param {string} props.contentError - Error message for content
 * @param {string} props.languageError - Error message for language
 */
const CodeBlockEditor = ({
  content,
  language,
  onContentChange,
  onLanguageChange,
  contentError,
  languageError,
}) => {
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'sql', label: 'SQL' },
    { value: 'bash', label: 'Bash' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'scss', label: 'SCSS' },
    { value: 'json', label: 'JSON' },
  ];

  return (
    <div className="code-block-editor">
      <div className="language-selector">
        <label htmlFor="code-language">Язык программирования:</label>
        <select
          id="code-language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className={languageError ? 'error' : ''}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        {languageError && <span className="error-message">{languageError}</span>}
      </div>

      <div className="code-input">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="Введите код..."
          rows={12}
          className={`code-textarea ${contentError ? 'error' : ''}`}
          spellCheck={false}
        />
        {contentError && <span className="error-message">{contentError}</span>}
      </div>
    </div>
  );
};

export default CodeBlockEditor;
