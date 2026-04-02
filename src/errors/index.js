/**
 * Custom error classes for the application
 */

/**
 * NetworkError - Thrown when network connectivity issues occur
 */
export class NetworkError extends Error {
  constructor(message = 'Ошибка сети. Проверьте подключение к интернету.', originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

/**
 * APIError - Thrown when API returns an error response
 */
export class APIError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }
}

/**
 * ParsingError - Thrown when content parsing fails
 */
export class ParsingError extends Error {
  constructor(message, section = null, details = null) {
    super(message);
    this.name = 'ParsingError';
    this.section = section;
    this.details = details;
  }
}
