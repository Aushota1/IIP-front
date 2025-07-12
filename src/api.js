import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик для ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.detail || error.message;
    console.error('API Error:', errorMessage);
    return Promise.reject(errorMessage);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const testApi = async () => {
  return await api.get('/test');
};

export const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await api.get(`/auth/profile?token=${token}`);
  return response.data;
};

// Новая функция для обновления прогресса пользователя
export const updateCourseProgress = async (token, courseSlug, completedLessons) => {
  try {
    const response = await api.post(`/auth/progress?token=${token}`, {
      course_slug: courseSlug,
      completed_lessons: completedLessons,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
