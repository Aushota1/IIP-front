# Admin Panel API Documentation

## Обзор
Документация описывает API endpoints для административной панели управления курсами, преподавателями и уроками.

---

## 1. Курсы (Courses)

### 1.1 Создание/Обновление курса
**Endpoint:** `POST /api/courses`

**Отправляемые данные:**
```json
{
  "slug": "algorithm-rush",
  "title": "Алгоритмы и структуры данных",
  "excerpt": "Освойте алгоритмы и структуры данных",
  "description": "Полное описание курса...",
  "level": "beginner",
  "duration": "8 недель",
  "price": "4 900 ₽",
  "image": "https://example.com/image.jpg"
}
```

**Получаемый ответ:**
```json
{
  "id": 1,
  "slug": "algorithm-rush",
  "title": "Алгоритмы и структуры данных",
  "excerpt": "Освойте алгоритмы и структуры данных",
  "description": "Полное описание курса...",
  "level": "beginner",
  "duration": "8 недель",
  "price": "4 900 ₽",
  "image": "https://example.com/image.jpg",
  "created_at": "2024-03-15T10:30:00Z",
  "updated_at": "2024-03-15T10:30:00Z"
}
```

### 1.2 Загрузка изображения курса
**Endpoint:** `POST /api/courses/upload-image`

**Отправляемые данные:** FormData с файлом
```javascript
const formData = new FormData();
formData.append('file', imageFile);
```

**Получаемый ответ:**
```json
{
  "url": "https://example.com/uploads/course-image-123.jpg"
}
```

### 1.3 Получение всех курсов
**Endpoint:** `GET /api/courses`

**Получаемый ответ:**
```json
[
  {
    "id": 1,
    "slug": "algorithm-rush",
    "title": "Алгоритмы и структуры данных",
    "excerpt": "Освойте алгоритмы и структуры данных",
    "description": "Полное описание курса...",
    "level": "beginner",
    "duration": "8 недель",
    "price": "4 900 ₽",
    "image": "https://example.com/image.jpg",
    "instructors": [...],
    "program": [...]
  }
]
```

---

## 2. Преподаватели (Instructors)

### 2.1 Создание преподавателя
**Endpoint:** `POST /api/instructors`

**Отправляемые данные:**
```json
{
  "course_id": 1,
  "name": "Анна Серова",
  "position": "Senior разработчик",
  "bio": "Опыт более 7 лет в разработке",
  "photo": "https://example.com/photo.jpg",
  "social": [
    {
      "platform": "github",
      "url": "https://github.com/username"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/in/username"
    }
  ]
}
```

**Получаемый ответ:**
```json
{
  "id": 1,
  "course_id": 1,
  "name": "Анна Серова",
  "position": "Senior разработчик",
  "bio": "Опыт более 7 лет в разработке",
  "photo": "https://example.com/photo.jpg",
  "social": [
    {
      "platform": "github",
      "url": "https://github.com/username"
    }
  ],
  "created_at": "2024-03-15T10:30:00Z"
}
```

### 2.2 Получение преподавателей курса
**Endpoint:** `GET /api/instructors?course_id=1`

**Получаемый ответ:**
```json
[
  {
    "id": 1,
    "course_id": 1,
    "name": "Анна Серова",
    "position": "Senior разработчик",
    "bio": "Опыт более 7 лет в разработке",
    "photo": "https://example.com/photo.jpg",
    "social": [...]
  }
]
```

### 2.3 Обновление преподавателя
**Endpoint:** `PUT /api/instructors/{instructor_id}`

**Отправляемые данные:** (те же поля что и при создании)

### 2.4 Удаление преподавателя
**Endpoint:** `DELETE /api/instructors/{instructor_id}`

**Получаемый ответ:**
```json
{
  "message": "Instructor deleted successfully"
}
```

---

## 3. Уроки/Контент курса (Lessons/Content)

### 3.1 Создание урока
**Endpoint:** `POST /api/courses/{course_id}/lessons`

