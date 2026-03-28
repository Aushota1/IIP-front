import course1 from '../assets/course1.jpg';
import course2 from '../assets/course2.jpg';
import course3 from '../assets/course3.jpg';

const coursesData = {
  'blender-cad': {
    id: 1,
    title: 'Blender CAD для начинающих',
    image: course1,
    excerpt: 'Научитесь 3D-моделированию в Blender с нуля.',
    description: 'Этот курс охватывает основы 3D-моделирования, интерфейс Blender и создание CAD-объектов.',
    level: 'beginner',
    duration: '6 недель',
    price: 'Бесплатно',
    features: [
      { icon: '🧱', title: 'Проекты', text: 'Практические проекты в каждом модуле' },
      { icon: '🎥', title: 'Видеоуроки', text: 'HD-уроки с пояснениями' },
      { icon: '👩‍🏫', title: 'Поддержка', text: 'Обратная связь от наставников' },
    ],
    program: [
      { content_id: 1, title: 'Урок 1: Знакомство', description: 'Описание урока 1', duration: '10 мин' },
      { content_id: 2, title: 'Урок 2: Основы', description: 'Описание урока 2', duration: '20 мин' },
    ],
    reviews: [
      { name: 'Алексей Котов', role: 'Студент', text: 'Курс просто супер!', rating: 5, avatar: '' },
    ],
    instructors: [
      { name: 'Ирина Морозова', position: '3D-художник', bio: 'Работает с Blender более 10 лет.', photo: '', social: [] },
    ],
  },

  'algorithm-rush': {
    id: 2,
    title: 'Алгоритмы и структуры данных',
    image: course2,
    excerpt: 'Освойте алгоритмы и структуры данных для прохождения технических интервью.',
    description: 'Курс охватывает сортировки, графы, динамическое программирование и задачи на LeetCode.',
    level: 'advanced',
    duration: '8 недель',
    price: '4 900 ₽',
    features: [
      { icon: '⚡', title: 'Алгоритмы', text: 'Сортировки, поиск, графы' },
      { icon: '💡', title: 'Задачи', text: 'Разбор задач с интервью' },
      { icon: '🧠', title: 'Практика', text: 'Решение задач на каждом уроке' },
    ],
    program: [
      { content_id: 4, title: 'Урок 1: Сложность алгоритмов', description: 'Big O нотация', duration: '13 мин' },
    ],
    reviews: [
      { name: 'Никита Иванов', role: 'Frontend Developer', text: 'Очень насыщенный курс!', rating: 5, avatar: '' },
    ],
    instructors: [
      { name: 'Анна Серова', position: 'Senior разработчик', bio: 'Опыт более 7 лет.', photo: '', social: [] },
    ],
  },

  'ai-blackbox': {
    id: 3,
    title: 'Основы машинного обучения',
    image: course3,
    excerpt: 'Разберитесь в линейной регрессии, деревьях решений и кластеризации.',
    description: 'Курс вводит в машинное обучение, методы обучения с учителем и без, метрики.',
    level: 'intermediate',
    duration: '7 недель',
    price: '3 900 ₽',
    features: [
      { icon: '📊', title: 'Методы', text: 'KNN, Decision Trees, K-Means' },
      { icon: '📈', title: 'Метрики', text: 'MAE, RMSE, Accuracy, F1-score' },
      { icon: '💻', title: 'Практика', text: 'Задания на Python' },
    ],
    program: [
      { content_id: 3, title: 'Урок 1: Введение в ML', description: 'Что такое машинное обучение', duration: '30 мин' },
    ],
    reviews: [
      { name: 'Светлана Орлова', role: 'Data Scientist', text: 'Отличный старт для новичков в ML!', rating: 4, avatar: '' },
    ],
    instructors: [
      { name: 'Роман Бритвин', position: 'ML-инженер', bio: 'Разрабатывает модели на Python.', photo: '', social: [] },
    ],
  },
};

export const getAllCoursesMock = () =>
  new Promise((resolve) => setTimeout(() => resolve(coursesData), 300));

export const getCourseBySlugMock = (slug) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const course = coursesData[slug];
      course ? resolve(course) : reject(new Error(`Курс "${slug}" не найден`));
    }, 300)
  );
