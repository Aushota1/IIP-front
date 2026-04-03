# Modules API Documentation

API для работы с модулями курсов. Модули группируют уроки по темам.

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

### 1. Получить все модули курса

**GET** `/courses/{course_id}/modules`

Возвращает список всех модулей курса с их уроками.

#### Parameters
- `course_id` (path, integer, required) - ID курса

#### Response 200
```json
[
  {
    "id": 1,
    "course_id": 5,
    "title": "Основы программирования",
    "description": "Введение в основные концепции программирования",
    "order_index": 1,
    "lessons": [
      {
        "id": 1,
        "course_id": 5,
        "module_id": 1,
        "title": "Введение в Python",
        "order_index": 1,
        "duration_minutes": 15,
        "completed": false
      },
      {
        "id": 2,
        "course_id": 5,
        "module_id": 1,
        "title": "Переменные и типы данных",
        "order_index": 2,
        "duration_minutes": 20,
        "completed": false
      }
    ]
  },
  {
    "id": 2,
    "course_id": 5,
    "title": "Объектно-ориентированное программирование",
    "description": "Изучение ООП в Python",
    "order_index": 2,
    "lessons": [
      {
        "id": 3,
        "course_id": 5,
        "module_id": 2,
        "title": "Классы и объекты",
        "order_index": 1,
        "duration_minutes": 30,
        "completed": false
      }
    ]
  }
]
```

#### Example
```bash
curl -X GET "http://localhost:8000/courses/5/modules"
```

---

### 2. Получить конкретный модуль

**GET** `/modules/{module_id}`

Возвращает модуль с его уроками.

#### Parameters
- `module_id` (path, integer, required) - ID модуля

#### Response 200
```json
{
  "id": 1,
  "course_id": 5,
  "title": "Основы программирования",
  "description": "Введение в основные концепции программирования",
  "order_index": 1,
  "lessons": [
    {
      "id": 1,
      "course_id": 5,
      "module_id": 1,
      "title": "Введение в Python",
      "order_index": 1,
      "duration_minutes": 15,
      "completed": false
    }
  ]
}
```

#### Response 404
```json
{
  "detail": "Module not found"
}
```

#### Example
```bash
curl -X GET "http://localhost:8000/modules/1"
```

---

### 3. Создать модуль

**POST** `/courses/{course_id}/modules`

Создает новый модуль в курсе. Требуется авторизация (admin/instructor).

#### Parameters
- `course_id` (path, integer, required) - ID курса

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
```json
{
  "title": "Основы программирования",
  "description": "Введение в основные концепции программирования",
  "order_index": 1
}
```

Поля:
- `title` (string, required) - название модуля
- `description` (string, optional) - описание модуля
- `order_index` (integer, required) - порядковый номер

#### Response 201
```json
{
  "id": 1,
  "course_id": 5,
  "title": "Основы программирования",
  "description": "Введение в основные концепции программирования",
  "order_index": 1,
  "lessons": []
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
  "detail": "Only admins or instructors can create modules"
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
curl -X POST "http://localhost:8000/courses/5/modules" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Основы программирования",
    "description": "Введение в основные концепции программирования",
    "order_index": 1
  }'
```

---

### 4. Обновить модуль

**PUT** `/modules/{module_id}`

Обновляет существующий модуль. Требуется авторизация (admin/instructor).

#### Parameters
- `module_id` (path, integer, required) - ID модуля

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body
Все поля опциональны. Обновляются только переданные поля.

```json
{
  "title": "Основы программирования (обновлено)",
  "description": "Обновленное описание модуля",
  "order_index": 2
}
```

#### Response 200
```json
{
  "id": 1,
  "course_id": 5,
  "title": "Основы программирования (обновлено)",
  "description": "Обновленное описание модуля",
  "order_index": 2,
  "lessons": [...]
}
```

#### Response 401/403/404
Аналогично POST запросу.

#### Example
```bash
curl -X PUT "http://localhost:8000/modules/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Основы программирования (обновлено)"
  }'
```

---

### 5. Удалить модуль

**DELETE** `/modules/{module_id}`

Удаляет модуль и все его уроки. Требуется авторизация (только admin).

#### Parameters
- `module_id` (path, integer, required) - ID модуля

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
  "detail": "Only admins can delete modules"
}
```

#### Response 404
```json
{
  "detail": "Module not found"
}
```

#### Example
```bash
curl -X DELETE "http://localhost:8000/modules/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Authorization

Для создания, обновления и удаления модулей требуется JWT токен в заголовке:

```
Authorization: Bearer <your_jwt_token>
```

### Роли:
- **admin** - может создавать, обновлять и удалять модули
- **instructor** - может создавать и обновлять модули
- **student** - только чтение (GET запросы)

---

## Workflow Example

### Создание структуры курса (модули + уроки):

```bash
# 1. Получить токен (логин)
TOKEN=$(curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}' \
  | jq -r '.access_token')

# 2. Создать модуль
MODULE_ID=$(curl -X POST "http://localhost:8000/courses/1/modules" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Основы Python",
    "description": "Введение в язык программирования Python",
    "order_index": 1
  }' | jq -r '.id')

# 3. Создать урок в модуле
curl -X POST "http://localhost:8000/courses/1/modules/$MODULE_ID/lessons" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Введение в Python",
    "order_index": 1,
    "duration_minutes": 15,
    "sections": [
      {
        "id": 1,
        "type": "text",
        "content": "Python - мощный язык программирования"
      }
    ]
  }'

# 4. Получить все модули курса с уроками
curl -X GET "http://localhost:8000/courses/1/modules"

# 5. Обновить модуль
curl -X PUT "http://localhost:8000/modules/$MODULE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Основы Python (обновлено)"
  }'
```

---

## Notes

- При удалении модуля удаляются все его уроки (CASCADE)
- Модули сортируются по `order_index`
- Уроки внутри модуля также сортируются по `order_index`
- Поле `completed` в уроках будет заполняться на основе прогресса пользователя (в будущем)

---

## Related APIs

- [Lessons API](./LESSONS_API.md) - работа с уроками
- [Courses API](./COURSES_API.md) - работа с курсами
