// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Гамбургер-кнопка */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Боковая панель */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <Link to="/" onClick={() => setIsOpen(false)}>🏠 Главная</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>👤 Профиль</Link>
          <Link to="/courses" onClick={() => setIsOpen(false)}>📚 Курсы</Link>
          <Link to="/tasks" onClick={() => setIsOpen(false)}>📝 Задачи</Link>

          <button onClick={handleLogout}>🚪 Выход</button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
