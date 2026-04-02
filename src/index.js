import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/scss/main.scss';
import { injectFonts } from './utils/generateFonts';

// Автоматически загружаем шрифты из конфигурации
injectFonts();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);