import React, { useState } from 'react';
import { uploadLessonVideo } from '../api';

/**
 * VideoBlockEditor - Specialized editor for video blocks
 * 
 * @param {Object} props
 * @param {string} props.url - Video URL
 * @param {Function} props.onChange - Callback when URL changes
 * @param {string} props.error - Error message
 */
const VideoBlockEditor = ({ url, onChange, error }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Check if URL is a YouTube video
   */
  const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  /**
   * Check if URL is a Vimeo video
   */
  const isVimeoUrl = (url) => {
    return url.includes('vimeo.com');
  };

  /**
   * Get video platform name
   */
  const getVideoPlatform = () => {
    if (!url) return null;
    if (isYouTubeUrl(url)) return 'YouTube';
    if (isVimeoUrl(url)) return 'Vimeo';
    return 'Прямая ссылка';
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Неподдерживаемый формат. Используйте MP4, WebM, QuickTime или AVI');
      return;
    }

    // Validate file size (100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Файл слишком большой. Максимальный размер: 100 МБ');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const response = await uploadLessonVideo(file);
      onChange(response.url);
      setUploadProgress(100);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Ошибка загрузки видео');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="video-block-editor">
      <div className="url-input">
        <label htmlFor="video-url">
          URL видео <span className="required">*</span>
        </label>
        <input
          type="url"
          id="video-url"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... или https://vimeo.com/..."
          className={error ? 'error' : ''}
        />
        {error && <span className="error-message">{error}</span>}
      </div>

      <div className="file-upload">
        <label htmlFor="video-file" className="upload-label">
          Или загрузите видео файл
        </label>
        <input
          type="file"
          id="video-file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={handleFileUpload}
          disabled={uploading}
          className="file-input"
        />
        {uploading && (
          <div className="upload-status">
            <span>⏳ Загрузка видео... Это может занять несколько минут</span>
            {uploadProgress > 0 && <span> ({uploadProgress}%)</span>}
          </div>
        )}
        {uploadError && <span className="error-message">{uploadError}</span>}
        <small className="help-text">Максимальный размер: 100 МБ. Форматы: MP4, WebM, QuickTime, AVI</small>
      </div>

      {url && !error && (
        <div className="video-info">
          <p>
            <strong>Платформа:</strong> {getVideoPlatform()}
          </p>
        </div>
      )}

      <div className="video-help">
        <h4>Поддерживаемые форматы:</h4>
        <ul>
          <li>
            <strong>YouTube:</strong> https://youtube.com/watch?v=VIDEO_ID или
            https://youtu.be/VIDEO_ID
          </li>
          <li>
            <strong>Vimeo:</strong> https://vimeo.com/VIDEO_ID
          </li>
          <li>
            <strong>Прямая ссылка:</strong> https://example.com/video.mp4
          </li>
        </ul>
        <p className="note">
          Видео будет встроено в урок с помощью iframe или video тега
        </p>
      </div>
    </div>
  );
};

export default VideoBlockEditor;
