const tasksData = [
  {
    id: 1,
    title: 'Сумма двух чисел',
    description: 'Напишите функцию, которая принимает два числа и возвращает их сумму.',
    difficulty: 'easy',
    tags: ['математика', 'функции'],
    solved: false,
  },
  {
    id: 2,
    title: 'Разворот строки',
    description: 'Напишите функцию, которая разворачивает строку задом наперёд.',
    difficulty: 'easy',
    tags: ['строки'],
    solved: false,
  },
  {
    id: 3,
    title: 'Поиск дубликатов',
    description: 'Найдите все дублирующиеся элементы в массиве.',
    difficulty: 'medium',
    tags: ['массивы', 'хэш-таблицы'],
    solved: false,
  },
];

export const getTasksMock = () =>
  new Promise((resolve) => setTimeout(() => resolve(tasksData), 300));

export const getTaskByIdMock = (taskId) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const task = tasksData.find((t) => t.id === Number(taskId));
      task ? resolve(task) : reject(new Error(`Задача #${taskId} не найдена`));
    }, 300)
  );
