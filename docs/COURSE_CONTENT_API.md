# Course Content API

## Описание

Эндпоинт для получения полного содержимого курса, включая все модули и уроки с их секциями.

## Эндпоинт

```
GET /api/courses-content/{course_id}
```

## Параметры

- `course_id` (integer, required) - ID курса

## Ответ

### Успешный ответ (200 OK)

```json
{
  "course_id": 1,
  "course_title": "алгоритмы",
  "course_slug": "alg",
  "modules": [
    {
      "id": 1,
      "title": "Введение в алгоритмы",
      "order_index": 1,
      "lessons": [
        {
          "id": 1,
          "course_id": 1,
          "module_id": 1,
          "title": "Урок 1",
          "order_index": 1,
          "duration_minutes": 30,
          "sections": [
            {
              "id": 1,
              "type": "text",
              "content": "Введение в алгоритмы"
            },
            {
              "id": 2,
              "type": "text",
              "content": "На этом курсе мы изучим самую важную команду:"
            },
            {
              "id": 3,
              "type": "code",
              "content": "print(0)",
              "language": "python"
            },
            {
              "id": 4,
              "type": "formula",
              "content": "O(n^2)"
            },
            {
              "id": 5,
              "type": "image",
              "url": "https://example.com/image.png",
              "alt": "Описание изображения"
            },
            {
              "id": 6,
              "type": "video",
              "url": "https://example.com/video.mp4",
              "title": "Название видео"
            }
          ]
        }
      ]
    }
  ]
}
```

## Структура данных

### CourseContentResponse

| Поле | Тип | Описание |
|------|-----|----------|
| `course_id` | integer | ID курса |
| `course_title` | string | Название курса |
| `course_slug` | string | Slug курса (используется в URL) |
| `modules` | array | Массив модулей курса |

### Module

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID модуля |
| `title` | string | Название модуля |
| `order_index` | integer | Порядковый номер модуля |
| `lessons` | array | Массив уроков модуля |

### Lesson

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID урока |
| `course_id` | integer | ID курса |
| `module_id` | integer | ID модуля |
| `title` | string | Название урока |
| `order_index` | integer | Порядковый номер урока в модуле |
| `duration_minutes` | integer | Длительность урока в минутах |
| `sections` | array | Массив секций урока |

### Section

Секция - это элемент содержимого урока. Может быть разных типов:

#### Текстовая секция (type: "text")

```json
{
  "id": 1,
  "type": "text",
  "content": "Текстовое содержимое"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID секции |
| `type` | string | Тип секции: "text" |
| `content` | string | Текстовое содержимое |
| `title` | string (optional) | Заголовок секции |

#### Код (type: "code")

```json
{
  "id": 2,
  "type": "code",
  "content": "print('Hello, World!')",
  "language": "python"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID секции |
| `type` | string | Тип секции: "code" |
| `content` | string | Код |
| `language` | string | Язык программирования (python, javascript, java и т.д.) |
| `title` | string (optional) | Заголовок блока кода |

#### Формула (type: "formula")

```json
{
  "id": 3,
  "type": "formula",
  "content": "O(n^2)"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID секции |
| `type` | string | Тип секции: "formula" |
| `content` | string | Математическая формула (LaTeX или текст) |
| `title` | string (optional) | Заголовок формулы |

#### Изображение (type: "image")

```json
{
  "id": 4,
  "type": "image",
  "url": "https://example.com/image.png",
  "alt": "Описание изображения"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID секции |
| `type` | string | Тип секции: "image" |
| `url` | string | URL изображения |
| `alt` | string (optional) | Альтернативный текст для изображения |
| `title` | string (optional) | Заголовок изображения |

#### Видео (type: "video")

```json
{
  "id": 5,
  "type": "video",
  "url": "https://example.com/video.mp4",
  "title": "Название видео"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID секции |
| `type` | string | Тип секции: "video" |
| `url` | string | URL видео |
| `title` | string (optional) | Название видео |

## Ошибки

### 404 Not Found

Курс с указанным ID не найден.

```json
{
  "detail": "Course not found"
}
```

## Примеры использования

### cURL

```bash
curl -X GET "http://localhost:8000/api/courses-content/1"
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:8000/api/courses-content/1');
const courseContent = await response.json();

console.log(`Курс: ${courseContent.course_title}`);
console.log(`Модулей: ${courseContent.modules.length}`);

courseContent.modules.forEach(module => {
  console.log(`\nМодуль: ${module.title}`);
  module.lessons.forEach(lesson => {
    console.log(`  Урок: ${lesson.title} (${lesson.duration_minutes} мин)`);
    console.log(`  Секций: ${lesson.sections.length}`);
  });
});
```

### Python (requests)

```python
import requests

response = requests.get('http://localhost:8000/api/courses-content/1')
course_content = response.json()

print(f"Курс: {course_content['course_title']}")
print(f"Модулей: {len(course_content['modules'])}")

for module in course_content['modules']:
    print(f"\nМодуль: {module['title']}")
    for lesson in module['lessons']:
        print(f"  Урок: {lesson['title']} ({lesson['duration_minutes']} мин)")
        print(f"  Секций: {len(lesson['sections'])}")
```

## Особенности

- Модули возвращаются в порядке `order_index`
- Уроки внутри каждого модуля также отсортированы по `order_index`
- Все секции урока включены в ответ (полное содержимое)
- Эндпоинт не требует авторизации (публичный доступ)
- Подходит для отображения полной структуры курса на фронтенде

## Связанные эндпоинты

- `GET /api/courses/{course_id}` - Получить информацию о курсе (без уроков)
- `GET /api/courses/{course_id}/modules` - Получить модули курса (с краткой информацией об уроках, без секций)
- `GET /api/lessons/{lesson_id}` - Получить конкретный урок со всеми секциями
