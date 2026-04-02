import React, { useState } from 'react';
import { uploadLessonImage } from '../api';

/**
 * ImageBlockEditor - Specialized editor for image blocks with preview
 * 
 * @param {Object} props
 * @param {string} props.url - Image URL
 * @param {Function} props.onChange - Callback when URL changes
 * @param {string} props.error - Error message
 */
const ImageBlockEditor = ({ url, onChange, error }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleUrlChange = (newUrl) => {
    setImageLoaded(false);
    setImageError(false);
    onChange(newUrl);
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Неподдерживаемый формат. Используйте JPEG, PNG, WebP или GIF');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Файл слишком большой. Максимальный размер: 5 МБ');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadLessonImage(file);
      onChange(response.url);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-block-editor">
      <div className="url-input">
        <label htmlFor="image-url">
          URL изображения <span className="required">*</span>
        </label>
        <input
          type="url"
          id="image-url"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className={error ? 'error' : ''}
        />
        {error && <span className="error-message">{error}</span>}
      </div>

      <div className="file-upload">
        <label htmlFor="image-file" className="upload-label">
          Или загрузите файл
        </label>
        <input
          type="file"
          id="image-file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileUpload}
          disabled={uploading}
          className="file-input"
        />
        {uploading && <span className="upload-status">⏳ Загрузка...</span>}
        {uploadError && <span className="error-message">{uploadError}</span>}
      </div>

      {url && (
        <div className="image-preview-container">
          <h4>Предварительный просмотр:</h4>
          <div className="image-preview">
            {!imageLoaded && !imageError && (
              <div className="loading-placeholder">Загрузка изображения...</div>
            )}
            {imageError && (
              <div className="error-placeholder">
                Не удалось загрузить изображение. Проверьте URL.
              </div>
            )}
            <img
              src={url}
              alt="Предварительный просмотр"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
          </div>
        </div>
      )}

      <div className="image-help">
        <h4>Рекомендации:</h4>
        <ul>
          <li>Используйте прямые ссылки на изображения (заканчиваются на .jpg, .png, .gif и т.д.)</li>
          <li>Убедитесь, что изображение доступно по ссылке</li>
          <li>Рекомендуемый размер: не более 2MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageBlockEditor;
