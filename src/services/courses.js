import { getAllCoursesMock, getCourseBySlugMock } from '../mock/courses';
import { getAllCourses as getAllCoursesApi, getCourseByIdOrSlug as getCourseBySlugApi } from '../api';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || true; // TODO: убрать "|| true" когда бэкенд готов

export const getAllCourses = () =>
  USE_MOCK ? getAllCoursesMock() : getAllCoursesApi();

export const getCourseBySlug = (slug) =>
  USE_MOCK ? getCourseBySlugMock(slug) : getCourseBySlugApi(slug);
