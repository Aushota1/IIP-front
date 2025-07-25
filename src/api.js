import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерцептор для автоматического добавления Authorization заголовка
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

// === Auth ===
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  console.log('Login response:', response.data); // можно убрать после проверки

  const token = response.data.access_token;  // <--- здесь заменено

  if (!token) {
    throw new Error('Token not found in login response');
  }

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

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

// === Progress ===

export const getCourseProgress = async () => {
  const response = await api.get('/progress/my-courses');
  return response.data;
};

export const completeLesson = async (courseId, contentId) => {
  console.log('completeLesson called with:', { course_id: courseId, content_id: contentId });
  const response = await api.post('/progress/complete-lesson', {
    course_id: courseId,
    content_id: contentId,
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

export const undoCompleteLesson = async (courseId, contentId) => {
  const response = await api.post('/progress/undo-complete-lesson', {
    course_id: courseId,
    content_id: contentId,
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
  // Отправляем POST запрос на gateway /progress/enroll
  const response = await api.post('/progress/enroll', { course_id: courseId });
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
