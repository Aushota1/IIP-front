# Course Info API Documentation

API для получения краткой информации о программе курса (модули и уроки без контента секций).

## Base URL

**Через Gateway (рекомендуется):**
```
http://localhost:8000
```

**Напрямую к Course Service:**
```
http://localhost:8002
```

---

## Endpoint

### Получить структуру программы курса

**GET** `/courses-info/{course_id}`

Возвращает структуру программы курса: модули с уроками (без контента секций). Этот эндпоинт оптимизирован для отображения программы курса на странице курса.

#### Parameters
- `course_id` (path, integer, required) - ID курса

#### Response 200
```json
{
  "course_id": 1,
  "course_title": "Python для начинающих",
  "course_slug": "python-beginners",
  "modules": [
    {
      "id": 1,
      "title": "Основы программирования",
      "description": "Введение в основные концепции программирования",
      "order_index": 1,
      "lessons": [
        {
          "id": 1,
          "title": "Введение в Python",
          "description": "Краткое введение в язык программирования Python",
          "duration_minutes": 15,
          "order_index": 1
        },
        {
          "id": 2,
          "title": "Переменные и типы данных",
          "description": "Изучение переменных и основных типов данных",
          "duration_minutes": 20,
          "order_index": 2
        },
        {
          "id": 3,
          "title": "Условные операторы",
          "description": "Работа с if, elif, else",
          "duration_minutes": 25,
          "order_index": 3
        }
      ]
    },
    {
      "id": 2,
      "title": "Объектно-ориентированное программирование",
      "description": "Изучение ООП в Python",
      "order_index": 2,
      "lessons": [
        {
          "id": 4,
          "title": "Классы и объекты",
          "description": "Основы ООП: создание классов и объектов",
          "duration_minutes": 30,
          "order_index": 1
        },
        {
          "id": 5,
          "title": "Наследование",
          "description": "Принципы наследования в Python",
          "duration_minutes": 25,
          "order_index": 2
        }
      ]
    }
  ]
}
```

#### Response 404
```json
{
  "detail": "Course not found"
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/courses-info/1"
```

---

## Структура ответа

### CourseInfoResponse
- `course_id` (integer) - ID курса
- `course_title` (string) - название курса
- `course_slug` (string) - slug курса
- `modules` (array) - массив модулей

### ModuleInfo
- `id` (integer) - ID модуля
- `title` (string) - название модуля
- `description` (string, nullable) - описание модуля
- `order_index` (integer) - порядковый номер модуля
- `lessons` (array) - массив уроков

### LessonInfo
- `id` (integer) - ID урока
- `title` (string) - название урока
- `description` (string, nullable) - краткое описание урока
- `duration_minutes` (integer, nullable) - длительность урока в минутах
- `order_index` (integer) - порядковый номер урока

---

## Отличия от других эндпоинтов

### `/courses-info/{course_id}` vs `/courses-content/{course_id}`

| Характеристика | `/courses-info/{course_id}` | `/courses-content/{course_id}` |
|----------------|----------------------------|-------------------------------|
| Контент секций | ❌ Нет | ✅ Да (полный контент) |
| Размер ответа | Маленький | Большой |
| Использование | Программа курса | Полный контент для обучения |
| Поля урока | id, title, description, duration, order | id, title, description, duration, order, sections |

### `/courses-info/{course_id}` vs `/courses/{course_id}/modules`

| Характеристика | `/courses-info/{course_id}` | `/courses/{course_id}/modules` |
|----------------|----------------------------|-------------------------------|
| Формат | Оптимизирован для программы | Полная структура с метаданными |
| Поля модуля | id, title, description, order, lessons | id, course_id, title, description, order, lessons |
| Поля урока | id, title, description, duration, order | id, course_id, module_id, title, description, order, duration, completed |

---

## Use Cases

### 1. Отображение программы курса на странице курса
```javascript
// Получить структуру программы
const response = await fetch('http://localhost:8000/courses-info/1');
const courseInfo = await response.json();

// Отобразить модули и уроки
courseInfo.modules.forEach(module => {
  console.log(`Модуль: ${module.title}`);
  console.log(`Описание: ${module.description}`);
  
  module.lessons.forEach(lesson => {
    console.log(`  - ${lesson.title} (${lesson.duration_minutes} мин)`);
    console.log(`    ${lesson.description}`);
  });
});
```

### 2. Подсчет общей длительности курса
```javascript
const response = await fetch('http://localhost:8000/courses-info/1');
const courseInfo = await response.json();

let totalMinutes = 0;
courseInfo.modules.forEach(module => {
  module.lessons.forEach(lesson => {
    totalMinutes += lesson.duration_minutes || 0;
  });
});

console.log(`Общая длительность: ${totalMinutes} минут`);
```

### 3. Генерация оглавления курса
```javascript
const response = await fetch('http://localhost:8000/courses-info/1');
const courseInfo = await response.json();

const toc = courseInfo.modules.map(module => ({
  title: module.title,
  description: module.description,
  lessons: module.lessons.map(lesson => ({
    title: lesson.title,
    duration: lesson.duration_minutes
  }))
}));
```

---

## Performance

Этот эндпоинт оптимизирован для быстрой загрузки:
- Не загружает контент секций (JSON поля `sections`)
- Минимальный размер ответа
- Подходит для частых запросов на странице курса

---

## Related APIs

- [Course Content API](./COURSE_CONTENT_API.md) - полный контент курса с секциями
- [Modules API](./MODULES_API.md) - работа с модулями
- [Lessons API](./LESSONS_API.md) - работа с уроками
