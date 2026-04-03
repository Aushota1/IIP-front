# User Activity & Progress API Documentation

API для работы с активностью пользователя и прогрессом прохождения курсов.

## Base URL

**Через Gateway (рекомендуется):**
```
http://localhost:8000
```

**Напрямую к сервисам:**
- Progress Service: `http://localhost:8003`
- Activity Service: `http://localhost:8004`

---

## Progress Service

### 1. Записаться на курс

**POST** `/progress/enroll`

Записывает пользователя на курс и создает запись прогресса.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "course_id": 1
}
```

#### Response 200
```json
{
  "course_id": 1,
  "progress_percent": 0.0,
  "last_activity": null,
  "streak_days": 0,
  "completed_lessons": []
}
```

#### Response 400
```json
{
  "detail": "User already enrolled in this course"
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
curl -X POST "http://localhost:8000/progress/enroll" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1}'
```

---

### 2. Получить мои курсы

**GET** `/progress/my-courses`

Возвращает список всех курсов, на которые записан пользователь, с прогрессом.

#### Headers
```
Authorization: Bearer <token>
```

#### Response 200
```json
[
  {
    "course_id": 1,
    "progress_percent": 45.5,
    "last_activity": "2026-04-03T10:30:00",
    "streak_days": 3,
    "completed_lessons": [1, 2, 5, 8, 10]
  },
  {
    "course_id": 2,
    "progress_percent": 12.0,
    "last_activity": "2026-04-02T15:20:00",
    "streak_days": 1,
    "completed_lessons": [3, 7]
  }
]
```

#### Example
```bash
curl -X GET "http://localhost:8000/progress/my-courses" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Получить прогресс по курсу

**GET** `/progress/{course_id}`

Возвращает прогресс пользователя по конкретному курсу.

#### Parameters
- `course_id` (path, integer, required) - ID курса

#### Headers
```
Authorization: Bearer <token>
```

#### Response 200
```json
{
  "course_id": 1,
  "progress_percent": 45.5,
  "last_activity": "2026-04-03T10:30:00",
  "streak_days": 3,
  "completed_lessons": [1, 2, 5, 8, 10]
}
```

#### Response 404
```json
{
  "detail": "Not enrolled or no progress found for this course"
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/progress/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Отметить урок как завершенный

**POST** `/progress/complete-lesson`

Отмечает урок как завершенный и обновляет прогресс по курсу.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "course_id": 1,
  "content_id": 5
}
```

**Важно:** `content_id` - это ID из таблицы `course_content`, а не `lessons`.

#### Response 200
```json
{
  "detail": "Lesson marked as completed",
  "progress_percent": 50.0
}
```

#### Response 403
```json
{
  "detail": "User is not enrolled in this course"
}
```

#### Response 404
```json
{
  "detail": "Content not found"
}
```

#### Response 400
```json
{
  "detail": "Content does not belong to the specified course"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/progress/complete-lesson" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "content_id": 5}'
```

---

### 5. Отменить завершение урока

**POST** `/progress/undo-complete-lesson`

