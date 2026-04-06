import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import AllCourses from './pages/AllCourses';
import VerifyEmailPage from './pages/VerifyEmailPage';

import TasksList from './pages/TasksList';
import TaskDetail from './pages/TaskDetail';
import AdminPanel from './pages/AdminPanel';
import LessonPage from './pages/LessonPage';
import ProtectedRoute from './components/ProtectedRoute';

import { UserProvider } from './context/UserContext';
import { NotificationProvider } from './components/NotificationContainer';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/courses/:courseSlug" element={<CoursePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/courses" element={<AllCourses />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />

            {/* Страницы задач */}
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/:taskId" element={<TaskDetail />} />

            {/* Страница урока */}
            <Route path="/course-content/:courseId" element={<LessonPage />} />

            {/* Админ-панель */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
