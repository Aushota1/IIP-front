# API для тестирования кода (только открытые тесты)

## Описание
Эндпоинт для проверки кода на открытых тестах без сохранения результата в базу данных. Используется для быстрой проверки решения перед финальной отправкой.

## Эндпоинт

### POST /api/code-submissions/test

Проверяет код только на открытых тестах и возвращает результаты без сохранения в БД.

**URL:** `POST /api/code-submissions/test`

**Заголовки:**
```
Content-Type: application/json
```

**Тело запроса:**
```json
{
  "coding_task_id": "uuid задачи",
  "language": "python",
  "code": "def function_name(params):\n    return result"
}
```

**Параметры:**
- `coding_task_id` (string, required) - UUID задачи
- `language` (string, required) - Язык программирования ("python")
- `code` (string, required) - Код решения

**Успешный ответ (200 OK):**
```json
{
  "status": "success",
  "passed_tests": 1,
  "total_tests": 1,
  "execution_time_ms": 5,
  "test_results": [
    {
      "test_id": "uuid",
      "passed": true,
      "expected": 12,
      "actual": 12,
      "execution_time_ms": 5,
      "is_hidden": false,
      "error": null
    }
  ],
  "error_log": null
}
```

**Ответ с ошибкой выполнения (200 OK):**
```json
{
  "status": "failed",
  "passed_tests": 0,
  "total_tests": 1,
  "execution_time_ms": 3,
  "test_results": [
    {
      "test_id": "uuid",
      "passed": false,
      "expected": 12,
      "actual": 7,
      "execution_time_ms": 3,
      "is_hidden": false,
      "error": null
    }
  ],
  "error_log": null
}
```

**Ошибки:**

- `404 Not Found` - Задача не найдена
```json
{
  "detail": "Задача не найдена"
}
```

- `400 Bad Request` - Язык не поддерживается
```json
{
  "detail": "Язык python не поддерживается для этой задачи"
}
```

- `400 Bad Request` - Код содержит запрещенные конструкции
```json
{
  "detail": "Код содержит запрещенные конструкции: import os, eval"
}
```

- `400 Bad Request` - Нет открытых тестов
```json
{
  "detail": "У задачи нет открытых тестовых случаев"
}
```

- `500 Internal Server Error` - Ошибка выполнения
```json
{
  "detail": "Ошибка выполнения кода: ..."
}
```

## Отличия от POST /api/code-submissions

| Характеристика | /test | /code-submissions |
|---------------|-------|-------------------|
| Сохранение в БД | ❌ Нет | ✅ Да |
| Тесты | Только открытые | Все (открытые + скрытые) |
| Возвращает submission_id | ❌ Нет | ✅ Да |
| Учитывается в статистике | ❌ Нет | ✅ Да |
| Использование | Проверка перед отправкой | Финальная отправка |

## Примеры использования

### Пример 1: Успешная проверка

**Запрос:**
```bash
curl -X POST http://localhost:8000/api/code-submissions/test \
  -H "Content-Type: application/json" \
  -d '{
    "coding_task_id": "2dee5c2a-38ce-4c6c-a11c-1ccf066bab98",
    "language": "python",
    "code": "def product(a: int, b: int) -> int:\n    return a*b"
  }'
```

**Ответ:**
```json
{
  "status": "success",
  "passed_tests": 1,
  "total_tests": 1,
  "execution_time_ms": 0,
  "test_results": [
    {
      "test_id": "f3340f28-6ef8-4a8c-8da1-739319059a39",
      "passed": true,
      "expected": 12,
      "actual": 12,
      "execution_time_ms": 0,
      "is_hidden": false,
      "error": null
    }
  ],
  "error_log": null
}
```

### Пример 2: Неправильное решение

**Запрос:**
```bash
curl -X POST http://localhost:8000/api/code-submissions/test \
  -H "Content-Type: application/json" \
  -d '{
    "coding_task_id": "2dee5c2a-38ce-4c6c-a11c-1ccf066bab98",
    "language": "python",
    "code": "def product(a: int, b: int) -> int:\n    return a+b"
  }'
```

**Ответ:**
```json
{
  "status": "failed",
  "passed_tests": 0,
  "total_tests": 1,
  "execution_time_ms": 0,
  "test_results": [
    {
      "test_id": "f3340f28-6ef8-4a8c-8da1-739319059a39",
      "passed": false,
      "expected": 12,
      "actual": 7,
      "execution_time_ms": 0,
      "is_hidden": false,
      "error": null
    }
  ],
  "error_log": null
}
```

## Workflow использования

1. **Разработка решения**: Пользователь пишет код
2. **Проверка на открытых тестах**: `POST /api/code-submissions/test`
3. **Итерация**: Если тесты не прошли, исправить код и повторить шаг 2
4. **Финальная отправка**: `POST /api/code-submissions` (проверяет все тесты и сохраняет)

## Безопасность

- Код проверяется на запрещенные конструкции (import, eval, exec, и т.д.)
- Выполнение в изолированном Docker контейнере
- Ограничения по времени и памяти
- Нет доступа к сети
- Только открытые тесты (скрытые тесты не раскрываются)
