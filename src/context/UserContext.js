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
    if (token) {
      fetchUserProfile(token)
        .then(data => {
          console.log('[UserContext] profile from server:', data);
          console.log('[UserContext] role:', data?.role);
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        });
    }
  }, []); // только при монтировании — всегда свежие данные с сервера

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
