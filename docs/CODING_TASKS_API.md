# Coding Tasks API

API для работы с задачами по программированию, тестовыми случаями и проверкой решений.

## Base URL
```
http://localhost:8000/api
```

---

## Задачи по программированию (Coding Tasks)

### 1. Получение списка задач

```http
GET /coding-tasks?difficulty=easy&skip=0&limit=20
```

**Query Parameters:**
- `difficulty` (optional): Фильтр по сложности (`easy`, `medium`, `hard`)
- `skip` (optional): Количество пропускаемых записей (default: 0)
- `limit` (optional): Максимальное количество записей (default: 20)

**Response: 200 OK**
```json
[
  {
    "id": "uuid",
    "title": "Сумма двух чисел",
    "description": "Напишите функцию solution(a, b)...",
    "difficulty": "easy",
    "time_limit_ms": 5000,
    "memory_limit_mb": 128,
    "allowed_languages": ["python"],
    "function_signature": "def solution(a: int, b: int) -> int:",
    "hints": [{"text": "Используйте оператор +"}],
    "tags": ["math", "beginner"],
    "created_at": "2026-04-04T10:00:00Z",
    "updated_at": null
  }
]
```

---

### 2. Получение задачи по ID

```http
GET /coding-tasks/{task_id}
```

**Path Parameters:**
- `task_id` (required): UUID задачи

**Response: 200 OK**
```json
{
  "id": "uuid",
  "title": "Сумма двух чисел",
  "description": "# Сумма двух чисел\n\nНапишите функцию...",
  "difficulty": "easy",
  "time_limit_ms": 5000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(a: int, b: int) -> int:",
  "hints": [
    {"text": "Используйте оператор +"},
    {"text": "Обратите внимание на отрицательные числа"}
  ],
  "tags": ["math", "beginner"],
  "created_at": "2026-04-04T10:00:00Z",
  "updated_at": null
}
```

**Response: 404 Not Found**
```json
{
  "detail": "Задача не найдена"
}
```

---

### 3. Создание задачи

```http
POST /coding-tasks
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Удвоение числа",
  "description": "Напишите функцию solution(n), которая возвращает n * 2",
  "difficulty": "easy",
  "time_limit_ms": 5000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(n: int) -> int:",
  "hints": [{"text": "Используйте оператор умножения"}],
  "tags": ["math", "beginner"]
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "title": "Удвоение числа",
  "description": "Напишите функцию solution(n)...",
  "difficulty": "easy",
  "time_limit_ms": 5000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(n: int) -> int:",
  "hints": [{"text": "Используйте оператор умножения"}],
  "tags": ["math", "beginner"],
  "created_at": "2026-04-04T10:00:00Z",
  "updated_at": null
}
```

---

### 4. Обновление задачи

