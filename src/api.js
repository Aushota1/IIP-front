import axios from 'axios';
import { NetworkError, APIError } from './errors';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Добавляем интерцептор для автоматического добавления Authorization заголовка
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Устанавливаем Content-Type только если это не FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error interceptor for handling 401, 403, 422, and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new NetworkError('Ошибка сети. Проверьте подключение к интернету.', error));
    }

    const { status, data } = error.response;
    const message = data?.detail || data?.message || 'Ошибка сервера';

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        console.error('Authentication Error (401):', message);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new APIError(401, 'Необходима авторизация'));

      case 403:
        // Forbidden - user doesn't have permission
        console.error('Authorization Error (403):', message);
        return Promise.reject(new APIError(403, 'У вас нет прав для выполнения этого действия'));

      case 422:
        // Validation error
        console.error('Validation Error (422):', data);
        return Promise.reject(new APIError(422, 'Ошибка валидации данных', data?.errors || data));

      default:
        // Other API errors
        console.error(`API Error (${status}):`, message);
        return Promise.reject(new APIError(status, message, data));
    }
  }
);

// === Auth ===
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('Login response:', response.data);

  // Проверяем разные возможные форматы токена
  const token = response.data.access_token || response.data.token || response.data.accessToken;

  if (!token) {
    console.error('Token not found in response. Response data:', response.data);
    throw new Error('Token not found in login response');
  }

  console.log('Token extracted:', token);
  localStorage.setItem('token', token);
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/auth/users/me');
  console.log('User profile response:', response.data); // <-- добавьте сюда
  return response.data;
};

// === Courses ===
export const getAllCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getCourseByIdOrSlug = async (idOrSlug) => {
  const response = await api.get(`/courses/${idOrSlug}`);
  return response.data;
};

export const getCourseContent = async (courseId) => {
  const response = await api.get(`/courses-content/${courseId}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const uploadCourseImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/courses/upload-image', formData);
  return response.data; // ожидается { url: "https://..." }
};

// === Instructors ===
export const getAllInstructors = async () => {
  const response = await api.get('/instructors');
  return response.data;
};

export const createInstructor = async (instructorData) => {
  const response = await api.post('/instructors', instructorData);
  return response.data;
};

export const getInstructorsByCourse = async (courseId) => {
  const response = await api.get(`/instructors/course/${courseId}`);
  return response.data;
};

export const addInstructorToCourse = async (courseId, instructorId, orderIndex = 0) => {
  const response = await api.post(`/instructors/course/${courseId}/add/${instructorId}?order_index=${orderIndex}`);
  return response.data;
};

export const removeInstructorFromCourse = async (courseId, instructorId) => {
  const response = await api.delete(`/instructors/course/${courseId}/remove/${instructorId}`);
  return response.data;
};

export const updateInstructor = async (instructorId, instructorData) => {
  const response = await api.put(`/instructors/${instructorId}`, instructorData);
  return response.data;
};

export const deleteInstructor = async (instructorId) => {
  const response = await api.delete(`/instructors/${instructorId}`);
  return response.data;
};

export const uploadInstructorPhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/instructors/upload-photo', formData);
  return response.data;
};

// === Lessons ===
export const createLesson = async (courseId, lessonData) => {
  const response = await api.post(`/courses/${courseId}/lessons`, lessonData);
  return response.data;
};

export const getLessonsByCourse = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/lessons`);
  return response.data;
};

export const updateLesson = async (courseId, lessonId, lessonData) => {
  const response = await api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
  return response.data;
};

export const deleteLesson = async (courseId, lessonId) => {
  const response = await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
  return response.data;
};

export const reorderLessons = async (courseId, lessonsOrder) => {
  const response = await api.put(`/courses/${courseId}/lessons/reorder`, { lessons: lessonsOrder });
  return response.data;
};

export const uploadLessonMaterial = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/lessons/upload-material', formData);
  return response.data;
};

// Upload lesson image
export const uploadLessonImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/lessons/upload-image', formData);
  return response.data; // { url: "http://...", type: "image" }
};

// Upload lesson video
export const uploadLessonVideo = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/lessons/upload-video', formData, {
    timeout: 300000, // 5 minutes for large video files
  });
  return response.data; // { url: "http://...", type: "video" }
};

// === Progress ===

export const getCourseProgress = async () => {
  const response = await api.get('/progress/my-courses');
  return response.data;
};

export const completeLesson = async (courseId, lessonId) => {
  console.log('completeLesson called with:', { course_id: courseId, lesson_id: lessonId });
  const response = await api.post('/progress/complete-lesson', {
    course_id: courseId,
    lesson_id: lessonId,
  });
  return response.data;
};

// === Activity ===
export const getActivityLogs = async () => {
  const response = await api.get('/activity/logs');
  return response.data;
};

export const postActivityLog = async (logData) => {
  const response = await api.post('/activity/logs', logData);
  return response.data;
};

// === Questions and Answers ===
export const getQuestions = async (courseId) => {
  const response = await api.get('/questions', { params: { course_id: courseId } });
  return response.data;
};

export const getQuestionById = async (questionId) => {
  const response = await api.get(`/questions/${questionId}`);
  return response.data;
};

export const postQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const postAnswer = async (questionId, answerData) => {
  const response = await api.post(`/questions/${questionId}/answers`, answerData);
  return response.data;
};

export const voteAnswer = async (answerId, voteData) => {
  const response = await api.post(`/answers/${answerId}/vote`, voteData);
  return response.data;
};

// === Test ===
export const testApi = async () => {
  return await api.get('/test');
};

export const undoCompleteLesson = async (courseId, lessonId) => {
  const response = await api.post('/progress/undo-complete-lesson', {
    course_id: courseId,
    lesson_id: lessonId,
  });
  return response.data;
};

export const getActivityStreak = async () => {
  const response = await api.get('/activity/streak');
  return response.data;
};


export const getCompletedTasksCount = async () => {
  const response = await api.get('/progress/task/completed-count');  // вызывать через gateway
  return response.data;
};


export const enrollOnCourse = async (courseId) => {
  console.log('enrollOnCourse called with courseId:', courseId);
  // Отправляем POST запрос на gateway /progress/enroll
  const response = await api.post('/progress/enroll', { course_id: courseId });
  console.log('Enroll response:', response.data);
  return response.data;
};


export const verifyEmail = async (email, code) => {
  const response = await api.post('/auth/verify-email', { email, code });
  return response.data;
};


// Получить список всех задач
export const getTasks = async () => {
  const response = await api.get('/tasks');
  return response.data;
};

// Получить задачу по ID
export const getTaskById = async (taskId) => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

// Запустить код по задаче с id taskId
export const runTaskCode = async (taskId, code) => {
  const response = await api.post(`/tasks/${taskId}/run`, { 
    code: code, 
    language: "python" 
  });
  return response.data;
};


export const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data;
};

// Добавить задачу в избранное по ID
export const addFavorite = async (taskId) => {
  const response = await api.post(`/favorites/${taskId}`);
  return response.data;
};

// Удалить задачу из избранного по ID
export const removeFavorite = async (taskId) => {
  const response = await api.delete(`/favorites/${taskId}`);
  return response.data;
};

export const getSolvedTasks = async (token) => {
  const response = await api.get('/tasks/solved', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const isTaskSolved = async (taskId, token) => {
  const response = await api.get(`/tasks/${taskId}/solved`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // { solved: true/false }
};


export const getTaskLeaderboard = async (taskId, token) => {
  const response = await api.get(`/tasks/${taskId}/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // Ожидается объект с таблицей лидеров
};
