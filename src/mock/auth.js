const mockUsers = [
  {
    id: 1,
    email: 'user@test.com',
    password: '123456',
    firstName: 'Иван',
    lastName: 'Иванов',
    username: 'ivan_ivanov',
    avatar: '',
    joinDate: '2024-01-15',
  },
];

export const registerUserMock = (userData) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const existingUser = mockUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        reject(new Error('Пользователь с таким email уже существует'));
        return;
      }

      const newUser = {
        id: mockUsers.length + 1,
        ...userData,
        username: `${userData.firstName}_${userData.lastName}`.toLowerCase(),
        avatar: '',
        joinDate: new Date().toISOString(),
      };
      mockUsers.push(newUser);

      resolve({
        access_token: `mock-token-${newUser.id}`,
        user: newUser,
      });
    }, 500)
  );

export const loginUserMock = (credentials) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        reject(new Error('Неверный email или пароль'));
        return;
      }

      resolve({
        access_token: `mock-token-${user.id}`,
        user,
      });
    }, 500)
  );

export const fetchUserProfileMock = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        resolve(null);
        return;
      }

      // Извлекаем ID из токена
      const userId = parseInt(token.split('-').pop());
      const user = mockUsers.find((u) => u.id === userId) || mockUsers[0];

      resolve({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        joinDate: user.joinDate,
        enrolledCourses: [1, 2],
        completedLessons: [1, 2, 3],
        streak: 7,
      });
    }, 300)
  );
