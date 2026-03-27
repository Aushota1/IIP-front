# Структура страниц и секций

## Home.js — Главная страница

Все стили находятся внутри `<style jsx>{...}</style>` в конце компонента.

---

### Секции (сверху вниз)

| id / className | Что отображает |
|---|---|
| `#home` `.hero-section` | Главный экран: заголовок, подзаголовок, кнопки, картинка |
| `#video` `.video-section` | Демо-видео с описанием "Как мы учим?" |
| `#code` `.code-section` | Интерактивный редактор кода / демонстрация обучения |
| `#courses` `.courses-section` | Сетка карточек курсов |
| `#testimonials` `.testimonials-section` | Карусель отзывов выпускников |
| `.cta-section` | Призыв к действию: форма с email |

---

### Ключевые объекты внутри hero-section

| Класс | Роль |
|---|---|
| `.hero-content` | Flex-контейнер: текст слева, картинка справа |
| `.hero-text` | Левая половина: заголовок + подзаголовок + кнопки |
| `.hero-line` | Каждая строка заголовка (`<span>`) |
| `.hero-subtitle` | Подзаголовок под h1 |
| `.buttons` | Контейнер кнопок "Выбрать курс" и "Узнать больше" |
| `.hero-image` | Правая половина: обёртка картинки |
| `.image-wrapper` | Сама картинка с overlay (скрыта до 1024px) |

---

## Компоненты (src/components/)

| Файл | Что делает |
|---|---|
| `Header.js` | Фиксированная шапка: логотип, навигация, кнопки входа |
| `Footer.js` | Подвал: колонки ссылок, соцсети, копирайт |
| `CourseCard.js` | Карточка курса с glass-эффектом (используется на главной) |
| `Sidebar.js` | Боковое меню (гамбургер) |
| `Testimonial.js` | Одна карточка отзыва |
| `TestimonialCarousel.jsx` | Карусель из Testimonial-карточек |
| `LoadingSpinner.js` | Спиннер загрузки |
| `TaskCard.js` | Карточка задачи |
| `CodeBlock.jsx` | Блок с подсветкой кода |

---

## Страницы (src/pages/)

| Файл | Маршрут | Что делает |
|---|---|---|
| `Home.js` | `/` | Главная страница |
| `AllCourses.js` | `/courses` | Список всех курсов с фильтрами |
| `CoursePage.js` | `/courses/:slug` | Страница отдельного курса |
| `LoginPage.js` | `/login` | Форма входа |
| `RegisterPage.js` | `/register` | Форма регистрации |
| `VerifyEmailPage.js` | `/verify-email` | Подтверждение email |
| `UserProfile.js` | `/profile` | Профиль пользователя, прогресс курсов |
| `TasksList.js` | `/tasks` | Список задач (GitHub-стиль) |
| `TaskDetail.js` | `/tasks/:id` | Детальная страница задачи |
| `About.js` | `/about` | О проекте |

---

## SCSS структура (src/styles/scss/)

| Папка / файл | Роль |
|---|---|
| `abstracts/_variables.scss` | Все токены: цвета, spacing, брейкпоинты, z-index |
| `abstracts/_mixins.scss` | Миксины: `respond()`, `fluid-type()`, `glass()`, `flex-*` |
| `base/_reset.scss` | Минимальный CSS reset |
| `base/_typography.scss` | Шрифты, fluid heading scale |
| `layout/_container.scss` | `.container`, `.section`, `.section-title` |
| `components/_header.scss` | Стили Header |
| `components/_footer.scss` | Стили Footer |
| `components/_course-card.scss` | Стили CourseCard |
| `components/_buttons.scss` | Общие стили кнопок |
| `components/_sidebar.scss` | Стили Sidebar |
| `components/_testimonial.scss` | Стили Testimonial |
| `pages/_all-courses.scss` | Стили AllCourses |
| `pages/_auth.scss` | Стили Login / Register |
| `pages/_course-page.scss` | Стили CoursePage |
| `pages/_user-profile.scss` | Стили UserProfile |
| `pages/_loading-spinner.scss` | Стили спиннера |
| `main.scss` | Точка входа, импортирует всё |

---

## Брейкпоинты

| Переменная | rem | px | Применение |
|---|---|---|---|
| `$bp-sm` | 36rem | 576px | Мобильные (маленькие) |
| `$bp-md` | 48rem | 768px | Мобильные (большие) / планшеты |
| `$bp-lg` | 62rem | 992px | Планшеты / небольшие десктопы |
| `$bp-xl` | 75rem | 1200px | Десктоп |
| — | ~64rem | 1024px | Скрытие image-wrapper в hero |
| — | ~64rem | 1025px | Убирается min-height у hero-section |
