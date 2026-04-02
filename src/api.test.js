import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { NetworkError, APIError } from './errors';

// Import the api instance (we need to test the interceptors)
// Note: In a real scenario, you'd export the api instance from api.js
// For this test, we'll create a similar setup

describe('API Interceptors', () => {
  let mock;
  let api;

  beforeEach(() => {
    // Create a fresh axios instance with the same config
    api = axios.create({
      baseURL: 'http://localhost:8000/api',
    });

    // Add the same interceptors as in api.js
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (!(config.data instanceof FormData)) {
          config.headers['Content-Type'] = 'application/json';
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          return Promise.reject(new NetworkError('Ошибка сети. Проверьте подключение к интернету.', error));
        }

        const { status, data } = error.response;
        const message = data?.detail || data?.message || 'Ошибка сервера';

        switch (status) {
          case 401:
            localStorage.removeItem('token');
            return Promise.reject(new APIError(401, 'Необходима авторизация'));

          case 403:
            return Promise.reject(new APIError(403, 'У вас нет прав для выполнения этого действия'));

          case 422:
            return Promise.reject(new APIError(422, 'Ошибка валидации данных', data?.errors || data));

          default:
            return Promise.reject(new APIError(status, message, data));
        }
      }
    );

    mock = new MockAdapter(api);
    
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
    localStorage.clear();
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      mock.onGet('/test').reply(200, { success: true });

      await api.get('/test');

      expect(mock.history.get[0].headers['Authorization']).toBe('Bearer test-token');
    });

    it('should not add Authorization header when token does not exist', async () => {
      mock.onGet('/test').reply(200, { success: true });

      await api.get('/test');

      expect(mock.history.get[0].headers['Authorization']).toBeUndefined();
    });

    it('should set Content-Type to application/json for regular data', async () => {
      mock.onPost('/test').reply(200, { success: true });

      await api.post('/test', { data: 'test' });

      expect(mock.history.post[0].headers['Content-Type']).toBe('application/json');
    });
  });

  describe('Response Interceptor - Network Errors', () => {
    it('should throw NetworkError when no response is received', async () => {
      mock.onGet('/test').networkError();

      await expect(api.get('/test')).rejects.toThrow(NetworkError);
      await expect(api.get('/test')).rejects.toThrow('Ошибка сети. Проверьте подключение к интернету.');
    });
  });

  describe('Response Interceptor - 401 Unauthorized', () => {
    it('should throw APIError with status 401', async () => {
      mock.onGet('/test').reply(401, { detail: 'Unauthorized' });

      await expect(api.get('/test')).rejects.toThrow(APIError);
      await expect(api.get('/test')).rejects.toMatchObject({
        status: 401,
        message: 'Необходима авторизация',
      });
    });

    it('should clear token from localStorage on 401', async () => {
      localStorage.setItem('token', 'test-token');
      mock.onGet('/test').reply(401, { detail: 'Unauthorized' });

      try {
        await api.get('/test');
      } catch (error) {
        // Expected to throw
      }

      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Response Interceptor - 403 Forbidden', () => {
    it('should throw APIError with status 403', async () => {
      mock.onGet('/test').reply(403, { detail: 'Forbidden' });

      await expect(api.get('/test')).rejects.toThrow(APIError);
      await expect(api.get('/test')).rejects.toMatchObject({
        status: 403,
        message: 'У вас нет прав для выполнения этого действия',
      });
    });
  });

  describe('Response Interceptor - 422 Validation Error', () => {
    it('should throw APIError with status 422 and validation details', async () => {
      const validationErrors = {
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password too short' },
        ],
      };

      mock.onPost('/test').reply(422, validationErrors);

      await expect(api.post('/test', {})).rejects.toThrow(APIError);
      await expect(api.post('/test', {})).rejects.toMatchObject({
        status: 422,
        message: 'Ошибка валидации данных',
        details: validationErrors.errors,
      });
    });
  });

  describe('Response Interceptor - Other Errors', () => {
    it('should throw APIError for 404 errors', async () => {
      mock.onGet('/test').reply(404, { detail: 'Not found' });

      await expect(api.get('/test')).rejects.toThrow(APIError);
      await expect(api.get('/test')).rejects.toMatchObject({
        status: 404,
        message: 'Not found',
      });
    });

    it('should throw APIError for 500 errors', async () => {
      mock.onGet('/test').reply(500, { detail: 'Internal server error' });

      await expect(api.get('/test')).rejects.toThrow(APIError);
      await expect(api.get('/test')).rejects.toMatchObject({
        status: 500,
        message: 'Internal server error',
      });
    });

    it('should use default message when no detail is provided', async () => {
      mock.onGet('/test').reply(500, {});

      await expect(api.get('/test')).rejects.toMatchObject({
        message: 'Ошибка сервера',
      });
    });
  });
});
