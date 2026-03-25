# Changelog

## SCSS Refactoring & UI Improvements

### SCSS Migration (7-1 Architecture)

Установлен `sass`. Все CSS переписаны в SCSS по 7-1 архитектуре:

```
src/styles/scss/
├── abstracts/   _variables.scss, _mixins.scss, _index.scss
├── base/        _reset.scss, _typography.scss
├── layout/      _container.scss
├── components/  _buttons, _header, _footer, _course-card, _sidebar, _testimonial
├── pages/       _all-courses, _auth, _course-page, _user-profile, _loading-spinner
└── main.scss
```

**abstracts/_variables.scss**
- Все `px` → `rem` (база 16px)
- Брейкпоинты: `$bp-sm/md/lg/xl`
- Spacing scale: `$space-1` … `$space-20`
- CSS custom properties для light/dark тем через `[data-theme="dark"]`

**abstracts/_mixins.scss**
- `respond($bp)` — медиазапросы по имени (`sm/md/lg/xl`)
- `fluid-type($min, $max)` — адаптивная типографика через `clamp()`
- `glass()`, `flex-center`, `flex-between`, `hover-lift`, `card`, `btn-reset`, `pseudo`

**Точка входа** — `src/index.js` импортирует `main.scss` вместо `global.css`

---

### Header

- Фон полностью прозрачный; при скролле — тёмный с `backdrop-filter: blur`
- Логотип увеличен до `clamp(2.25rem, 3rem)` → затем до `clamp(3rem, 4rem)` (×2)
- `logo-highlight` и `logo-text` — одинаковый цвет `var(--color-primary)`
- `logo-dot` — светло-фиолетовый `#b39ddb`
- Медиазапросы вложены внутрь селекторов (BEM + SCSS nesting)

---

### Home Page (Hero Section)

- Текст `hero-line` — белый `#ffffff`
- `hero-text` сдвинут вправо → затем отцентрирован по своей половине
- Расстояние между кнопками — `gap: 20px` → `clamp(0.75rem, 1.5vw, 1.25rem)`
- `image-wrapper` скрыт до `1024px`, квадратная форма через `aspect-ratio: 1/1`
- Fluid scaling всего `hero-content`: `h1`, `subtitle`, `gap`, `hero-image` через `clamp()`
- Мобильная версия (`≤432px`): блок по центру, кнопки стопкой, картинка скрыта
- Убран `min-height: 100vh` на `≤1025px` — пустое пространство сокращено

### Секции (video, code, courses, testimonials, cta)

- `padding: 120px 0` → `3.5rem` на `≤768px`, `2.5rem` на `≤480px`
- `section-header margin-bottom` уменьшен на мобиле

---

### CourseCard

- `.card-content h3, p { color: white !important }` — названия и описания курсов белые

### Typography

- Убраны глобальные `color` с `h1-h6` и `p` в `_typography.scss` — компоненты управляют цветом сами
