export const courses = {
  'blender-cad': {
    title: 'Blender CAD для начинающих',
    image: '/images/blender.jpg',
    excerpt: 'Научитесь 3D-моделированию в Blender с нуля.',
    description: 'Этот курс охватывает основы 3D-моделирования, интерфейс Blender и создание CAD-объектов.',
    level: 'Начальный',
    duration: '6 недель',
    price: 'Бесплатно',
    features: [
      { icon: '🧱', title: 'Проекты', text: 'Практические проекты в каждом модуле' },
      { icon: '🎥', title: 'Видеоуроки', text: 'HD-уроки с пояснениями' },
      { icon: '👩‍🏫', title: 'Поддержка', text: 'Обратная связь от наставников' },
    ],
    program: [
      { title: 'Знакомство с интерфейсом Blender', description: 'Установка, обзор, управление сценой.', duration: '1ч' },
      { title: 'Примитивы и трансформации', description: 'Создание базовых объектов и их изменение.', duration: '1.5ч' },
      { title: 'Модификаторы', description: 'Сглаживание, массив, boolean.', duration: '2ч' },
    ],
    reviews: [
      {
        name: 'Алексей Котов',
        role: 'Студент',
        text: 'Курс просто супер! Всё объясняется понятно и по делу.',
        rating: 5,
        avatar: '/avatars/alexey.jpg'
      }
    ],
    instructors: [
      {
        name: 'Ирина Морозова',
        position: '3D-художник',
        bio: 'Работает с Blender более 10 лет.',
        photo: '/instructors/irina.jpg',
        social: [
          { icon: '🔗', url: 'https://linkedin.com/in/irinamorozova' }
        ]
      }
    ]
  },

  'algorithm-rush': {
    title: 'algorithm-rush',
    image: '/images/frontend.jpg',
    excerpt: 'Создавайте профессиональные веб-приложения на React.',
    description: 'Курс охватывает React, TypeScript, маршрутизацию, хуки и Framer Motion.',
    level: 'Продвинутый',
    duration: '8 недель',
    price: '4 900 ₽',
    features: [
      { icon: '⚛️', title: 'React', text: 'Современные приёмы разработки' },
      { icon: '💡', title: 'Проекты', text: 'Создание UI-компонентов' },
      { icon: '🧠', title: 'Хуки и Анимации', text: 'Фреймер, useEffect, useMemo' },
    ],
    program: [
      { title: 'JSX и компоненты', description: 'Структура и синтаксис React.', duration: '1ч' },
      { title: 'Состояние и события', description: 'useState, useEffect и взаимодействие.', duration: '2ч' }
    ],
    reviews: [
      {
        name: 'Никита Иванов',
        role: 'Frontend Developer',
        text: 'Очень насыщенный курс! Особенно понравились примеры с Framer Motion.',
        rating: 5,
        avatar: '/avatars/nikita.jpg'
      }
    ],
    instructors: [
      {
        name: 'Анна Серова',
        position: 'Senior React-разработчик',
        bio: 'Опыт более 7 лет в разработке SPA.',
        photo: '/instructors/anna.jpg',
        social: [
          { icon: '🌐', url: 'https://annaserova.dev' }
        ]
      }
    ]
  },

  'ai-blackbox': {
    title: 'Основы машинного обучения',
    image: '/images/ml.jpg',
    excerpt: 'Разберитесь в линейной регрессии, деревьях решений и кластеризации.',
    description: 'Курс вводит в машинное обучение, методы обучения с учителем и без, метрики.',
    level: 'Средний',
    duration: '7 недель',
    price: '3 900 ₽',
    features: [
      { icon: '📊', title: 'Методы', text: 'KNN, Decision Trees, K-Means' },
      { icon: '📈', title: 'Метрики', text: 'MAE, RMSE, Accuracy, F1-score' },
      { icon: '💻', title: 'Практика', text: 'Задания на Python' },
    ],
    program: [
      { title: 'Введение в ML', description: 'Что такое машинное обучение.', duration: '1ч' },
      { title: 'Обучение с учителем', description: 'Линейная регрессия, деревья решений.', duration: '2ч' }
    ],
    reviews: [
      {
        name: 'Светлана Орлова',
        role: 'Data Scientist',
        text: 'Отличный старт для новичков в ML!',
        rating: 4,
        avatar: '/avatars/svetlana.jpg'
      }
    ],
    instructors: [
      {
        name: 'Роман Бритвин',
        position: 'ML-инженер',
        bio: 'Разрабатывает модели на Python, Kaggle Competitor.',
        photo: '/instructors/roman.jpg',
        social: [
          { icon: '📘', url: 'https://vk.com/mlroman' }
        ]
      }
    ]
  }
};
