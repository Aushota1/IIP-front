# Папка для шрифтов

## Как добавить шрифт:

1. **Положите файлы шрифтов в эту папку** (`public/fonts/`)
   - Поддерживаемые форматы: `.ttf`, `.otf`, `.woff`, `.woff2`
   - Пример: `Roboto-Regular.ttf`, `OpenSans-Bold.woff2`

2. **Добавьте шрифт в конфигурацию** (`src/styles/fonts.config.js`)
   ```javascript
   export const fonts = [
     {
       family: 'Roboto',
       files: [
         { file: 'Roboto-Regular.ttf', weight: 400, style: 'normal' },
         { file: 'Roboto-Bold.ttf', weight: 700, style: 'normal' }
       ]
     }
   ];
   ```

3. **Перезапустите приложение** (если оно запущено)
   - Шрифты загрузятся автоматически!

4. **Используйте шрифт в CSS**
   ```css
   body {
     font-family: 'Roboto', sans-serif;
   }
   ```

## Параметры конфигурации:

- `family` - название семейства шрифта (используется в CSS)
- `file` - имя файла в папке `public/fonts/`
- `weight` - толщина шрифта (100-900, обычно 400 или 700)
- `style` - стиль шрифта (`'normal'` или `'italic'`)

## Примеры:

### Один шрифт с разными начертаниями:
```javascript
{
  family: 'Montserrat',
  files: [
    { file: 'Montserrat-Light.ttf', weight: 300, style: 'normal' },
    { file: 'Montserrat-Regular.ttf', weight: 400, style: 'normal' },
    { file: 'Montserrat-Bold.ttf', weight: 700, style: 'normal' },
    { file: 'Montserrat-Italic.ttf', weight: 400, style: 'italic' }
  ]
}
```

### Несколько разных шрифтов:
```javascript
export const fonts = [
  {
    family: 'Roboto',
    files: [
      { file: 'Roboto-Regular.ttf', weight: 400, style: 'normal' }
    ]
  },
  {
    family: 'OpenSans',
    files: [
      { file: 'OpenSans-Regular.woff2', weight: 400, style: 'normal' }
    ]
  }
];
```
