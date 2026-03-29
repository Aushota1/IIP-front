import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <Link to="/" onClick={() => setIsOpen(false)}>🏠 Главная</Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>👤 Профиль</Link>
          <Link to="/courses" onClick={() => setIsOpen(false)}>📚 Курсы</Link>
          <Link to="/tasks" onClick={() => setIsOpen(false)}>📝 Задачи</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" onClick={() => setIsOpen(false)}>⚙️ Админ-панель</Link>
          )}
          <button onClick={handleLogout}>🚪 Выход</button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
