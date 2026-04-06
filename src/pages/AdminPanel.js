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
  createCodingTask,
  createTestCase,
  getCodingTasks,
  updateCodingTask,
  deleteCodingTask,
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

const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  difficulty: 'easy',
  time_limit_ms: 5000,
  memory_limit_mb: 128,
  allowed_languages: ['python'],
  function_signature: 'def solution():',
  hints: [],
  tags: [],
};

const EMPTY_TEST_CASE = {
  input_data: '',
  expected_output: '',
  is_hidden: false,
  weight: 1,
  description: '',
};



const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('courses'); // courses, instructors, curriculum, tasks
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
  
  // Task form
  const [taskForm, setTaskForm] = useState(EMPTY_TASK_FORM);
  const [testCases, setTestCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadCourses();
    loadAllInstructors();
    loadTasks();
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

  const loadTasks = async () => {
    try {
      const data = await getCodingTasks({ limit: 100 });
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
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

  // ========== TASK HANDLERS ==========
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHint = () => {
    setTaskForm((prev) => ({
      ...prev,
      hints: [...prev.hints, { text: '' }],
    }));
  };

  const handleRemoveHint = (index) => {
    setTaskForm((prev) => ({
      ...prev,
      hints: prev.hints.filter((_, i) => i !== index),
    }));
  };

  const handleHintChange = (index, value) => {
    const newHints = [...taskForm.hints];
    newHints[index] = { text: value };
    setTaskForm((prev) => ({ ...prev, hints: newHints }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
    setTaskForm((prev) => ({ ...prev, tags }));
  };

  const handleAddTestCase = () => {
    setTestCases((prev) => [...prev, { ...EMPTY_TEST_CASE }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    if (field === 'is_hidden') {
      newTestCases[index][field] = value === 'true';
    } else if (field === 'weight') {
      newTestCases[index][field] = parseInt(value) || 1;
    } else {
      newTestCases[index][field] = value;
    }
    setTestCases(newTestCases);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      // Создать или обновить задачу
      const taskData = {
        ...taskForm,
        hints: taskForm.hints.filter(h => h.text.trim()),
      };

      let taskId;
      if (editingTaskId) {
        await updateCodingTask(editingTaskId, taskData);
        taskId = editingTaskId;
        setMessage({ type: 'success', text: 'Задача обновлена' });
      } else {
        const newTask = await createCodingTask(taskData);
        taskId = newTask.id;
        
        // Добавить тестовые случаи
        for (const testCase of testCases) {
          if (testCase.input_data && testCase.expected_output) {
            try {
              const parsedInput = JSON.parse(`[${testCase.input_data}]`);
              const parsedOutput = JSON.parse(testCase.expected_output);
              
              await createTestCase(taskId, {
                input_data: parsedInput,
                expected_output: parsedOutput,
                is_hidden: testCase.is_hidden,
                weight: testCase.weight,
                description: testCase.description,
              });
            } catch (err) {
              console.error('Failed to parse test case:', err);
            }
          }
        }
        
        setMessage({ type: 'success', text: 'Задача создана' });
      }

      setTaskForm(EMPTY_TASK_FORM);
      setTestCases([]);
      setShowTaskForm(false);
      setEditingTaskId(null);
      await loadTasks();
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка: ${err.message || err}` });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title || '',
      description: task.description || '',
      difficulty: task.difficulty || 'easy',
      time_limit_ms: task.time_limit_ms || 5000,
      memory_limit_mb: task.memory_limit_mb || 128,
      allowed_languages: task.allowed_languages || ['python'],
      function_signature: task.function_signature || 'def solution():',
      hints: task.hints || [],
      tags: task.tags || [],
    });
    setTestCases([]);
    setShowTaskForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      return;
    }
    
    setLoading(true);
    setMessage(null);
    try {
      await deleteCodingTask(taskId);
      setMessage({ type: 'success', text: 'Задача удалена' });
      await loadTasks();
    } catch (err) {
      setMessage({ type: 'error', text: `Ошибка: ${err.message || err}` });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTask = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    setTaskForm(EMPTY_TASK_FORM);
    setTestCases([]);
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
            <button
              className={`admin-tab ${activeTab === 'tasks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              💻 Задачи
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

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <>
              {!showTaskForm ? (
                <>
                  <section className="admin-section">
                    <div className="section-header">
                      <h2>Все задачи ({tasks.length})</h2>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowTaskForm(true)}
                      >
                        + Создать задачу
                      </button>
                    </div>
                    
                    <div className="admin-list">
                      {tasks.map((task) => (
                        <div key={task.id} className="admin-list-item">
                          <div className="admin-list-info">
                            <div>
                              <p className="admin-list-title">{task.title}</p>
                              <p className="admin-list-meta">
                                <span className={`level-badge ${task.difficulty}`}>
                                  {task.difficulty}
                                </span>
                                {task.tags?.map((tag, idx) => (
                                  <span key={idx} className="tag-badge">{tag}</span>
                                ))}
                              </p>
                              {task.description && (
                                <p className="admin-list-description">
                                  {task.description.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="admin-list-actions">
                            <button 
                              className="btn btn-outline btn-sm" 
                              onClick={() => handleEditTask(task)}
                            >
                              Редактировать
                            </button>
                            <button 
                              className="btn btn-danger btn-sm" 
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <p className="admin-empty">Задач пока нет</p>
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <>
                  <section className="admin-section">
                    <h2>{editingTaskId ? 'Редактирование задачи' : 'Создать задачу'}</h2>
                    
                    <form className="admin-form" onSubmit={handleSubmitTask}>
                      <label>
                        Название задачи *
                        <input
                          name="title"
                          value={taskForm.title}
                          onChange={handleTaskChange}
                          required
                          placeholder="Сумма двух чисел"
                        />
                      </label>

                      <div className="form-row">
                        <label>
                          Сложность *
                          <select 
                            name="difficulty" 
                            value={taskForm.difficulty} 
                            onChange={handleTaskChange}
                          >
                            <option value="easy">Легко</option>
                            <option value="medium">Средне</option>
                            <option value="hard">Сложно</option>
                          </select>
                        </label>
                        <label>
                          Лимит времени (мс) *
                          <input
                            type="number"
                            name="time_limit_ms"
                            value={taskForm.time_limit_ms}
                            onChange={handleTaskChange}
                            required
                            min="1000"
                            max="30000"
                          />
                        </label>
                        <label>
                          Лимит памяти (МБ) *
                          <input
                            type="number"
                            name="memory_limit_mb"
                            value={taskForm.memory_limit_mb}
                            onChange={handleTaskChange}
                            required
                            min="64"
                            max="512"
                          />
                        </label>
                      </div>

                      <label>
                        Описание задачи *
                        <textarea
                          name="description"
                          value={taskForm.description}
                          onChange={handleTaskChange}
                          required
                          rows={6}
                          placeholder="Напишите функцию solution(a, b), которая возвращает сумму двух чисел..."
                        />
                      </label>

                      <label>
                        Сигнатура функции *
                        <input
                          name="function_signature"
                          value={taskForm.function_signature}
                          onChange={handleTaskChange}
                          required
                          placeholder="def solution(a: int, b: int) -> int:"
                        />
                        <small>Пример: def solution(a: int, b: int) -&gt; int:</small>
                      </label>

                      <label>
                        Теги (через запятую)
                        <input
                          name="tags"
                          value={taskForm.tags.join(', ')}
                          onChange={handleTagsChange}
                          placeholder="math, beginner, arrays"
                        />
                      </label>

                      {/* Hints */}
                      <div className="hints-section">
                        <label>Подсказки</label>
                        {taskForm.hints.map((hint, index) => (
                          <div key={index} className="hint-row">
                            <input
                              type="text"
                              value={hint.text}
                              onChange={(e) => handleHintChange(index, e.target.value)}
                              placeholder="Используйте оператор +"
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => handleRemoveHint(index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <button 
                          type="button" 
                          className="btn btn-outline btn-sm" 
                          onClick={handleAddHint}
                        >
                          + Добавить подсказку
                        </button>
                      </div>

                      {/* Test Cases */}
                      {!editingTaskId && (
                        <div className="test-cases-section">
                          <label>Тестовые случаи</label>
                          {testCases.map((testCase, index) => (
                            <div key={index} className="test-case-card">
                              <div className="test-case-header">
                                <h4>Тест #{index + 1}</h4>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRemoveTestCase(index)}
                                >
                                  Удалить
                                </button>
                              </div>
                              
                              <div className="form-row">
                                <label>
                                  Входные данные (JSON) *
                                  <input
                                    value={testCase.input_data}
                                    onChange={(e) => handleTestCaseChange(index, 'input_data', e.target.value)}
                                    placeholder="2, 3"
                                    required
                                  />
                                  <small>Пример: 2, 3 или [1, 2, 3]</small>
                                </label>
                                <label>
                                  Ожидаемый результат (JSON) *
                                  <input
                                    value={testCase.expected_output}
                                    onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                                    placeholder="5"
                                    required
                                  />
                                  <small>Пример: 5 или [1, 2]</small>
                                </label>
                              </div>

                              <div className="form-row">
                                <label>
                                  Описание
                                  <input
                                    value={testCase.description}
                                    onChange={(e) => handleTestCaseChange(index, 'description', e.target.value)}
                                    placeholder="Простой случай"
                                  />
                                </label>
                                <label>
                                  Вес
                                  <input
                                    type="number"
                                    value={testCase.weight}
                                    onChange={(e) => handleTestCaseChange(index, 'weight', e.target.value)}
                                    min="1"
                                    max="10"
                                  />
                                </label>
                                <label>
                                  Скрытый тест
                                  <select
                                    value={testCase.is_hidden.toString()}
                                    onChange={(e) => handleTestCaseChange(index, 'is_hidden', e.target.value)}
                                  >
                                    <option value="false">Нет</option>
                                    <option value="true">Да</option>
                                  </select>
                                </label>
                              </div>
                            </div>
                          ))}
                          <button 
                            type="button" 
                            className="btn btn-outline btn-sm" 
                            onClick={handleAddTestCase}
                          >
                            + Добавить тестовый случай
                          </button>
                        </div>
                      )}

                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                          {loading ? 'Сохранение...' : editingTaskId ? 'Сохранить изменения' : 'Создать задачу'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={handleCancelTask}>
                          Отмена
                        </button>
                      </div>
                    </form>
                  </section>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
