import React, { useState, useEffect } from 'react';
import { useCurriculum } from '../context/CurriculumContext';
import { getAllCourses } from '../services/courses';

/**
 * CourseSelector - Dropdown to select a course for curriculum management
 * Updates selectedCourse in CurriculumContext when selection changes
 */
const CourseSelector = () => {
  const { selectedCourse, setSelectedCourse } = useCurriculum();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await getAllCourses();
      console.log('Loaded courses data:', data);
      
      // Handle both array and object formats
      if (Array.isArray(data)) {
        console.log('Courses are in array format');
        setCourses(data);
      } else {
        console.log('Courses are in object format, converting to array');
        const coursesArray = Object.entries(data).map(([slug, c]) => ({ ...c, slug }));
        console.log('Converted courses:', coursesArray);
        setCourses(coursesArray);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Не удалось загрузить список курсов');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const courseId = parseInt(e.target.value);
    const course = courses.find(c => c.id === courseId);
    setSelectedCourse(course || null);
  };

  if (loading) {
    return (
      <div className="course-selector">
        <label>Загрузка курсов...</label>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-selector">
        <label>
          <span className="error-text">{error}</span>
          <button onClick={loadCourses} className="btn btn-sm btn-outline">
            Повторить
          </button>
        </label>
      </div>
    );
  }

  return (
    <div className="course-selector">
      <label>
        Выберите курс *
        <select
          value={selectedCourse?.id || ''}
          onChange={handleCourseChange}
        >
          <option value="">-- Выберите курс --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default CourseSelector;
