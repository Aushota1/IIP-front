import {
  getCourseProgressMock,
  completeLessonMock,
  undoCompleteLessonMock,
  getActivityStreakMock,
  getCompletedTasksCountMock,
  getActivityLogsMock,
} from '../mock/progress';
import {
  getCourseProgress as getCourseProgressApi,
  completeLesson as completeLessonApi,
  undoCompleteLesson as undoCompleteLessonApi,
  getActivityStreak as getActivityStreakApi,
  getCompletedTasksCount as getCompletedTasksCountApi,
  getActivityLogs as getActivityLogsApi,
} from '../api';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const getCourseProgress = () =>
  USE_MOCK ? getCourseProgressMock() : getCourseProgressApi();

export const completeLesson = (courseId, contentId) =>
  USE_MOCK ? completeLessonMock(courseId, contentId) : completeLessonApi(courseId, contentId);

export const undoCompleteLesson = (courseId, contentId) =>
  USE_MOCK ? undoCompleteLessonMock(courseId, contentId) : undoCompleteLessonApi(courseId, contentId);

export const getActivityStreak = () =>
  USE_MOCK ? getActivityStreakMock() : getActivityStreakApi();

export const getCompletedTasksCount = () =>
  USE_MOCK ? getCompletedTasksCountMock() : getCompletedTasksCountApi();

export const getActivityLogs = () =>
  USE_MOCK ? getActivityLogsMock() : getActivityLogsApi();
