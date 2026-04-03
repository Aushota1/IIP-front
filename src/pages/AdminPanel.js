import React, { useState, useEffect } from 'react';
import { getAllCourses } from '../services/courses';
import { 
  createCourse, 
  uploadCourseImage,
  createInstructor,
  uploadInstructorPhoto,
  getAllInstructors,
  getInstructorsByCourse,
  addInstructorToCourse,
  updateInstructor,
  deleteInstructor,
} from '../api';
import Sidebar from '../components/Sidebar';
import CurriculumBuilder from '../components/CurriculumBuilder';
import { CurriculumProvider } from '../context/CurriculumContext';
import '../styles/scss/pages/_admin-panel.scss';

const EMPTY_COURSE_FORM = {
  slug: '',
  title: '',
  excerpt: '',
  description: '',
  image: null,
  level: 'beginner',
  duration: '',
  price: '',
};

const EMPTY_INSTRUCTOR_FORM = {
  name: '',
  position: '',
  bio: '',
  photo: null,
  social: [{ icon: 'github', url: '' }],
};



const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('courses'); // courses, instructors, curriculum
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Course form
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM);
  const [editingSlug, setEditingSlug] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Instructor form
  const [instructorForm, setInstructorForm] = useState(EMPTY_INSTRUCTOR_FORM);
  const [allInstructors, setAllInstructors] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructorPhotoPreview, setInstructorPhotoPreview] = useState(null);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [editingInstructorId, setEditingInstructorId] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadCourses();
    loadAllInstructors();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadInstructors();
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        setCourses(Object.entries(data).map(([slug, c]) => ({ ...c, slug })));
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const loadInstructors = async () => {
    if (!selectedCourse?.id) return;
    try {
      const data = await getInstructorsByCourse(selectedCourse.id);
      setInstructors(data);
    } catch (err) {
      console.error('Failed to load instructors:', err);
    }
  };

  const loadAllInstructors = async () => {
    try {
      const data = await getAllInstructors();
      setAllInstructors(data);
    } catch (err) {
      console.error('Failed to load all instructors:', err);
    }
  };



  // ========== COURSE HANDLERS ==========
  const handleCourseChange = (e) => {
    setCourseForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCourseFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditCourse = (course) => {
    setEditingSlug(course.slug);
    setCourseForm({
      slug: course.slug || '',
      title: course.title || '',
      excerpt: course.excerpt || '',
      description: course.description || '',
      image: null,
      level: course.level || 'beginner',
      duration: course.duration || '',
      price: course.price || '',
    });
    setImagePreview(course.image || null);
    setSelectedCourse(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelCourse = () => {
    setEditingSlug(null);
    setCourseForm(EMPTY_COURSE_FORM);
    setImagePreview(null);
    setMessage(null);
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      let imageUrl = imagePreview;

      if (courseForm.image instanceof File) {
        const uploadResult = await uploadCourseImage(courseForm.image);
        imageUrl = uploadResult.url;
      }

      const courseData = {
        slug: courseForm.slug,
        title: courseForm.title,
        excerpt: courseForm.excerpt || '',
        description: courseForm.description || '',
        level: courseForm.level,
        duration: courseForm.duration || '',
        price: courseForm.price || '',
        image: imageUrl || '',
      };

      await createCourse(courseData);
      setMessage({ type: 'success', text: editingSlug ? 'Курс обновлён' : 'Курс создан' });
      setCourseForm(EMPTY_COURSE_FORM);
      setImagePreview(null);
      setEditingSlug(null);
      
      await loadCourses();
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка: ${err}` });
    } finally {
      setLoading(false);
    }
  };

  // ========== INSTRUCTOR HANDLERS ==========
  const handleInstructorChange = (e) => {
    setInstructorForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleInstructorPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInstructorForm((prev) => ({ ...prev, photo: file }));
      setInstructorPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSocialChange = (index, field, value) => {
    const newSocial = [...instructorForm.social];
    newSocial[index][field] = value;
    setInstructorForm((prev) => ({ ...prev, social: newSocial }));
  };

  const addSocialLink = () => {
    setInstructorForm((prev) => ({
      ...prev,
      social: [...prev.social, { icon: 'github', url: '' }],
    }));
  };

  const removeSocialLink = (index) => {
    setInstructorForm((prev) => ({
      ...prev,
      social: prev.social.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitInstructor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // 1. Загрузить фото (если есть)
      let photoUrl = instructorPhotoPreview;
      if (instructorForm.photo instanceof File) {
        const uploadResult = await uploadInstructorPhoto(instructorForm.photo);
        photoUrl = uploadResult.url;
      }
      
      // 2. Создать или обновить преподавателя
      const instructorData = {
        name: instructorForm.name,
        position: instructorForm.position,
        bio: instructorForm.bio,
        photo: photoUrl || '',
        social: instructorForm.social.filter(s => s.url),
      };
      
      if (editingInstructorId) {
        // Обновление существующего преподавателя
        await updateInstructor(editingInstructorId, instructorData);
        setMessage({ type: 'success', text: 'Преподаватель обновлён' });
      } else {
        // Создание нового преподавателя
        const newInstructor = await createInstructor(instructorData);
        
        // Если выбран курс, добавить преподавателя к курсу
        if (selectedCourse) {
          await addInstructorToCourse(selectedCourse.id, newInstructor.id, instructors.length);
          await loadInstructors();
        }
        
        setMessage({ type: 'success', text: 'Преподаватель создан' });
      }
      
      setInstructorForm(EMPTY_INSTRUCTOR_FORM);
      setInstructorPhotoPreview(null);
      setShowInstructorForm(false);
      setEditingInstructorId(null);
      await loadAllInstructors();
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка: ${err}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEditInstructor = (instructor) => {
    setEditingInstructorId(instructor.id);
    setInstructorForm({
      name: instructor.name || '',
      position: instructor.position || '',
      bio: instructor.bio || '',
      photo: null,
      social: instructor.social && instructor.social.length > 0 
        ? instructor.social 
        : [{ icon: 'github', url: '' }],
    });
    setInstructorPhotoPreview(instructor.photo || null);
    setShowInstructorForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого преподавателя?')) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    try {
      await deleteInstructor(instructorId);
      setMessage({ type: 'success', text: 'Преподаватель удалён' });
      await loadAllInstructors();
      if (selectedCourse) {
        await loadInstructors();
      }
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка: ${err}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInstructor = () => {
    setShowInstructorForm(false);
    setEditingInstructorId(null);
    setInstructorForm(EMPTY_INSTRUCTOR_FORM);
    setInstructorPhotoPreview(null);
    setMessage(null);
  };



  return (
    <div className="admin-panel-wrapper">
      <div className="admin-panel-layout">
        <Sidebar />

        <div className="admin-panel admin-panel-container">
          <header className="admin-panel-header">
            <h1>Панель администратора</h1>
            <div className="admin-stats">
              <div className="stat-item">
                <span className="stat-number">{courses.length}</span>
                <span className="stat-label">Курсов</span>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`admin-tab ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              📚 Курсы
            </button>
            <button
              className={`admin-tab ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructors')}
            >
              👨‍🏫 Преподаватели
            </button>
            <button
              className={`admin-tab ${activeTab === 'curriculum' ? 'active' : ''}`}
              onClick={() => setActiveTab('curriculum')}
            >
              📋 Программа Курса
            </button>
          </div>

          {message && (
            <div className={`admin-message admin-message--${message.type}`}>
              {message.text}
            </div>
          )}

          {/* COURSES TAB */}
          {activeTab === 'courses' && (
            <>
              <section className="admin-section">
                <h2>{editingSlug ? `Редактирование: ${editingSlug}` : 'Новый курс'}</h2>

                <form className="admin-form" onSubmit={handleSubmitCourse}>
                  <label>
                    Slug (URL-идентификатор) *
                    <input
                      name="slug"
                      value={courseForm.slug}
                      onChange={handleCourseChange}
                      required
                      placeholder="algorithm-rush"
                      disabled={editingSlug}
                    />
                    <small>Используется в URL: /courses/slug</small>
                  </label>

                  <div className="form-row">
                    <label>
                      Название *
                      <input
                        name="title"
                        value={courseForm.title}
                        onChange={handleCourseChange}
                        required
                        placeholder="Название курса"
                      />
                    </label>
                    <label>
                      Уровень *
                      <select name="level" value={courseForm.level} onChange={handleCourseChange}>
                        <option value="beginner">Начальный</option>
                        <option value="intermediate">Средний</option>
                        <option value="advanced">Продвинутый</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-row">
                    <label>
                      Длительность *
                      <input
                        name="duration"
                        value={courseForm.duration}
                        onChange={handleCourseChange}
                        required
                        placeholder="например: 6 недель"
                      />
                    </label>
                    <label>
                      Цена *
                      <input
                        name="price"
                        value={courseForm.price}
                        onChange={handleCourseChange}
                        required
                        placeholder="например: 4 900 ₽ или Бесплатно"
                      />
                    </label>
                  </div>

                  <label>
                    Обложка курса *
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCourseFileChange}
                      required={!editingSlug && !imagePreview}
                    />
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                      </div>
                    )}
                  </label>

                  <label>
                    Краткое описание (excerpt) *
                    <textarea
                      name="excerpt"
                      value={courseForm.excerpt}
                      onChange={handleCourseChange}
                      required
                      rows={2}
                      placeholder="Отображается на карточке курса"
                    />
                  </label>

                  <label>
                    Полное описание *
                    <textarea
                      name="description"
                      value={courseForm.description}
                      onChange={handleCourseChange}
                      required
                      rows={5}
                      placeholder="Подробное описание курса"
                    />
                  </label>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Сохранение...' : editingSlug ? 'Сохранить изменения' : 'Создать курс'}
                    </button>
                    {editingSlug && (
                      <button type="button" className="btn btn-outline" onClick={handleCancelCourse}>
                        Отмена
                      </button>
                    )}
                  </div>
                </form>
              </section>

              <section className="admin-section">
                <h2>Существующие курсы ({courses.length})</h2>
                <div className="admin-list">
                  {courses.map((course) => (
                    <div key={course.slug || course.id} className="admin-list-item">
                      <div className="admin-list-info">
                        {course.image && (
                          <img src={course.image} alt={course.title} className="admin-list-thumb" />
                        )}
                        <div>
                          <p className="admin-list-title">{course.title}</p>
                          <p className="admin-list-meta">
                            <span className={`level-badge ${course.level}`}>{course.level}</span>
                            <span>{course.duration}</span>
                            <span>{course.price}</span>
                          </p>
                        </div>
                      </div>
                      <button className="btn btn-outline btn-sm" onClick={() => handleEditCourse(course)}>
                        Редактировать
                      </button>
                    </div>
                  ))}
                  {courses.length === 0 && <p className="admin-empty">Курсов пока нет</p>}
                </div>
              </section>
            </>
          )}

          {/* INSTRUCTORS TAB */}
          {activeTab === 'instructors' && (
            <>
              {!showInstructorForm ? (
                <>
                  <section className="admin-section">
                    <div className="section-header">
                      <h2>Все преподаватели ({allInstructors.length})</h2>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowInstructorForm(true)}
                      >
                        + Создать профиль преподавателя
                      </button>
                    </div>
                    
                    <div className="admin-list">
                      {allInstructors.map((instructor) => (
                        <div key={instructor.id} className="admin-list-item">
                          <div className="admin-list-info">
                            {instructor.photo && (
                              <img src={instructor.photo} alt={instructor.name} className="admin-list-thumb" />
                            )}
                            <div>
                              <p className="admin-list-title">{instructor.name}</p>
                              <p className="admin-list-meta">
                                <span>{instructor.position}</span>
                              </p>
                              {instructor.bio && (
                                <p className="admin-list-description">{instructor.bio}</p>
                              )}
                            </div>
                          </div>
                          <div className="admin-list-actions">
                            <button 
                              className="btn btn-outline btn-sm" 
                              onClick={() => handleEditInstructor(instructor)}
                            >
                              Редактировать
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleDeleteInstructor(instructor.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                      {allInstructors.length === 0 && (
                        <p className="admin-empty">Преподавателей пока нет</p>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="admin-section">
                    <h2>{editingInstructorId ? 'Редактирование преподавателя' : 'Создать профиль преподавателя'}</h2>
                    
                    {!editingInstructorId && (
                      <div className="course-selector">
                        <label>
                          Добавить к курсу (опционально)
                          <select
                            value={selectedCourse?.id || ''}
                            onChange={(e) => {
                              const course = courses.find(c => c.id === parseInt(e.target.value));
                              setSelectedCourse(course);
                            }}
                          >
                            <option value="">-- Без курса --</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.id}>
                                {course.title}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    )}

                    <form className="admin-form" onSubmit={handleSubmitInstructor}>
                      <div className="form-row">
                        <label>
                          Имя преподавателя *
                          <input
                            name="name"
                            value={instructorForm.name}
                            onChange={handleInstructorChange}
                            required
                            placeholder="Анна Серова"
                          />
                        </label>
                        <label>
                          Должность *
                          <input
                            name="position"
                            value={instructorForm.position}
                            onChange={handleInstructorChange}
                            required
                            placeholder="Senior разработчик"
                          />
                        </label>
                      </div>

                      <label>
                        Биография *
                        <textarea
                          name="bio"
                          value={instructorForm.bio}
                          onChange={handleInstructorChange}
                          required
                          rows={3}
                          placeholder="Опыт работы, достижения..."
                        />
                      </label>

                      <label>
                        Фото преподавателя
                        <input type="file" accept="image/*" onChange={handleInstructorPhotoChange} />
                        {instructorPhotoPreview && (
                          <div className="image-preview small">
                            <img src={instructorPhotoPreview} alt="Preview" />
                          </div>
                        )}
                      </label>

                      <div className="social-links-section">
                        <label>Социальные сети</label>
                        {instructorForm.social.map((social, index) => (
                          <div key={index} className="social-link-row">
                            <select
                              value={social.icon}
                              onChange={(e) => handleSocialChange(index, 'icon', e.target.value)}
                            >
                              <option value="github">GitHub</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="twitter">Twitter</option>
                              <option value="website">Website</option>
                            </select>
                            <input
                              type="url"
                              value={social.url}
                              onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                              placeholder="https://..."
                            />
                            {instructorForm.social.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => removeSocialLink(index)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" className="btn btn-outline btn-sm" onClick={addSocialLink}>
                          + Добавить ссылку
                        </button>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? 'Сохранение...' : editingInstructorId ? 'Сохранить изменения' : 'Создать преподавателя'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={handleCancelInstructor}>
                          Отмена
                        </button>
                      </div>
                    </form>
                  </section>
                </>
              )}
            </>
          )}

          {/* CURRICULUM TAB */}
          {activeTab === 'curriculum' && (
            <CurriculumProvider>
              <section className="admin-section">
                <h2>Программа Курса</h2>
                <CurriculumBuilder />
              </section>
            </CurriculumProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
