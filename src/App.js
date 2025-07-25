import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import AllCourses from './pages/AllCourses';
import VerifyEmailPage from './pages/VerifyEmailPage';

import TasksList from './pages/TasksList';       // имя компонента во множественном числе
import TaskDetail from './pages/TaskDetail';     // компонент для детальной страницы задачи

import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Если хочешь, чтобы / сразу вело на задачи, оставь это */}
          <Route path="/" element={<Home />} />

          {/* Или, если нужна главная страница Home, замени строку выше на эту */}
          {/* <Route path="/" element={<Home />} /> */}

          <Route path="/courses/:courseSlug" element={<CoursePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Страницы задач */}
          <Route path="/tasks" element={<TasksList />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;






