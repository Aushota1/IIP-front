# Lessons API Documentation

API для работы с уроками курсов. Уроки содержат структурированный контент (текст, код, формулы, изображения, видео) в формате JSON.

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

## Endpoints

### 1. Получить все уроки курса

**GET** `/courses/{course_id}/lessons`

Возвращает список всех уроков курса (без содержимого sections).

#### Parameters
- `course_id` (path, integer, required) - ID курса

#### Response 200
```json
[
  {
    "id": 1,
    "course_id": 5,
    "module_id": 10,
    "title": "Введение в Python",
    "description": "Краткое введение в язык программирования Python",
    "order_index": 1,
    "duration_minutes": 15,
    "completed": false
  },
  {
    "id": 2,
    "course_id": 5,
    "module_id": 10,
    "title": "Переменные и типы данных",
    "description": "Изучение переменных и основных типов данных",
    "order_index": 2,
    "duration_minutes": 20,
    "completed": false
  }
]
```

#### Example
```bash
curl -X GET "http://localhost:8000/courses/5/lessons"
```

---

### 2. Получить уроки модуля

**GET** `/courses/{course_id}/modules/{module_id}/lessons`

Возвращает список уроков конкретного модуля.

#### Parameters
- `course_id` (path, integer, required) - ID курса
- `module_id` (path, integer, required) - ID модуля

#### Response 200
```json
[
  {
    "id": 1,
    "course_id": 5,
    "module_id": 10,
    "title": "Введение в Python",
    "description": "Краткое введение в язык программирования Python",
    "order_index": 1,
    "duration_minutes": 15,
    "completed": false
  }
]
```

#### Example
```bash
curl -X GET "http://localhost:8000/courses/5/modules/10/lessons"
```

---

### 3. Получить урок с контентом

**GET** `/lessons/{lesson_id}`

Возвращает полный урок со всеми секциями контента.

#### Parameters
- `lesson_id` (path, integer, required) - ID урока

#### Response 200
```json
{
  "id": 1,
  "course_id": 5,
  "module_id": 10,
  "title": "Введение в Python",
  "description": "Краткое введение в язык программирования Python",
  "order_index": 1,
  "duration_minutes": 15,
  "sections": [
    {
      "id": 1,
      "type": "text",
      "content": "Python - это высокоуровневый язык программирования..."
    },
    {
      "id": 2,
      "type": "code",
      "language": "python",
      "content": "print('Hello, World!')"
    },
    {
      "id": 3,
      "type": "formula",
      "title": "Формула площади круга",
      "content": "S = \\pi r^2"
    },
    {
      "id": 4,
      "type": "image",
      "url": "https://storage.example.com/images/python-logo.png",
      "alt": "Логотип Python"
    },
    {
      "id": 5,
      "type": "video",
      "url": "https://youtube.com/watch?v=abc123",
      "title": "Введение в Python"
    }
  ]
}
```

#### Response 404
```json
{
  "detail": "Lesson not found"
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/lessons/1"
```

---

### 4. Создать урок

**POST** `/courses/{course_id}/modules/{module_id}/lessons`

Создает новый урок в модуле. Требуется авторизация (admin/instructor).

#### Parameters
- `course_id` (path, integer, required) - ID курса
- `module_id` (path, integer, required) - ID модуля

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Введение в Python",
  "description": "Краткое введение в язык программирования Python",
  "order_index": 1,
  "duration_minutes": 15,
  "sections": [
    {
      "id": 1,
      "type": "text",
      "content": "Python - это высокоуровневый язык программирования..."
    },
    {
      "id": 2,
      "type": "code",
      "language": "python",
      "content": "print('Hello, World!')"
    },
    {
      "id": 3,
      "type": "formula",
      "title": "Квадратное уравнение",
      "content": "ax^2 + bx + c = 0"
    },
    {
      "id": 4,
      "type": "image",
      "url": "https://storage.example.com/images/diagram.png",
      "alt": "Диаграмма"
    }
  ]
}
```

#### Response 201
```json
{
  "id": 1,
  "course_id": 5,
  "module_id": 10,
  "title": "Введение в Python",
  "description": "Краткое введение в язык программирования Python",
  "order_index": 1,
  "duration_minutes": 15,
  "sections": [...]
}
```

#### Response 401
```json
{
  "detail": "Authorization token missing"
}
```

#### Response 403
```json
{
  "detail": "Only admins or instructors can create lessons"
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
curl -X POST "http://localhost:8000/courses/5/modules/10/lessons" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Введение в Python",
    "description": "Краткое введение в язык программирования Python",
    "order_index": 1,
    "duration_minutes": 15,
    "sections": [
      {
        "id": 1,
        "type": "text",
        "content": "Python - это высокоуровневый язык программирования..."
      }
    ]
  }'
