import { NetworkError, APIError, ParsingError } from './index';

describe('Error Classes', () => {
  describe('NetworkError', () => {
    it('should create NetworkError with default message', () => {
      const error = new NetworkError();
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Ошибка сети. Проверьте подключение к интернету.');
      expect(error.originalError).toBeNull();
    });

    it('should create NetworkError with custom message', () => {
      const error = new NetworkError('Custom network error');
      
      expect(error.message).toBe('Custom network error');
    });

    it('should store original error', () => {
      const originalError = new Error('Connection timeout');
      const error = new NetworkError('Network failed', originalError);
      
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('APIError', () => {
    it('should create APIError with status and message', () => {
      const error = new APIError(404, 'Not found');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(APIError);
      expect(error.name).toBe('APIError');
      expect(error.status).toBe(404);
      expect(error.message).toBe('Not found');
      expect(error.details).toBeNull();
    });

    it('should create APIError with details', () => {
      const details = { field: 'email', error: 'Invalid format' };
      const error = new APIError(422, 'Validation error', details);
      
      expect(error.status).toBe(422);
      expect(error.details).toEqual(details);
    });

    it('should handle different status codes', () => {
      const error401 = new APIError(401, 'Unauthorized');
      const error403 = new APIError(403, 'Forbidden');
      const error422 = new APIError(422, 'Validation error');
      
      expect(error401.status).toBe(401);
      expect(error403.status).toBe(403);
      expect(error422.status).toBe(422);
    });
  });

  describe('ParsingError', () => {
    it('should create ParsingError with message', () => {
      const error = new ParsingError('Failed to parse content');
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ParsingError);
      expect(error.name).toBe('ParsingError');
      expect(error.message).toBe('Failed to parse content');
      expect(error.section).toBeNull();
      expect(error.details).toBeNull();
    });

    it('should create ParsingError with section and details', () => {
      const error = new ParsingError(
        'Invalid LaTeX syntax',
        'formula-section-1',
        'Missing closing brace'
      );
      
      expect(error.message).toBe('Invalid LaTeX syntax');
      expect(error.section).toBe('formula-section-1');
      expect(error.details).toBe('Missing closing brace');
    });
  });
});
