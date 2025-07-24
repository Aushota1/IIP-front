import React from 'react';

const CodeBlock = ({ code, language }) => {
  return (
    <pre style={{
      background: '#1e1e1e',
      color: '#d4d4d4',
      padding: '20px',
      borderRadius: '8px',
      overflow: 'auto',
      fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
      fontSize: '0.95rem',
      lineHeight: '1.5',
      tabSize: 4,
      hyphens: 'none',
      margin: 0
    }}>
      <code>{code}</code>
    </pre>
  );
};

export default CodeBlock;