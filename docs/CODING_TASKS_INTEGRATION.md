# Интеграция Coding Tasks API

## Обзор

Интеграция API для работы с задачами по программированию и проверки решений.

## Важно

Следующие функции НЕ реализованы в текущем API:
- `/favorites` - избранные задачи (функционал отключен в UI)
- `/tasks/solved` - список решенных задач (используется `/code-submissions` вместо этого)
- Статистика `solvedPercent` для задач (пока не доступна)

## Реализованные функции

### API функции (src/api.js)

#### Задачи по программированию
- `getCodingTasks(params)` - получить список задач с фильтрацией
- `getCodingTaskById(taskId)` - получить задачу по ID
- `createCodingTask(taskData)` - создать задачу (admin)
- `updateCodingTask(taskId, taskData)` - обновить задачу (admin)
- `deleteCodingTask(taskId)` - удалить задачу (admin)

#### Тестовые случаи
- `getTestCases(taskId, includeHidden)` - получить тесты задачи
- `createTestCase(taskId, testCaseData)` - добавить тест (admin)
- `updateTestCase(testCaseId, testCaseData)` - обновить тест (admin)
- `deleteTestCase(testCaseId)` - удалить тест (admin)

#### Отправка решений
- `submitCode(submissionData)` - отправить решение
- `getSubmissionResult(submissionId)` - получить результат решения
- `getSubmissionsHistory(params)` - получить историю решений

### Сервис (src/services/codingTasks.js)

Обертка над API функциями с обработкой ошибок и дополнительной логикой:
- `fetchCodingTasks(filters)` - загрузка задач
- `submitSolution(taskId, language, code)` - отправка решения
- `formatSubmissionStatus(status)` - форматирование статуса
- `formatDifficulty(difficulty)` - форматирование сложности

## Использование

### Страница списка задач (TasksList.js)

```javascript
import { getCodingTasks } from '../api';

// Загрузка задач
const tasks = await getCodingTasks({ 
  difficulty: 'easy',
  limit: 20,
  skip: 0 
});
```

### Страница задачи (TaskDetail.js)

```javascript
import { 
  getCodingTaskById, 
  getTestCases, 
  submitCode 
} from '../api';

// Загрузка задачи
const task = await getCodingTaskById(taskId);

// Загрузка тестов (только публичные)
const tests = await getTestCases(taskId, false);

// Отправка решения
const result = await submitCode({
  coding_task_id: taskId,
  language: 'python',
  code: userCode
});
```

## Формат данных

### Задача (Coding Task)
```json
{
  "id": "uuid",
  "title": "Сумма двух чисел",
  "description": "Markdown описание",
  "difficulty": "easy",
  "time_limit_ms": 5000,
  "memory_limit_mb": 128,
  "allowed_languages": ["python"],
  "function_signature": "def solution(a: int, b: int) -> int:",
  "hints": [{"text": "Подсказка"}],
  "tags": ["math", "beginner"]
}
```

### Тестовый случай
```json
{
  "id": "uuid",
  "coding_task_id": "uuid",
  "input_data": [2, 3],
  "expected_output": 5,
  "is_hidden": false,
  "weight": 1,
  "description": "Простой случай"
}
```

### Результат решения
```json
{
  "submission_id": "uuid",
  "status": "success",
  "passed_tests": 10,
  "total_tests": 10,
  "score": 100,
  "execution_time_ms": 234,
  "test_results": [
    {
      "test_id": "uuid",
      "passed": true,
      "expected": 5,
      "actual": 5,
      "execution_time_ms": 23,
      "error": null
    }
  ]
}
```

## Статусы выполнения

- `pending` - В очереди
- `running` - Выполняется
- `success` - Все тесты пройдены
- `failed` - Некоторые тесты не пройдены
- `error` - Ошибка выполнения
- `timeout` - Превышен лимит времени
- `memory_limit` - Превышен лимит памяти

## Безопасность

Код проверяется на наличие запрещенных конструкций:
- Системные вызовы (`os.*`, `subprocess.*`)
- Выполнение кода (`eval()`, `exec()`)
- Работа с файлами (`open()`)
- Сетевые запросы (`socket.*`, `requests.*`)

Разрешенные модули:
- `math`, `random`, `datetime`
- `collections`, `itertools`, `functools`
- `re`, `json`, `typing`

## Примеры

### Создание задачи (admin)
```javascript
const task = await createCodingTask({
  title: "Удвоение числа",
  description: "Напишите функцию solution(n), которая возвращает n * 2",
  difficulty: "easy",
  function_signature: "def solution(n: int) -> int:",
  tags: ["math", "beginner"]
});

// Добавить тесты
await createTestCase(task.id, {
  input_data: [5],
  expected_output: 10,
  is_hidden: false
});
```

### Отправка решения
```javascript
const result = await submitCode({
  coding_task_id: taskId,
  language: 'python',
  code: 'def solution(n):\n    return n * 2'
});

if (result.status === 'success') {
  console.log('Все тесты пройдены!');
}
```
