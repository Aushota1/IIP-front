const progressData = [
  {
    course_id: 1,
    course_slug: 'blender-cad',
    completed_lessons: [1, 2],
    total_lessons: 2,
    progress_percentage: 100,
  },
  {
    course_id: 2,
    course_slug: 'algorithm-rush',
    completed_lessons: [4],
    total_lessons: 1,
    progress_percentage: 100,
  },
];

export const getCourseProgressMock = () =>
  new Promise((resolve) => setTimeout(() => resolve(progressData), 300));

export const completeLessonMock = (courseId, contentId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Урок ${contentId} курса ${courseId} отмечен как завершённый`);
      resolve({ success: true });
    }, 300);
  });

export const undoCompleteLessonMock = (courseId, contentId) =>
  new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Урок ${contentId} курса ${courseId} отмечен как незавершённый`);
      resolve({ success: true });
    }, 300);
  });

export const getActivityStreakMock = () =>
  new Promise((resolve) => setTimeout(() => resolve({ streak: 7 }), 300));

export const getCompletedTasksCountMock = () =>
  new Promise((resolve) => setTimeout(() => resolve({ count: 15 }), 300));

export const getActivityLogsMock = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const logs = {
        '2024-03-20': [{ action: 'completed_lesson', course_id: 1, content_id: 1 }],
        '2024-03-21': [{ action: 'completed_lesson', course_id: 1, content_id: 2 }],
        '2024-03-22': [{ action: 'completed_task', task_id: 5 }],
      };
      resolve(logs);
    }, 300)
  );