```http
PATCH /coding-tasks/{task_id}
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body (все поля опциональны):**
```json
{
  "description": "Обновленное описание задачи",
  "time_limit_ms": 3000,
  "tags": ["math", "beginner", "arithmetic"]
}
```

**Response: 200 OK**
```json
{
  "id": "uuid",
  "title": "Удвоение числа",
  "description": "Обновленное описание задачи",
  "difficulty": "easy",
  "time_limit_ms": 3000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(n: int) -> int:",
  "hints": [{"text": "Используйте оператор умножения"}],
  "tags": ["math", "beginner", "arithmetic"],
  "created_at": "2026-04-04T10:00:00Z",
  "updated_at": "2026-04-04T11:00:00Z"
}
```

---

### 5. Удаление задачи

```http
DELETE /coding-tasks/{task_id}
Authorization: Bearer {admin_token}
```

**Response: 204 No Content**

---

## Тестовые случаи (Test Cases)

### 6. Получение тестовых случаев задачи

```http
GET /coding-tasks/{task_id}/test-cases?include_hidden=false
Authorization: Bearer {admin_token}  # для include_hidden=true
```

**Query Parameters:**
- `include_hidden` (optional): Включить скрытые тесты (default: false, требует admin права)

**Response: 200 OK**
```json
[
  {
    "id": "uuid",
    "coding_task_id": "uuid",
    "input_data": [2, 3],
    "expected_output": 5,
    "is_hidden": false,
    "weight": 1,
    "description": "Простой случай"
  },
  {
    "id": "uuid",
    "coding_task_id": "uuid",
    "input_data": [0, 0],
    "expected_output": 0,
    "is_hidden": false,
    "weight": 1,
    "description": "Граничный случай с нулями"
  }
]
```

---

### 7. Добавление тестового случая

```http
POST /coding-tasks/{task_id}/test-cases
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "input_data": [10, 20],
  "expected_output": 30,
  "is_hidden": true,
  "weight": 2,
  "description": "Большие числа"
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "coding_task_id": "uuid",
  "input_data": [10, 20],
  "expected_output": 30,
  "is_hidden": true,
  "weight": 2,
  "description": "Большие числа"
}
```

---

### 8. Обновление тестового случая

```http
PATCH /coding-test-cases/{test_case_id}
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "expected_output": 35,
  "weight": 3
}
```

**Response: 200 OK**
```json
{
  "id": "uuid",
  "coding_task_id": "uuid",
  "input_data": [10, 20],
  "expected_output": 35,
  "is_hidden": true,
  "weight": 3,
  "description": "Большие числа"
}
```

---

### 9. Удаление тестового случая

```http
DELETE /coding-test-cases/{test_case_id}
Authorization: Bearer {admin_token}
```

**Response: 204 No Content**

---

## Отправка решений (Code Submissions)

### 10. Отправка решения

```http
POST /code-submissions
Authorization: Bearer {user_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "coding_task_id": "uuid",
  "language": "python",
  "code": "def solution(a, b):\n    return a + b"
}
```

**Response: 201 Created**
```json
{
  "submission_id": "uuid",
  "coding_task_id": "uuid",
  "user_id": "uuid",
  "language": "python",
  "status": "success",
  "passed_tests": 10,
  "total_tests": 10,
  "score": 100,
  "execution_time_ms": 234,
  "memory_used_mb": 45,
  "submitted_at": "2026-04-04T10:00:00Z",
  "test_results": [
    {
      "test_id": "uuid",
      "passed": true,
      "expected": 5,
      "actual": 5,
      "execution_time_ms": 23,
      "is_hidden": false,
      "error": null
    }
  ],
  "error_log": null
}
```

**Response: 400 Bad Request (небезопасный код)**
```json
{
  "detail": "Код содержит запрещенные конструкции: Запрещенная функция: open, Код должен содержать функцию 'solution'"
}
```

**Response: 400 Bad Request (неподдерживаемый язык)**
```json
{
  "detail": "Язык javascript не поддерживается для этой задачи"
}
```

---

### 11. Получение результата решения

```http
GET /code-submissions/{submission_id}
Authorization: Bearer {user_token}
```

**Response: 200 OK**
```json
{
  "submission_id": "uuid",
  "coding_task_id": "uuid",
  "user_id": "uuid",
  "language": "python",
  "status": "success",
  "passed_tests": 8,
  "total_tests": 10,
  "score": 80,
  "execution_time_ms": 456,
  "memory_used_mb": 52,
  "submitted_at": "2026-04-04T10:00:00Z",
  "test_results": [
    {
      "test_id": "uuid",
      "passed": true,
      "expected": 5,
      "actual": 5,
      "execution_time_ms": 23,
      "is_hidden": false,
      "error": null
    },
    {
      "test_id": "uuid",
      "passed": false,
      "expected": 100,
      "actual": 99,
      "execution_time_ms": 45,
      "is_hidden": true,
      "error": null
    }
  ],
  "error_log": null
}
```

---

### 12. История решений пользователя

```http
GET /code-submissions?coding_task_id={task_id}&status=success&skip=0&limit=10
Authorization: Bearer {user_token}
```

**Query Parameters:**
- `coding_task_id` (optional): Фильтр по задаче
- `user_id` (optional): Фильтр по пользователю (admin only)
- `status` (optional): Фильтр по статусу
- `skip` (optional): Пропустить записи (default: 0)
- `limit` (optional): Лимит записей (default: 10)

**Response: 200 OK**
```json
[
  {
    "submission_id": "uuid",
    "coding_task_id": "uuid",
    "user_id": "uuid",
    "language": "python",
    "status": "success",
    "passed_tests": 10,
    "total_tests": 10,
    "score": 100,
    "execution_time_ms": 234,
    "memory_used_mb": 45,
    "submitted_at": "2026-04-04T10:00:00Z",
    "test_results": null,
    "error_log": null
  }
]
```

---

## Статусы выполнения

| Статус | Описание |
|--------|----------|
| `pending` | Решение в очереди на выполнение |
| `running` | Код выполняется |
| `success` | Все тесты пройдены успешно |
| `failed` | Некоторые тесты не пройдены |
| `error` | Ошибка выполнения кода |
| `timeout` | Превышен лимит времени выполнения |
| `memory_limit` | Превышен лимит памяти |

---

## Безопасность кода

### Запрещенные конструкции (Python):

- `os.*`, `subprocess.*` - системные вызовы
- `eval()`, `exec()`, `compile()` - выполнение кода
- `open()`, `file` - работа с файлами
- `input()`, `raw_input()` - ввод данных
- `socket.*`, `requests.*`, `urllib.*` - сетевые запросы
- `sys.exit()`, `__import__` - системные функции
- `__builtins__`, `globals()`, `locals()` - доступ к внутренним механизмам

### Разрешенные модули:

- `math`, `random`, `datetime`
- `collections`, `itertools`, `functools`
- `re`, `json`, `typing`
- `decimal`, `fractions`, `statistics`
- `heapq`, `bisect`, `string`

---

## Примеры использования

### Создание задачи с тестами

```python
import requests