```

---

### 5. Обновить урок

**PUT** `/lessons/{lesson_id}`

Обновляет существующий урок. Требуется авторизация (admin/instructor).

#### Parameters
- `lesson_id` (path, integer, required) - ID урока

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
Все поля опциональны. Обновляются только переданные поля.

```json
{
  "title": "Введение в Python (обновлено)",
  "order_index": 2,
  "duration_minutes": 20,
  "sections": [
    {
      "id": 1,
      "type": "text",
      "content": "Обновленный текст урока..."
    }
  ]
}
```

#### Response 200
```json
{
  "id": 1,
  "course_id": 5,
  "module_id": 10,
  "title": "Введение в Python (обновлено)",
  "order_index": 2,
  "duration_minutes": 20,
  "sections": [...]
}
```

#### Response 401/403/404
Аналогично POST запросу.

#### Example
```bash
curl -X PUT "http://localhost:8000/lessons/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Введение в Python (обновлено)",
    "duration_minutes": 20
  }'
```

---

### 6. Удалить урок

**DELETE** `/lessons/{lesson_id}`

Удаляет урок. Требуется авторизация (только admin).

#### Parameters
- `lesson_id` (path, integer, required) - ID урока

#### Headers
```
Authorization: Bearer <token>
```

#### Response 204
Успешное удаление (без тела ответа).

#### Response 401
```json
{
  "detail": "Authorization token missing"
}
```

#### Response 403
```json
{
  "detail": "Only admins can delete lessons"
}
```

#### Response 404
```json
{
  "detail": "Lesson not found"
}
```

#### Example
```bash
curl -X DELETE "http://localhost:8000/lessons/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Section Types

Урок состоит из массива секций (`sections`). Каждая секция имеет тип:

### 1. Text (Текст)
```json
{
  "id": 1,
  "type": "text",
  "content": "Текст урока в формате plain text или markdown"
}
```

### 2. Code (Код)
```json
{
  "id": 2,
  "type": "code",
  "language": "python",
  "content": "def hello():\n    print('Hello, World!')"
}
```

Поддерживаемые языки: `python`, `javascript`, `typescript`, `jsx`, `tsx`, `css`, `scss`, `bash`, `json`, и др.

### 3. Formula (Формула)
```json
{
  "id": 3,
  "type": "formula",
  "title": "Теорема Пифагора",
  "content": "a^2 + b^2 = c^2"
}
```

Формулы используют LaTeX синтаксис и рендерятся через KaTeX.

### 4. Image (Изображение)
```json
{
  "id": 4,
  "type": "image",
  "url": "https://storage.example.com/images/diagram.png",
  "alt": "Описание изображения"
}
```

### 5. Video (Видео)
```json
{
  "id": 5,
  "type": "video",
  "url": "https://youtube.com/watch?v=abc123",
  "title": "Название видео"
}
```

---

## Authorization

Для создания, обновления и удаления уроков требуется JWT токен в заголовке:

```
Authorization: Bearer <your_jwt_token>
```

### Роли:
- **admin** - может создавать, обновлять и удалять уроки
- **instructor** - может создавать и обновлять уроки
- **student** - только чтение (GET запросы)

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Authorization token missing"
}
```

### 403 Forbidden
```json
{
  "detail": "Only admins or instructors can create lessons"
}
```

### 404 Not Found
```json
{
  "detail": "Lesson not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

---

## Workflow Example

### Создание полного урока с разными типами контента:

```bash
# 1. Получить токен (логин)
TOKEN=$(curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}' \
  | jq -r '.access_token')

# 2. Создать урок
curl -X POST "http://localhost:8000/courses/1/modules/1/lessons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Основы Python",
    "order_index": 1,
    "duration_minutes": 30,
    "sections": [
      {
        "id": 1,
        "type": "text",
        "content": "Python - мощный язык программирования"
      },
      {
        "id": 2,
        "type": "code",
        "language": "python",
        "content": "print(\"Hello, World!\")"
      },
      {
        "id": 3,
        "type": "formula",
        "content": "f(x) = x^2 + 2x + 1"
      }
    ]
  }'

# 3. Получить урок
curl -X GET "http://localhost:8000/lessons/1"

# 4. Обновить урок
curl -X PUT "http://localhost:8000/lessons/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "duration_minutes": 45
  }'
```

---

## Notes

- Поле `sections` хранится в БД как JSONB (PostgreSQL)
- Порядок секций определяется их позицией в массиве
- ID секций должны быть уникальными в рамках одного урока
- URL изображений и видео должны быть загружены заранее через `/upload/course-image` или внешние сервисы
- Формулы поддерживают полный LaTeX синтаксис
