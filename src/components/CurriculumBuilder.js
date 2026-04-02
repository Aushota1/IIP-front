import React, { useState, useEffect } from 'react';
import { useCurriculum } from '../context/CurriculumContext';
import { curriculumAPI } from '../services/curriculum';
import CourseSelector from './CourseSelector';
import LoadingSpinner from './LoadingSpinner';
import ModulesList from './ModulesList';

/**
 * CurriculumBuilder - Main component for curriculum management
 * Displays course selector, modules list, and handles module creation
 */
const CurriculumBuilder = () => {
  const { selectedCourse, modules, setModules } = useCurriculum();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  // Load modules when course is selected
  useEffect(() => {
    if (selectedCourse) {
      loadModules();
    } else {
      setModules([]);
    }
  }, [selectedCourse]);

  /**
   * Load modules for the selected course
   */
  const loadModules = async () => {
    if (!selectedCourse) return;

    console.log('Loading modules for course:', selectedCourse);
    console.log('Course ID:', selectedCourse.id);

    try {
      setLoading(true);
      setError(null);
      const data = await curriculumAPI.getModules(selectedCourse.id);
      console.log('Loaded modules:', data);
      setModules(data || []);
    } catch (err) {
      console.error('Failed to load modules:', err);
      setError(err.message || 'Не удалось загрузить модули');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new module
   */
  const handleCreateModule = async () => {
    if (!selectedCourse) return;

    try {
      setCreating(true);
      setError(null);

      // Calculate order_index based on existing modules
      const orderIndex = modules.length + 1;

      const newModule = await curriculumAPI.createModule(selectedCourse.id, {
        title: `Модуль ${orderIndex}`,
        order_index: orderIndex,
      });

      // Update modules list without page reload
      setModules([...modules, newModule]);
    } catch (err) {
      console.error('Failed to create module:', err);
      setError(err.message || 'Не удалось создать модуль');
    } finally {
      setCreating(false);
    }
  };

  /**
   * Update a module
   */
  const handleUpdateModule = async (moduleId, data) => {
    try {
      setError(null);
      const updatedModule = await curriculumAPI.updateModule(moduleId, data);
      
      // Update modules list
      setModules(modules.map(m => m.id === moduleId ? updatedModule : m));
    } catch (err) {
      console.error('Failed to update module:', err);
      setError(err.message || 'Не удалось обновить модуль');
      throw err;
    }
  };

  /**
   * Delete a module
   */
  const handleDeleteModule = async (moduleId) => {
    try {
      setError(null);
      await curriculumAPI.deleteModule(moduleId);
      
      // Remove module from list
      setModules(modules.filter(m => m.id !== moduleId));
    } catch (err) {
      console.error('Failed to delete module:', err);
      setError(err.message || 'Не удалось удалить модуль');
    }
  };

  /**
   * Reorder modules
   * @param {Array} updates - Array of { id, order_index } objects
   */
  const handleModuleReorder = async (updates) => {
    try {
      setError(null);
      
      // Optimistically update UI
      const updatedModules = modules.map((module) => {
        const update = updates.find((u) => u.id === module.id);
        return update ? { ...module, order_index: update.order_index } : module;
      });
      setModules(updatedModules);

      // Send PUT requests for each affected module
      await Promise.all(
        updates.map((update) =>
          curriculumAPI.updateModule(update.id, { order_index: update.order_index })
        )
      );
    } catch (err) {
      console.error('Failed to reorder modules:', err);
      setError(err.message || 'Не удалось изменить порядок модулей');
      // Reload modules on error
      loadModules();
    }
  };

  /**
   * Retry loading modules
   */
  const handleRetry = () => {
    loadModules();
  };

  return (
    <div className="curriculum-builder">
      <div className="curriculum-header">
        <h2>Программа Курса</h2>
        <CourseSelector />
      </div>

      {!selectedCourse && (
        <div className="empty-state">
          <p>Выберите курс для управления программой</p>
        </div>
      )}

      {selectedCourse && loading && (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Загрузка модулей...</p>
        </div>
      )}

      {selectedCourse && error && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
          <button onClick={handleRetry} className="btn btn-outline">
            Повторить попытку
          </button>
        </div>
      )}

      {selectedCourse && !loading && !error && modules.length === 0 && (
        <div className="empty-state">
          <p>У этого курса пока нет модулей</p>
          <button
            onClick={handleCreateModule}
            disabled={creating}
            className="btn btn-primary"
          >
            {creating ? 'Создание...' : 'Создать модуль'}
          </button>
        </div>
      )}

      {selectedCourse && !loading && !error && modules.length > 0 && (
        <ModulesList
          courseId={selectedCourse.id}
          modules={modules}
          onModuleCreate={handleCreateModule}
          onModuleUpdate={handleUpdateModule}
          onModuleDelete={handleDeleteModule}
          onModuleReorder={handleModuleReorder}
          creating={creating}
        />
      )}
    </div>
  );
};

export default CurriculumBuilder;
