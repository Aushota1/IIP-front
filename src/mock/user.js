const userProfileData = {
  id: 1,
  username: 'dev_user',
  email: 'user@example.com',
  avatar: '',
  enrolledCourses: [1, 3],
  completedLessons: [1, 2],
  streak: 5,
};

export const getUserProfileMock = () =>
  new Promise((resolve) => setTimeout(() => resolve(userProfileData), 300));
