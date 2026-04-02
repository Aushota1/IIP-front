import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Add authorization interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Retry logic for network errors
 */
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1 || error.response) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

/**
 * Handle API errors with proper error types
 */
const handleAPIError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.detail || data?.message || 'Ошибка сервера';
    
    switch (status) {
      case 401:
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new APIError(401, 'Необходима авторизация');
      
      case 403:
        throw new APIError(403, 'У вас нет прав для выполнения этого действия');
      
      case 404:
        throw new APIError(404, 'Ресурс не найден');
      
      case 422:
        throw new APIError(422, 'Ошибка валидации данных', data?.errors || data);
      
      default:
        throw new APIError(status, message, data);
    }
  } else if (error.request) {
    throw new Error('Ошибка сети. Проверьте подключение к интернету.');
  } else {
    throw error;
  }
};

/**
 * CurriculumAPI - Service for managing course curriculum
 */
class CurriculumAPI {
  // ===== Course Info =====
  
  /**
   * Get course info (modules and lessons without sections content)
   * Optimized for displaying course program on course page
   * @param {number} courseId - Course ID
   * @returns {Promise<Object>} Course info with modules and lessons
   */
  async getCourseInfo(courseId) {
    try {
      return await retryRequest(async () => {
        const response = await api.get(`/courses-info/${courseId}`);
        return response.data;
      });
    } catch (error) {
      handleAPIError(error);
    }
  }

  // ===== Modules =====
  
  /**
   * Get all modules for a course
   * @param {number} courseId - Course ID
   * @returns {Promise<Array>} Array of modules
   */
  async getModules(courseId) {
    try {
      return await retryRequest(async () => {
        const response = await api.get(`/courses/${courseId}/modules`);
        return response.data;
      });
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Create a new module
   * @param {number} courseId - Course ID
   * @param {Object} data - Module data { title, order_index }
   * @returns {Promise<Object>} Created module
   */
  async createModule(courseId, data) {
    try {
      const response = await api.post(`/courses/${courseId}/modules`, data);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Update a module
   * @param {number} moduleId - Module ID
   * @param {Object} data - Partial module data
   * @returns {Promise<Object>} Updated module
   */
  async updateModule(moduleId, data) {
    try {
      const response = await api.put(`/modules/${moduleId}`, data);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Delete a module
   * @param {number} moduleId - Module ID
   * @returns {Promise<void>}
   */
  async deleteModule(moduleId) {
    try {
      await api.delete(`/modules/${moduleId}`);
    } catch (error) {
      handleAPIError(error);
    }
  }

  // ===== Lessons =====
  
  /**
   * Get all lessons for a module
   * @param {number} courseId - Course ID
   * @param {number} moduleId - Module ID
   * @returns {Promise<Array>} Array of lesson summaries
   */
  async getLessons(courseId, moduleId) {
    try {
      return await retryRequest(async () => {
        const response = await api.get(`/courses/${courseId}/modules/${moduleId}/lessons`);
        return response.data;
      });
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Get a single lesson by ID
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<Object>} Lesson with full sections
   */
  async getLesson(lessonId) {
    try {
      return await retryRequest(async () => {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
      });
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Create a new lesson
   * @param {number} courseId - Course ID
   * @param {number} moduleId - Module ID
   * @param {Object} data - Lesson data { title, order_index, duration_minutes, sections }
   * @returns {Promise<Object>} Created lesson
   */
  async createLesson(courseId, moduleId, data) {
    try {
      const response = await api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Update a lesson
   * @param {number} lessonId - Lesson ID
   * @param {Object} data - Partial lesson data
   * @returns {Promise<Object>} Updated lesson
   */
  async updateLesson(lessonId, data) {
    try {
      const response = await api.put(`/lessons/${lessonId}`, data);
      return response.data;
    } catch (error) {
      handleAPIError(error);
    }
  }

  /**
   * Delete a lesson
   * @param {number} lessonId - Lesson ID
   * @returns {Promise<void>}
   */
  async deleteLesson(lessonId) {
    try {
      await api.delete(`/lessons/${lessonId}`);
    } catch (error) {
      handleAPIError(error);
    }
  }
}

// Export singleton instance
export const curriculumAPI = new CurriculumAPI();
export { APIError };
export default curriculumAPI;
