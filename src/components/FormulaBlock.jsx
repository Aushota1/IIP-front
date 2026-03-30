import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const FormulaBlock = ({ formula, inline = false }) => {
  try {
    if (inline) {
      return <InlineMath math={formula} />;
    }
    return (
      <div className="formula-block">
        <BlockMath math={formula} />
      </div>
    );
  } catch (error) {
    console.error('Formula rendering error:', error);
    return (
      <div className="formula-error">
        <code>{formula}</code>
        <span className="error-message">Ошибка отображения формулы</span>
      </div>
    );
  }
};

export default FormulaBlock;