**Отправляемые данные:**
```json
{
  "title": "Урок 1: Введение в алгоритмы",
  "description": "Изучаем основы алгоритмов и Big O нотацию",
  "duration": "30 мин",
  "order": 1,
  "content_type": "video",
  "content_url": "https://example.com/video.mp4",
  "materials": [
    {
      "type": "pdf",
      "title": "Конспект урока",
      "url": "https://example.com/materials/lesson1.pdf"
    }
  ]
}
```

**Получаемый ответ:**
```json
{
  "content_id": 1,
  "course_id": 1,
  "title": "Урок 1: Введение в алгоритмы",
  "description": "Изучаем основы алгоритмов и Big O нотацию",
  "duration": "30 мин",
  "order": 1,
  "content_type": "video",
  "content_url": "https://example.com/video.mp4",
  "materials": [...],
  "created_at": "2024-03-15T10:30:00Z"
}
```

### 3.2 Получение уроков курса
**Endpoint:** `GET /api/courses/{course_id}/lessons`

**Получаемый ответ:**
```json
[
  {
    "content_id": 1,
    "course_id": 1,
    "title": "Урок 1: Введение в алгоритмы",
    "description": "Изучаем основы алгоритмов и Big O нотацию",
    "duration": "30 мин",
    "order": 1,
    "content_type": "video",
    "content_url": "https://example.com/video.mp4",
    "materials": [...]
  },
  {
    "content_id": 2,
    "course_id": 1,
    "title": "Урок 2: Сортировки",
    "description": "Разбираем алгоритмы сортировки",
    "duration": "45 мин",
    "order": 2,
    "content_type": "video",
    "content_url": "https://example.com/video2.mp4",
    "materials": []
  }
]
```

### 3.3 Обновление урока
**Endpoint:** `PUT /api/courses/{course_id}/lessons/{lesson_id}`

**Отправляемые данные:** (те же поля что и при создании)

### 3.4 Удаление урока
**Endpoint:** `DELETE /api/courses/{course_id}/lessons/{lesson_id}`

**Получаемый ответ:**
```json
{
  "message": "Lesson deleted successfully"
}
```

### 3.5 Изменение порядка уроков
**Endpoint:** `PUT /api/courses/{course_id}/lessons/reorder`

**Отправляемые данные:**
```json
{
  "lessons": [
    { "content_id": 2, "order": 1 },
    { "content_id": 1, "order": 2 },
    { "content_id": 3, "order": 3 }
  ]
}
```

**Получаемый ответ:**
```json
{
  "message": "Lessons reordered successfully"
}
```

---

## 4. Загрузка файлов

### 4.1 Загрузка фото преподавателя
**Endpoint:** `POST /api/instructors/upload-photo`

**Отправляемые данные:** FormData с файлом

**Получаемый ответ:**
```json
{
  "url": "https://example.com/uploads/instructor-photo-123.jpg"
}
```

### 4.2 Загрузка материалов урока
**Endpoint:** `POST /api/lessons/upload-material`

**Отправляемые данные:** FormData с файлом

**Получаемый ответ:**
```json
{
  "url": "https://example.com/uploads/materials/lesson-material-123.pdf",
  "filename": "lesson-material-123.pdf",
  "size": 1024000
}
```

---

## Типы данных

### Level (уровень курса)
- `beginner` - Начальный
- `intermediate` - Средний
- `advanced` - Продвинутый

### Content Type (тип контента урока)
- `video` - Видео урок
- `text` - Текстовый материал
- `quiz` - Тест/Квиз
- `practice` - Практическое задание

### Social Platform (социальные сети)
- `github`
- `linkedin`
- `twitter`
- `website`

---

## Коды ошибок

- `400` - Неверные данные запроса
- `401` - Не авторизован
- `403` - Доступ запрещен (не админ)
- `404` - Ресурс не найден
- `409` - Конфликт (например, slug уже существует)
- `500` - Внутренняя ошибка сервера

**Формат ошибки:**
```json
{
  "detail": "Описание ошибки"
}
```
