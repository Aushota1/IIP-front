import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const DebugPanel = () => {
  const { user } = useUser();
  const [token, setToken] = useState(null);
  const [rawUser, setRawUser] = useState(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRawUser(localStorage.getItem('user'));
  }, [user]);

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
      background: '#1e1e2e', border: '1px solid #7b61ff',
      borderRadius: 12, padding: open ? 16 : 8,
      maxWidth: 380, fontSize: 12, fontFamily: 'monospace',
      color: '#e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: open ? 12 : 0 }}>
        <span style={{ color: '#7b61ff', fontWeight: 700 }}>🔍 DEBUG</span>
        <button onClick={() => setOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#a0a0bb', cursor: 'pointer', fontSize: 14 }}>
          {open ? '▼' : '▲'}
        </button>
      </div>

      {open && (
        <>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#ffbd2e' }}>token:</span>{' '}
            <span style={{ color: token ? '#27c93f' : '#ff5f56' }}>
              {token ? token.slice(0, 30) + '...' : 'НЕТ'}
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#ffbd2e' }}>user (context):</span>{' '}
            <span style={{ color: user ? '#27c93f' : '#ff5f56' }}>
              {user ? 'есть' : 'НЕТ'}
            </span>
          </div>

          {user && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: '#ffbd2e' }}>role:</span>{' '}
              <span style={{ color: user.role === 'admin' ? '#27c93f' : '#ff5f56', fontWeight: 700 }}>
                {user.role ?? 'undefined'}
              </span>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#ffbd2e' }}>localStorage user:</span>
            <pre style={{
              background: '#0a0a0a', borderRadius: 6, padding: 8,
              marginTop: 4, maxHeight: 150, overflow: 'auto',
              color: '#c0c0e0', fontSize: 11
            }}>
              {rawUser ? JSON.stringify(JSON.parse(rawUser), null, 2) : 'null'}
            </pre>
          </div>

          <div style={{ color: user?.role === 'admin' ? '#27c93f' : '#ff5f56', fontWeight: 700, marginTop: 8 }}>
            {user?.role === 'admin' ? '✅ Доступ к /admin открыт' : '❌ Нет доступа к /admin'}
          </div>
        </>
      )}
    </div>
  );
};

export default DebugPanel;
