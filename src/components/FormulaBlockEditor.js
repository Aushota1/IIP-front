import React from 'react';

/**
 * FormulaBlockEditor - Specialized editor for LaTeX formulas
 * 
 * @param {Object} props
 * @param {string} props.content - LaTeX formula content
 * @param {Function} props.onChange - Callback when content changes
 * @param {string} props.error - Error message
 */
const FormulaBlockEditor = ({ content, onChange, error }) => {
  return (
    <div className="formula-block-editor">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Введите формулу в формате LaTeX..."
        rows={6}
        className={`formula-textarea ${error ? 'error' : ''}`}
      />
      {error && <span className="error-message">{error}</span>}
      <div className="formula-help">
        <h4>Примеры LaTeX синтаксиса:</h4>
        <ul>
          <li><code>x^2</code> - степень</li>
          <li><code>\frac{'{a}{b}'}</code> - дробь</li>
          <li><code>\sqrt{'{x}'}</code> - квадратный корень</li>
          <li><code>\sum_{'{i=1}'}^{'{n}'}</code> - сумма</li>
          <li><code>\int_{'{a}'}^{'{b}'}</code> - интеграл</li>
          <li><code>\alpha, \beta, \gamma</code> - греческие буквы</li>
        </ul>
      </div>
    </div>
  );
};

export default FormulaBlockEditor;
