import React from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import AllCourses from './pages/AllCourses';
import { UserProvider } from './context/UserContext';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
  // Убираем useEffect с connectWebSocket, чтобы не было зависимости от Kafka

  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/:courseSlug" element={<CoursePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/courses" element={<AllCourses />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
