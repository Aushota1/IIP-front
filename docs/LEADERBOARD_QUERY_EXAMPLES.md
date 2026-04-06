# Примеры запросов для построения рейтинга

## Структура данных

Теперь в таблице `code_submissions` хранится `username` вместе с метриками:

```sql
SELECT 
    id,
    user_id,
    username,
    status,
    score,
    execution_time_ms,
    memory_used_mb,
    submitted_at
FROM code_submissions
LIMIT 5;
```

Результат:
```
id                                  | user_id | username   | status  | score | execution_time_ms | memory_used_mb
------------------------------------|---------|------------|---------|-------|-------------------|---------------
436fed70-9252-4529-8866-2c45d34184dc| 16      | John Doe   | success | 100   | 0                 | 15
81612d70-cc80-4486-921e-bf10e9758f3c| 0       | Anonymous  | success | 100   | 0                 | 15
```

## Запросы для рейтинга

### 1. Топ пользователей по количеству решенных задач

```sql
SELECT 
    username,
    user_id,
    COUNT(*) as total_submissions,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_submissions,
    ROUND(COUNT(CASE WHEN status = 'success' THEN 1 END) * 100.0 / COUNT(*), 2) as success_rate
FROM code_submissions
WHERE user_id > 0  -- Исключаем анонимных пользователей
GROUP BY username, user_id
ORDER BY successful_submissions DESC, success_rate DESC
LIMIT 10;
```

### 2. Топ пользователей по среднему score

```sql
SELECT 
    username,
    user_id,
    COUNT(*) as total_submissions,
    ROUND(AVG(score), 2) as avg_score,
    MAX(score) as max_score,
    MIN(score) as min_score
FROM code_submissions
WHERE user_id > 0 AND status = 'success'
GROUP BY username, user_id
HAVING COUNT(*) >= 3  -- Минимум 3 решения
ORDER BY avg_score DESC, total_submissions DESC
LIMIT 10;
```

### 3. Топ пользователей по скорости выполнения

```sql
SELECT 
    username,
    user_id,
    COUNT(*) as total_submissions,
    ROUND(AVG(execution_time_ms), 2) as avg_execution_time_ms,
    MIN(execution_time_ms) as best_time_ms
FROM code_submissions
WHERE user_id > 0 
  AND status = 'success'
  AND execution_time_ms > 0  -- Исключаем мгновенные решения
GROUP BY username, user_id
HAVING COUNT(*) >= 5
ORDER BY avg_execution_time_ms ASC
LIMIT 10;
```

### 4. Топ пользователей по эффективности памяти

```sql
SELECT 
    username,
    user_id,
    COUNT(*) as total_submissions,
    ROUND(AVG(memory_used_mb), 2) as avg_memory_mb,
    MIN(memory_used_mb) as best_memory_mb
FROM code_submissions
WHERE user_id > 0 
  AND status = 'success'
  AND memory_used_mb > 0
GROUP BY username, user_id
HAVING COUNT(*) >= 5
ORDER BY avg_memory_mb ASC
LIMIT 10;
```

### 5. Общий рейтинг (комбинированный)

```sql
WITH user_stats AS (
    SELECT 
        username,
        user_id,
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_submissions,
        ROUND(AVG(CASE WHEN status = 'success' THEN score ELSE 0 END), 2) as avg_score,
        ROUND(AVG(CASE WHEN status = 'success' AND execution_time_ms > 0 
                       THEN execution_time_ms ELSE NULL END), 2) as avg_time_ms,
        ROUND(AVG(CASE WHEN status = 'success' AND memory_used_mb > 0 
                       THEN memory_used_mb ELSE NULL END), 2) as avg_memory_mb
    FROM code_submissions
    WHERE user_id > 0
    GROUP BY username, user_id
    HAVING COUNT(CASE WHEN status = 'success' THEN 1 END) >= 3
)
SELECT 
    username,
    user_id,
    total_submissions,
    successful_submissions,
    avg_score,
    avg_time_ms,
    avg_memory_mb,
    -- Рассчитываем общий рейтинг (чем выше, тем лучше)
    ROUND(
        (successful_submissions * 10) +  -- Количество решений
        (avg_score * 0.5) +               -- Средний score
        (CASE WHEN avg_time_ms > 0 THEN 100.0 / avg_time_ms ELSE 0 END) + -- Скорость
        (CASE WHEN avg_memory_mb > 0 THEN 100.0 / avg_memory_mb ELSE 0 END) -- Память
    , 2) as rating
FROM user_stats
ORDER BY rating DESC
LIMIT 10;
```

### 6. Рейтинг по конкретной задаче

```sql
SELECT 
    cs.username,
    cs.user_id,
    ct.title as task_title,
    cs.score,
    cs.execution_time_ms,
    cs.memory_used_mb,
    cs.submitted_at,
    ROW_NUMBER() OVER (ORDER BY cs.score DESC, cs.execution_time_ms ASC) as rank
FROM code_submissions cs
JOIN coding_tasks ct ON cs.coding_task_id = ct.id
WHERE cs.user_id > 0
  AND cs.status = 'success'
  AND ct.id = '47e5a507-8a42-4575-b1c1-9b714d15c1d3'  -- ID конкретной задачи
ORDER BY rank
LIMIT 10;
```

### 7. Активность пользователей за последнюю неделю

```sql
SELECT 
    username,
    user_id,
    COUNT(*) as submissions_this_week,
    COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_this_week,
    ROUND(AVG(score), 2) as avg_score_this_week
FROM code_submissions
WHERE user_id > 0
  AND submitted_at >= NOW() - INTERVAL '7 days'
GROUP BY username, user_id
ORDER BY submissions_this_week DESC, successful_this_week DESC
LIMIT 10;
```

## API эндпоинт для рейтинга

Можно создать новый эндпоинт в `routes_submissions.py`:

```python
@router.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(
    task_id: Optional[UUID] = None,
    period: str = "all",  # all, week, month
    metric: str = "score",  # score, speed, memory, count
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Получение рейтинга пользователей
    
    Parameters:
    - task_id: ID конкретной задачи (опционально)
    - period: Период (all, week, month)
    - metric: Метрика для сортировки (score, speed, memory, count)
    - limit: Количество записей
    """
    # Реализация запроса на основе параметров
    pass
```

## Преимущества хранения username в БД

1. **Производительность**: Не нужно делать JOIN с таблицей users при каждом запросе
2. **Простота**: Один запрос вместо нескольких
3. **Историчность**: Если пользователь изменит имя, старые submissions сохранят старое имя
4. **Независимость**: code_execution_service не зависит от доступности user_service

## Обновление username

Если пользователь изменит имя, можно обновить все его submissions:

```sql
UPDATE code_submissions
SET username = 'New Name'
WHERE user_id = 16;
```

Или создать триггер в user_service для автоматического обновления.
