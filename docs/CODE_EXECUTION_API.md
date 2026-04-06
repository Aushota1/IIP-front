# Code Execution Service API

API для работы с задачами по программированию и проверки решений.

## Base URL
```
http://localhost:8005/api/v1
```

## Endpoints

### Задачи по программированию (Coding Tasks)

#### 1. Создание задачи
```http
POST /coding-tasks
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "Сумма двух чисел",
  "description": "Напишите функцию solution(a, b), которая возвращает сумму двух чисел",
  "difficulty": "easy",
  "time_limit_ms": 5000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(a: int, b: int) -> int:",
  "hints": [{"text": "Используйте оператор +"}],
  "tags": ["math", "beginner"]
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "title": "Сумма двух чисел",
  "description": "...",
  "difficulty": "easy",
  "created_at": "2026-04-04T10:00:00Z"
}
```

#### 2. Получение списка задач
```http
GET /coding-tasks?difficulty=easy&skip=0&limit=20
```

**Response: 200 OK**
```json
[
  {
    "id": "uuid",
    "title": "Сумма двух чисел",
    "difficulty": "easy",
    "tags": ["math", "beginner"]
  }
]
```

#### 3. Получение задачи
```http
GET /coding-tasks/{task_id}
```

#### 4. Обновление задачи
```http
PATCH /coding-tasks/{task_id}
Authorization: Bearer {admin_token}
```

#### 5. Удаление задачи
```http
DELETE /coding-tasks/{task_id}
Authorization: Bearer {admin_token}
```

### Тестовые случаи (Test Cases)

#### 6. Добавление теста
```http
POST /coding-tasks/{task_id}/test-cases
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "input_data": [2, 3],
  "expected_output": 5,
  "is_hidden": false,
  "weight": 1,
  "description": "Простой случай"
}
```

#### 7. Получение тестов
```http
GET /coding-tasks/{task_id}/test-cases?include_hidden=false
```

### Отправка решений (Submissions)

#### 8. Отправка решения
```http
POST /code-submissions
Authorization: Bearer {user_token}
Content-Type: application/json

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
  "status": "success",
  "passed_tests": 10,
  "total_tests": 10,
  "score": 100,
  "execution_time_ms": 234,
  "test_results": [...]
}
```

#### 9. Получение результата
```http
GET /code-submissions/{submission_id}
```

#### 10. История решений
```http
GET /code-submissions?coding_task_id={task_id}&skip=0&limit=10
```

## Статусы выполнения

- `pending` - В очереди
- `running` - Выполняется
- `success` - Все тесты пройдены
- `failed` - Некоторые тесты не пройдены
- `error` - Ошибка выполнения
- `timeout` - Превышен лимит времени
- `memory_limit` - Превышен лимит памяти

## Примеры использования

### Создание задачи с тестами

```python
import requests

# 1. Создать задачу
task_response = requests.post(
    "http://localhost:8005/api/v1/coding-tasks",
    json={
        "title": "Удвоение числа",
        "description": "Напишите функцию solution(n), которая возвращает n * 2",
        "difficulty": "easy",
        "function_signature": "def solution(n: int) -> int:"
    }
)
task_id = task_response.json()["id"]

# 2. Добавить тесты
tests = [
    {"input_data": [5], "expected_output": 10, "is_hidden": False},
    {"input_data": [0], "expected_output": 0, "is_hidden": False},
    {"input_data": [-3], "expected_output": -6, "is_hidden": True}
]

for test in tests:
    requests.post(
        f"http://localhost:8005/api/v1/coding-tasks/{task_id}/test-cases",
        json=test
    )
```

### Отправка решения

```python
# 3. Отправить решение
submission_response = requests.post(
    "http://localhost:8005/api/v1/code-submissions",
    json={
        "coding_task_id": task_id,
        "language": "python",
        "code": "def solution(n):\n    return n * 2"
    }
)

submission_id = submission_response.json()["submission_id"]
print(f"Score: {submission_response.json()['score']}")
```

## Безопасность

Запрещенные конструкции в коде:
- `os.*`, `subprocess.*`
- `eval()`, `exec()`
- `open()`, `input()`
- `socket.*`, `requests.*`
- `sys.exit()`, `__import__`

Разрешенные модули:
- `math`, `random`, `datetime`
- `collections`, `itertools`, `functools`
- `re`, `json`, `typing`
