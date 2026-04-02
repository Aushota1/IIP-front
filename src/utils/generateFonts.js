/**
 * Font Generator Utility
 * Генерирует CSS для шрифтов из конфигурации
 */

import { fonts } from '../styles/fonts.config.js';

/**
 * Определяет формат шрифта по расширению файла
 */
function getFontFormat(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const formatMap = {
    'ttf': 'truetype',
    'otf': 'opentype',
    'woff': 'woff',
    'woff2': 'woff2',
    'eot': 'embedded-opentype',
    'svg': 'svg'
  };
  return formatMap[ext] || 'truetype';
}

/**
 * Генерирует @font-face правило для одного файла шрифта
 */
function generateFontFace(family, file, weight, style) {
  const format = getFontFormat(file);
  return `
@font-face {
  font-family: '${family}';
  src: url('/fonts/${file}') format('${format}');
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}`;
}

/**
 * Генерирует CSS для всех шрифтов
 */
export function generateFontsCSS() {
  if (!fonts || fonts.length === 0) {
    return '/* Нет шрифтов в конфигурации */';
  }

  let css = '/* Auto-generated fonts from fonts.config.js */\n';
  
  fonts.forEach(font => {
    if (!font.files || font.files.length === 0) return;
    
    font.files.forEach(({ file, weight = 400, style = 'normal' }) => {
      css += generateFontFace(font.family, file, weight, style);
    });
  });

  return css;
}

/**
 * Инжектирует CSS шрифтов в документ
 */
export function injectFonts() {
  const css = generateFontsCSS();
  const styleElement = document.createElement('style');
  styleElement.id = 'custom-fonts';
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
}
