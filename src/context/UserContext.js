import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Безопасный парсинг user из localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      // savedUser должен быть не пустым и не "undefined"
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Если есть токен и нет user в state, получаем профиль с сервера
    if (token && !user) {
      fetchUserProfile(token)
        .then(data => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(() => {
          // Токен невалидный или пользователь удалён — чистим всё
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, [user]); // если token изменится или user появится — перезапустит эффект

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
