# Lesson Media Upload API

## Описание

Эндпоинты для загрузки изображений и видео к урокам курсов. Файлы загружаются в MinIO хранилище и возвращается публичный URL.

## Эндпоинты

### 1. Загрузка изображения

```
POST /api/lessons/upload-image
```

#### Требования
- Авторизация: Bearer token (роль: admin или instructor)
- Content-Type: multipart/form-data

#### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `file` | File | Файл изображения (обязательно) |

#### Поддерживаемые форматы
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)
- GIF (image/gif)

#### Ограничения
- Максимальный размер: 5 MB

#### Успешный ответ (200 OK)

```json
{
  "url": "http://localhost:9000/lessons/images/a1b2c3d4e5f6.jpg",
  "type": "image"
}
```

#### Примеры использования

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/lessons/upload-image" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

**JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:8000/api/lessons/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('Image URL:', data.url);
```

**Python (requests):**
```python
import requests

with open('image.jpg', 'rb') as f:
    files = {'file': f}
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(
        'http://localhost:8000/api/lessons/upload-image',
        files=files,
        headers=headers
    )
    data = response.json()
    print(f"Image URL: {data['url']}")
```

---

### 2. Загрузка видео

```
POST /api/lessons/upload-video
```

#### Требования
- Авторизация: Bearer token (роль: admin или instructor)
- Content-Type: multipart/form-data

#### Параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `file` | File | Файл видео (обязательно) |

#### Поддерживаемые форматы
- MP4 (video/mp4)
- WebM (video/webm)
- QuickTime (video/quicktime)
- AVI (video/x-msvideo)

#### Ограничения
- Максимальный размер: 100 MB
- Timeout: 5 минут (для больших файлов)

#### Успешный ответ (200 OK)

```json
{
  "url": "http://localhost:9000/lessons/videos/a1b2c3d4e5f6.mp4",
  "type": "video"
}
```

#### Примеры использования

**cURL:**
```bash
curl -X POST "http://localhost:8000/api/lessons/upload-video" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/video.mp4"
```

**JavaScript (fetch):**
```javascript
const formData = new FormData();
formData.append('file', videoFile);

const response = await fetch('http://localhost:8000/api/lessons/upload-video', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('Video URL:', data.url);
```

**Python (requests):**
```python
import requests

with open('video.mp4', 'rb') as f:
    files = {'file': f}
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(
        'http://localhost:8000/api/lessons/upload-video',
        files=files,
        headers=headers
    )
    data = response.json()
    print(f"Video URL: {data['url']}")
```

---

## Ошибки

### 401 Unauthorized

Отсутствует токен авторизации.

```json
{
  "detail": "Authorization token missing"
}
```

### 403 Forbidden

Недостаточно прав (требуется роль admin или instructor).

```json
{
  "detail": "Only admins or instructors can upload lesson media"
}
```

### 422 Unprocessable Entity

Неподдерживаемый формат файла или превышен размер.

```json
{
  "detail": "Unsupported image type: image/bmp. Allowed: image/jpeg, image/png, image/webp, image/gif"
}
```

```json
{
  "detail": "File too large. Max size is 5 MB"
}
```

```json
{
  "detail": "File too large. Max size is 100 MB"
}
```

---

## Использование загруженных медиа в уроках

После загрузки файла используйте полученный URL в секциях урока:

### Для изображения:

```json
{
  "id": 1,
  "type": "image",
  "url": "http://localhost:9000/lessons/images/a1b2c3d4e5f6.jpg",
  "alt": "Описание изображения",
  "title": "Заголовок изображения"
}
```

### Для видео:

```json
{
  "id": 2,
  "type": "video",
  "url": "http://localhost:9000/lessons/videos/a1b2c3d4e5f6.mp4",
  "title": "Название видео"
}
```

---

## Workflow создания урока с медиа

1. Загрузите изображения через `POST /api/lessons/upload-image`
2. Загрузите видео через `POST /api/lessons/upload-video`
3. Получите URL загруженных файлов
4. Создайте урок через `POST /api/courses/{course_id}/modules/{module_id}/lessons` с секциями, содержащими эти URL
5. Или обновите существующий урок через `PUT /api/lessons/{lesson_id}`

### Пример создания урока с медиа:

```json
{
  "title": "Введение в алгоритмы",
  "order_index": 1,
  "duration_minutes": 45,
  "sections": [
    {
      "id": 1,
      "type": "text",
      "content": "Добро пожаловать на урок!"
    },
    {
      "id": 2,
      "type": "image",
      "url": "http://localhost:9000/lessons/images/intro.jpg",
      "alt": "Схема алгоритма"
    },
    {
      "id": 3,
      "type": "video",
      "url": "http://localhost:9000/lessons/videos/tutorial.mp4",
      "title": "Видео-объяснение"
    },
    {
      "id": 4,
      "type": "code",
      "content": "def hello():\n    print('Hello, World!')",
      "language": "python"
    }
  ]
}
```

---

## Хранилище

Файлы хранятся в MinIO (S3-совместимое хранилище):

- Bucket: `lessons`
- Изображения: `lessons/images/`
- Видео: `lessons/videos/`
- Публичный доступ: включен
- URL формат: `http://localhost:9000/lessons/{type}/{filename}`

---

## Связанные эндпоинты

- `POST /api/courses/{course_id}/modules/{module_id}/lessons` - Создать урок
- `PUT /api/lessons/{lesson_id}` - Обновить урок
- `GET /api/lessons/{lesson_id}` - Получить урок со всеми секциями
- `GET /api/courses-content/{course_id}` - Получить полное содержимое курса
