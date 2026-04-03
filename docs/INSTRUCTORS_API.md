# Instructors API

API для управления преподавателями курсов.

## Базовый URL
```
http://localhost:8002/instructors
```

## Эндпоинты

### 1. Получить всех преподавателей
```http
GET /instructors
```

**Ответ:**
```json
[
  {
    "id": 1,
    "name": "Иван Иванов",
    "position": "Senior Developer",
    "bio": "Опытный разработчик с 10+ годами опыта",
    "photo": "https://storage.example.com/instructors/photos/ivan.jpg",
    "social": [
      {
        "icon": "github",
        "url": "https://github.com/ivan"
      },
      {
        "icon": "linkedin",
        "url": "https://linkedin.com/in/ivan"
      }
    ],
    "created_at": "2026-04-02T10:00:00"
  }
]
```

### 2. Получить преподавателя по ID
```http
GET /instructors/{instructor_id}
```

**Параметры:**
- `instructor_id` (path) - ID преподавателя

**Ответ:** Объект преподавателя (см. выше)

### 3. Создать преподавателя
```http
POST /instructors
Authorization: Bearer <token>
```

**Требования:** Роль `admin` или `instructor`

**Тело запроса:**
```json
{
  "name": "Иван Иванов",
  "position": "Senior Developer",
  "bio": "Опытный разработчик с 10+ годами опыта",
  "photo": "https://storage.example.com/instructors/photos/ivan.jpg",
  "social": [
    {
      "icon": "github",
      "url": "https://github.com/ivan"
    }
  ]
}
```

**Ответ:** Созданный объект преподавателя с `id`

### 4. Обновить преподавателя
```http
PUT /instructors/{instructor_id}
Authorization: Bearer <token>
```

**Требования:** Роль `admin` или `instructor`

**Параметры:**
- `instructor_id` (path) - ID преподавателя

**Тело запроса:** (все поля опциональны)
```json
{
  "name": "Иван Петров",
  "position": "Lead Developer",
  "bio": "Обновленная биография",
  "photo": "https://storage.example.com/new-photo.jpg",
  "social": [...]
}
```

**Ответ:** Обновленный объект преподавателя

### 5. Удалить преподавателя
```http
DELETE /instructors/{instructor_id}
Authorization: Bearer <token>
```

**Требования:** Роль `admin`

**Параметры:**
- `instructor_id` (path) - ID преподавателя

**Ответ:**
```json
{
  "message": "Instructor deleted successfully"
}
```

### 6. Загрузить фото преподавателя
```http
POST /instructors/upload-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Требования:** Роль `admin` или `instructor`

**Тело запроса:**
- `file` (form-data) - Файл изображения

**Ответ:**
```json
{
  "url": "https://storage.example.com/instructors/photos/abc123.jpg"
}
```

### 7. Получить преподавателей курса
```http
GET /instructors/course/{course_id}
```

**Параметры:**
- `course_id` (path) - ID курса

**Ответ:** Массив преподавателей курса (отсортированы по `order_index`)

### 8. Добавить преподавателя к курсу
```http
POST /instructors/course/{course_id}/add/{instructor_id}?order_index=0
Authorization: Bearer <token>
```

**Требования:** Роль `admin` или `instructor`

**Параметры:**
- `course_id` (path) - ID курса
- `instructor_id` (path) - ID преподавателя
- `order_index` (query, optional) - Порядок отображения (по умолчанию 0)

**Ответ:**
```json
{
  "message": "Instructor added to course successfully"
}
```

### 9. Удалить преподавателя из курса
```http
DELETE /instructors/course/{course_id}/remove/{instructor_id}
Authorization: Bearer <token>
```

**Требования:** Роль `admin` или `instructor`

**Параметры:**
- `course_id` (path) - ID курса
- `instructor_id` (path) - ID преподавателя

**Ответ:**
```json
{
  "message": "Instructor removed from course successfully"
}
```

## Структура данных

### Instructor
```typescript
{
  id: number;
  name: string;
  position?: string;
  bio?: string;
  photo?: string;
  social?: InstructorSocial[];
  created_at?: string;
}
```

### InstructorSocial
```typescript
{
  icon?: string;  // Например: "github", "linkedin", "twitter"
  url?: string;   // URL профиля
}
```

## Связь с курсами

Преподаватели связаны с курсами через таблицу `course_instructors` (many-to-many):
- Один преподаватель может вести несколько курсов
- Один курс может иметь несколько преподавателей
- Порядок отображения контролируется полем `order_index`

## Миграция базы данных

Для создания таблиц выполните:
```bash
alembic upgrade head
```

Это применит миграцию `003_add_instructors_table.py`, которая создаст:
- Таблицу `instructors` - хранит данные преподавателей
- Таблицу `course_instructors` - связывает курсы и преподавателей

## Примеры использования

### Создание преподавателя и добавление к курсу
```bash
# 1. Создать преподавателя
curl -X POST http://localhost:8002/instructors \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Анна Смирнова",
    "position": "Full Stack Developer",
    "bio": "Специалист по веб-разработке"
  }'

# Ответ: {"id": 1, "name": "Анна Смирнова", ...}

# 2. Добавить к курсу
curl -X POST "http://localhost:8002/instructors/course/1/add/1?order_index=0" \
  -H "Authorization: Bearer <token>"
```

### Получение преподавателей курса
```bash
curl http://localhost:8002/instructors/course/1
```

### Загрузка фото
```bash
curl -X POST http://localhost:8002/instructors/upload-photo \
  -H "Authorization: Bearer <token>" \
  -F "file=@photo.jpg"
```
