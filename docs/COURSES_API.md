# Courses API — требования к данным

## GET /api/courses — список курсов

Используется на главной странице и странице «Все курсы».

### Ожидаемый формат ответа

Объект, где ключ — `slug` курса:

```json
{
  "algorithm-rush": {
    "id": 1,
    "slug": "algorithm-rush",
    "title": "Алгоритмы и структуры данных",
    "excerpt": "Краткое описание курса (1-2 предложения)",
    "description": "Полное описание курса",
    "level": "beginner | intermediate | advanced",
    "duration": "8 недель",
    "price": "4 900 ₽",
    "image": "https://..."
  }
}
```

### Поля карточки курса (`CourseCard`)

| Поле          | Тип    | Где используется              |
|---------------|--------|-------------------------------|
| `id`          | int    | ключ при рендере              |
| `slug`        | string | ссылка `/courses/{slug}`      |
| `title`       | string | заголовок карточки            |
| `excerpt`     | string | описание на карточке          |
| `level`       | string | бейдж уровня (beginner / intermediate / advanced) |
| `duration`    | string | плашка длительности           |
| `price`       | string | плашка цены                   |
| `image`       | string | фоновое изображение карточки  |

---

## GET /api/courses/{slug} — детальная страница курса

Используется на `CoursePage`.

### Ожидаемый формат ответа

```json
{
  "id": 1,
  "slug": "algorithm-rush",
  "title": "Алгоритмы и структуры данных",
  "excerpt": "Краткое описание",
  "description": "Полное описание курса",
  "level": "advanced",
  "duration": "8 недель",
  "price": "4 900 ₽",
  "image": "https://...",

  "features": [
    {
      "icon": "⚡",
      "title": "Алгоритмы",
      "text": "Сортировки, поиск, графы"
    }
  ],

  "program": [
    {
      "content_id": 1,
      "title": "Урок 1: Введение",
      "description": "Описание урока",
      "duration": "15 мин"
    }
  ],

  "reviews": [
    {
      "name": "Иван Иванов",
      "role": "Frontend Developer",
      "text": "Отличный курс!",
      "rating": 5,
      "avatar": "https://..."
    }
  ],

  "instructors": [
    {
      "name": "Анна Серова",
      "position": "Senior разработчик",
      "bio": "Опыт более 7 лет.",
      "photo": "https://...",
      "social": [
        { "icon": "GitHub", "url": "https://github.com/..." }
      ]
    }
  ]
}
```

### Все поля детальной страницы

| Поле           | Тип      | Описание                                  |
|----------------|----------|-------------------------------------------|
| `features`     | array    | Преимущества курса (иконка + заголовок + текст) |
| `program`      | array    | Список уроков/модулей                     |
| `reviews`      | array    | Отзывы студентов                          |
| `instructors`  | array    | Преподаватели курса                       |

---

## Значения поля `level`

| Значение       | Отображение  |
|----------------|--------------|
| `beginner`     | Начальный    |
| `intermediate` | Средний      |
| `advanced`     | Продвинутый  |

---

## Примечания

- `image` — прямая ссылка на изображение (URL). Карточка использует его как CSS `background-image`.
- `excerpt` — короткое описание для карточки, `description` — полное для страницы курса.
- `slug` должен совпадать с ключом объекта и использоваться в URL `/courses/{slug}`.
- `price` — строка в произвольном формате (`"Бесплатно"`, `"4 900 ₽"` и т.д.).
