import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Убираем интерцептор добавления Authorization, т.к. бекенд не ожидает токен в заголовке

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
  const token = response.data.token;  // именно token
  localStorage.setItem('token', token);
  return response.data;
};

export const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');

  const response = await api.get(`/auth/profile?token=${token}`);
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
export const updateCourseProgress = async (courseSlug, completedLessons) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');

  const response = await api.post(`/auth/progress?token=${token}`, {
    course_slug: courseSlug,
    completed_lessons: completedLessons,
  });
  return response.data;
};

export const getCourseProgress = async (courseId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Token not found');

  const response = await api.get(`/auth/progress/${courseId}?token=${token}`);
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