BASE_URL = "http://localhost:8000/api"
ADMIN_TOKEN = "your_admin_token"

# 1. Создать задачу
response = requests.post(
    f"{BASE_URL}/coding-tasks",
    headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
    json={
        "title": "Факториал числа",
        "description": "Напишите функцию solution(n), которая возвращает факториал числа n",
        "difficulty": "medium",
        "time_limit_ms": 5000,
        "memory_limit_mb": 128,
        "allowed_languages": ["python"],
        "function_signature": "def solution(n: int) -> int:",
        "tags": ["math", "recursion"]
    }
)
task_id = response.json()["id"]

# 2. Добавить публичные тесты
public_tests = [
    {"input_data": [0], "expected_output": 1, "is_hidden": False},
    {"input_data": [1], "expected_output": 1, "is_hidden": False},
    {"input_data": [5], "expected_output": 120, "is_hidden": False}
]

for test in public_tests:
    requests.post(
        f"{BASE_URL}/coding-tasks/{task_id}/test-cases",
        headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
        json=test
    )

# 3. Добавить скрытые тесты
hidden_tests = [
    {"input_data": [10], "expected_output": 3628800, "is_hidden": True, "weight": 2},
    {"input_data": [15], "expected_output": 1307674368000, "is_hidden": True, "weight": 3}
]

for test in hidden_tests:
    requests.post(
        f"{BASE_URL}/coding-tasks/{task_id}/test-cases",
        headers={"Authorization": f"Bearer {ADMIN_TOKEN}"},
        json=test
    )
```

### Отправка решения

```python
USER_TOKEN = "your_user_token"

# Отправить решение
response = requests.post(
    f"{BASE_URL}/code-submissions",
    headers={"Authorization": f"Bearer {USER_TOKEN}"},
    json={
        "coding_task_id": task_id,
        "language": "python",
        "code": """
def solution(n):
    if n <= 1:
        return 1
    return n * solution(n - 1)
"""
    }
)

result = response.json()
print(f"Status: {result['status']}")
print(f"Score: {result['score']}/100")
print(f"Passed: {result['passed_tests']}/{result['total_tests']}")
print(f"Time: {result['execution_time_ms']}ms")
```

---

## Коды ошибок

| Код | Описание |
|-----|----------|
| 200 | Успешный запрос |
| 201 | Ресурс создан |
| 204 | Успешное удаление |
| 400 | Неверный запрос (небезопасный код, неподдерживаемый язык) |
| 401 | Не авторизован |
| 403 | Доступ запрещен |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |
| 502 | Сервис недоступен |
