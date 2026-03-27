import { getTasksMock, getTaskByIdMock } from '../mock/tasks';
import { getTasks as getTasksApi, getTaskById as getTaskByIdApi } from '../api';

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true';

export const getTasks = () =>
  USE_MOCK ? getTasksMock() : getTasksApi();

export const getTaskById = (taskId) =>
  USE_MOCK ? getTaskByIdMock(taskId) : getTaskByIdApi(taskId);