Удаляет отметку о завершении урока и пересчитывает прогресс.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "course_id": 1,
  "content_id": 5
}
```

#### Response 200
```json
{
  "detail": "Lesson marked as not completed",
  "progress_percent": 40.0
}
```

#### Response 400
```json
{
  "detail": "Lesson is not marked as completed"
}
```

#### Response 403
```json
{
  "detail": "User is not enrolled in this course"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/progress/undo-complete-lesson" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "content_id": 5}'
```

---

### 6. Получить количество завершенных заданий

**GET** `/progress/task/completed-count`

Возвращает общее количество завершенных уроков пользователя.

#### Headers
```
Authorization: Bearer <token>
```

#### Response 200
```json
{
  "count": 15
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/progress/task/completed-count" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. Отправить задание

**POST** `/progress/assignments/{assignment_id}/submit`

Отправляет решение задания на проверку.

#### Parameters
- `assignment_id` (path, integer, required) - ID задания

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "submission": "Текст решения задания или ссылка на репозиторий"
}
```

#### Response 200
```json
{
  "detail": "Assignment submitted successfully"
}
```

#### Response 403
```json
{
  "detail": "User is not enrolled in the course for this assignment"
}
```

#### Response 404
```json
{
  "detail": "Assignment not found"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/progress/assignments/10/submit" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"submission": "https://github.com/user/repo"}'
```

---

## Activity Service

### 8. Создать лог активности

**POST** `/activity/logs`

Создает запись в логе активности пользователя. Обычно вызывается автоматически другими сервисами.

#### Request Body
```json
{
  "user_id": 1,
  "action": "Started course \"Python для начинающих\"",
  "related_object_type": "course",
  "related_object_id": 5
}
```

#### Response 201
```json
{
  "detail": "log created"
}
```

#### Response 400
```json
{
  "detail": "Log entry must include user_id and action"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/activity/logs" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "action": "Completed lesson 5",
    "related_object_type": "lesson",
    "related_object_id": 5
  }'
```

---

### 9. Получить мои логи активности

**GET** `/activity/logs`

Возвращает историю активности пользователя, сгруппированную по датам.

#### Headers
```
Authorization: Bearer <token>
```

#### Response 200
```json
{
  "2026-04-03": {
    "count": 5,
    "details": [
      "Started course \"Python для начинающих\"",
      "Updated progress in course 1: completed lessons 3",
      "Submitted assignment 10 for course 1",
      "Posted question 'Как работает декоратор?' in course 1",
      "Answered question 15"
    ]
  },
  "2026-04-02": {
    "count": 2,
    "details": [
      "Updated progress in course 2: completed lessons 1",
      "Started course \"Алгоритмы\""
    ]
  }
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/activity/logs" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. Получить стрик выполнения заданий

**GET** `/activity/streak`

Возвращает количество дней подряд, в которые пользователь выполнял задания или отправлял домашние работы.

#### Headers
```
Authorization: Bearer <token>
```

#### Response 200
```json
{
  "streak": 7
}
```

**Примечание:** Стрик считается только для действий:
- Отправка заданий (Submitted assignment)
- Завершение уроков (completed lessons)

#### Example
```bash
curl -X GET "http://localhost:8000/activity/streak" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Q&A (Вопросы и ответы)

### 11. Получить вопросы по курсу

**GET** `/activity/questions?course_id={course_id}`

Возвращает список вопросов по курсу.

#### Parameters
- `course_id` (query, integer, required) - ID курса

#### Response 200
```json
[
  {
    "id": 1,
    "user_id": 5,
    "course_id": 1,
    "title": "Как работает декоратор @property?",
    "body": "Не могу понять разницу между методом и свойством",
    "created_at": "2026-04-03T10:30:00"
  },
  {
    "id": 2,
    "user_id": 8,
    "course_id": 1,
    "title": "Ошибка при импорте модуля",
    "body": null,
    "created_at": "2026-04-02T15:20:00"
  }
]
```

#### Example
```bash
curl -X GET "http://localhost:8000/activity/questions?course_id=1"
```

---

### 12. Получить вопрос с ответами

**GET** `/activity/questions/{question_id}`

Возвращает вопрос со всеми ответами.

#### Parameters
- `question_id` (path, integer, required) - ID вопроса

#### Response 200
```json
{
  "id": 1,
  "user_id": 5,
  "course_id": 1,
  "title": "Как работает декоратор @property?",
  "body": "Не могу понять разницу между методом и свойством",
  "created_at": "2026-04-03T10:30:00",
  "answers": [
    {
      "id": 1,
      "question_id": 1,
      "user_id": 3,
      "body": "@property позволяет обращаться к методу как к атрибуту...",
      "created_at": "2026-04-03T11:00:00",
      "upvotes": 5,
      "downvotes": 0
    },
    {
      "id": 2,
      "question_id": 1,
      "user_id": 7,
      "body": "Вот пример кода...",
      "created_at": "2026-04-03T12:15:00",
      "upvotes": 2,
      "downvotes": 1
    }
  ]
}
```

#### Response 404
```json
{
  "detail": "Question not found"
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/activity/questions/1"
```

---

### 13. Задать вопрос

**POST** `/activity/questions`

Создает новый вопрос по курсу.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "course_id": 1,
  "title": "Как работает декоратор @property?",
  "body": "Не могу понять разницу между методом и свойством"
}
```

**Примечание:** Поле `body` опциональное.

#### Response 201
```json
{
  "id": 1,
  "user_id": 5,
  "course_id": 1,
  "title": "Как работает декоратор @property?",
  "body": "Не могу понять разницу между методом и свойством",
  "created_at": "2026-04-03T10:30:00"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/activity/questions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1,
    "title": "Как работает декоратор @property?",
    "body": "Не могу понять разницу между методом и свойством"
  }'
```

---

### 14. Ответить на вопрос

**POST** `/activity/questions/{question_id}/answers`

Добавляет ответ на вопрос.

#### Parameters
- `question_id` (path, integer, required) - ID вопроса

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "body": "@property позволяет обращаться к методу как к атрибуту..."
}
```

#### Response 201
```json
{
  "id": 1,
  "question_id": 1,
  "user_id": 3,
  "body": "@property позволяет обращаться к методу как к атрибуту...",
  "created_at": "2026-04-03T11:00:00",
  "upvotes": 0,
  "downvotes": 0
}
```

#### Response 404
```json
{
  "detail": "Question not found"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/activity/questions/1/answers" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"body": "@property позволяет обращаться к методу как к атрибуту..."}'
```

---

### 15. Проголосовать за ответ

**POST** `/activity/answers/{answer_id}/vote`

Голосует за или против ответа.

#### Parameters
- `answer_id` (path, integer, required) - ID ответа

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "vote_type": "up"
}
```

**Допустимые значения:** `"up"` или `"down"`

#### Response 200
```json
{
  "detail": "upvoted answer 1"
}
```

#### Response 400
```json
{
  "detail": "User has already voted on this answer"
}
```

или

```json
{
  "detail": "vote_type must be 'up' or 'down'"
}
```

#### Response 404
```json
{
  "detail": "Answer not found"
}
```

#### Example
```bash
curl -X POST "http://localhost:8000/activity/answers/1/vote" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vote_type": "up"}'
```

---

## Структура данных

### UserCourseProgress

| Поле | Тип | Описание |
|------|-----|----------|
| `course_id` | integer | ID курса |
| `progress_percent` | float | Процент прохождения (0-100) |
| `last_activity` | datetime | Дата последней активности |
| `streak_days` | integer | Количество дней подряд |
| `completed_lessons` | array[integer] | Массив ID завершенных уроков |

### LessonCompletion

| Поле | Тип | Описание |
|------|-----|----------|
| `user_id` | integer | ID пользователя |
| `content_id` | integer | ID контента (из course_content) |
| `completed_at` | datetime | Дата завершения |

### UserActivityLog

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | integer | ID записи |
| `user_id` | integer | ID пользователя |
| `action` | string | Описание действия |
| `related_object_type` | string | Тип объекта (course, lesson, assignment и т.д.) |
| `related_object_id` | integer | ID связанного объекта |
| `timestamp` | datetime | Время действия |

---

## Автоматические логи

Следующие действия автоматически создают записи в логе активности:

1. **Запись на курс** → `"Started course \"{course_title}\""`
2. **Завершение урока** → `"Updated progress in course {course_id}: completed lessons {count}"`
3. **Отправка задания** → `"Submitted assignment {assignment_id} for course {course_id}"`
4. **Задать вопрос** → `"Posted question '{title}' in course {course_id}"`
5. **Ответить на вопрос** → `"Answered question {question_id}"`

---

## Примеры использования

### Полный workflow прохождения курса

```bash
# 1. Получить токен
TOKEN=$(curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "student@example.com", "password": "password"}' \
  | jq -r '.access_token')

# 2. Записаться на курс
curl -X POST "http://localhost:8000/progress/enroll" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1}'

# 3. Завершить урок
curl -X POST "http://localhost:8000/progress/complete-lesson" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"course_id": 1, "content_id": 5}'

# 4. Проверить прогресс
curl -X GET "http://localhost:8000/progress/1" \
  -H "Authorization: Bearer $TOKEN"

# 5. Задать вопрос
curl -X POST "http://localhost:8000/activity/questions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1,
    "title": "Не понимаю тему",
    "body": "Можете объяснить подробнее?"
  }'

# 6. Посмотреть историю активности
curl -X GET "http://localhost:8000/activity/logs" \
  -H "Authorization: Bearer $TOKEN"

# 7. Проверить стрик
curl -X GET "http://localhost:8000/activity/streak" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Важные замечания

1. **content_id vs lesson_id**: В системе используется `content_id` из таблицы `course_content`, а не `lesson_id` из таблицы `lessons`. Это разные сущности.

2. **Расчет прогресса**: Процент прохождения рассчитывается как `(количество завершенных уроков / общее количество уроков в курсе) × 100`.

3. **Стрик**: Считается только для действий "Submitted assignment" и "completed lessons". Требуется активность каждый день подряд, начиная с сегодняшнего дня.

4. **Повторное завершение урока**: Если урок уже завершен, старая запись удаляется и создается новая с текущей датой.

5. **Голосование**: Пользователь может проголосовать за ответ только один раз. Повторное голосование вернет ошибку 400.

---

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Authorization required"
}
```

### 403 Forbidden
```json
{
  "detail": "User is not enrolled in this course"
}
```

### 404 Not Found
```json
{
  "detail": "Course not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```
