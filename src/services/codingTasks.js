import {
  getCodingTasks,
  getCodingTaskById,
  createCodingTask,
  updateCodingTask,
  deleteCodingTask,
  getTestCases,
  createTestCase,
  updateTestCase,
  deleteTestCase,
  submitCode,
  getSubmissionResult,
  getSubmissionsHistory,
} from '../api';

/**
 * Сервис для работы с задачами по программированию
 */

// Получить список задач с фильтрацией
export const fetchCodingTasks = async (filters = {}) => {
  try {
    const tasks = await getCodingTasks(filters);
    return tasks;
  } catch (error) {
    console.error('Error fetching coding tasks:', error);
    throw error;
  }
};

// Получить задачу по ID
export const fetchCodingTaskById = async (taskId) => {
  try {
    const task = await getCodingTaskById(taskId);
    return task;
  } catch (error) {
    console.error('Error fetching coding task:', error);
    throw error;
  }
};

// Создать новую задачу (admin)
export const createNewCodingTask = async (taskData) => {
  try {
    const task = await createCodingTask(taskData);
    return task;
  } catch (error) {
    console.error('Error creating coding task:', error);
    throw error;
  }
};

// Обновить задачу (admin)
export const updateExistingCodingTask = async (taskId, taskData) => {
  try {
    const task = await updateCodingTask(taskId, taskData);
    return task;
  } catch (error) {
    console.error('Error updating coding task:', error);
    throw error;
  }
};

// Удалить задачу (admin)
export const removeCodeTask = async (taskId) => {
  try {
    await deleteCodingTask(taskId);
  } catch (error) {
    console.error('Error deleting coding task:', error);
    throw error;
  }
};

// Получить тестовые случаи
export const fetchTestCases = async (taskId, includeHidden = false) => {
  try {
    const testCases = await getTestCases(taskId, includeHidden);
    return testCases;
  } catch (error) {
    console.error('Error fetching test cases:', error);
    throw error;
  }
};

// Добавить тестовый случай (admin)
export const addTestCase = async (taskId, testCaseData) => {
  try {
    const testCase = await createTestCase(taskId, testCaseData);
    return testCase;
  } catch (error) {
    console.error('Error creating test case:', error);
    throw error;
  }
};

// Обновить тестовый случай (admin)
export const updateExistingTestCase = async (testCaseId, testCaseData) => {
  try {
    const testCase = await updateTestCase(testCaseId, testCaseData);
    return testCase;
  } catch (error) {
    console.error('Error updating test case:', error);
    throw error;
  }
};

// Удалить тестовый случай (admin)
export const removeTestCase = async (testCaseId) => {
  try {
    await deleteTestCase(testCaseId);
  } catch (error) {
    console.error('Error deleting test case:', error);
    throw error;
  }
};

// Отправить решение
export const submitSolution = async (taskId, language, code) => {
  try {
    const result = await submitCode({
      coding_task_id: taskId,
      language,
      code,
    });
    return result;
  } catch (error) {
    console.error('Error submitting code:', error);
    throw error;
  }
};

// Получить результат решения
export const fetchSubmissionResult = async (submissionId) => {
  try {
    const result = await getSubmissionResult(submissionId);
    return result;
  } catch (error) {
    console.error('Error fetching submission result:', error);
    throw error;
  }
};

// Получить историю решений
export const fetchSubmissionsHistory = async (filters = {}) => {
  try {
    const submissions = await getSubmissionsHistory(filters);
    return submissions;
  } catch (error) {
    console.error('Error fetching submissions history:', error);
    throw error;
  }
};

// Форматировать статус выполнения
export const formatSubmissionStatus = (status) => {
  const statusMap = {
    pending: 'В очереди',
    running: 'Выполняется',
    success: 'Успешно',
    failed: 'Провалено',
    error: 'Ошибка',
    timeout: 'Превышен лимит времени',
    memory_limit: 'Превышен лимит памяти',
  };
  return statusMap[status] || status;
};

// Форматировать сложность
export const formatDifficulty = (difficulty) => {
  const difficultyMap = {
    easy: 'Легко',
    medium: 'Средне',
    hard: 'Сложно',
  };
  return difficultyMap[difficulty] || difficulty;
};
