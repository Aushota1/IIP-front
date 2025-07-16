import React, { useEffect } from 'react';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CoursePage from './pages/CoursePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserProfile from './pages/UserProfile';
import AllCourses from './pages/AllCourses';
import { UserProvider } from './context/UserContext';
import { connectWebSocket } from './ws';

function App() {
  useEffect(() => {
    connectWebSocket((event) => {
      // Здесь можно обрабатывать любые сообщения от Kafka через WebSocket
      console.log("📨 Kafka Event:", event);
      if (event.event === "user_registered") {
        alert(`🎉 Новый пользователь: ${event.name} (${event.email})`);
      }
    });
  }, []);

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
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
