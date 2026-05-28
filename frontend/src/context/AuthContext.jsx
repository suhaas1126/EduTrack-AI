import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);
const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api')
).replace(/\/$/, '');

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Backend connection failed. Attempting mock recovery for demo purposes.');
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(atob(parts[1]));
            setUser({
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
            });
            setIsAuthenticated(true);
          }
        } catch (e) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.warn('API down, executing local dashboard demo credentials fallback.');
      
      const lower = email.toLowerCase();
      if (password === 'password123' && (lower === 'admin@studentsphere.com' || lower === 'teacher@studentsphere.com' || lower === 'student@studentsphere.com')) {
        const mockRoles = {
          'admin@studentsphere.com': 'admin',
          'teacher@studentsphere.com': 'teacher',
          'student@studentsphere.com': 'student',
        };
        const mockNames = {
          'admin@studentsphere.com': 'Global Administrator',
          'teacher@studentsphere.com': 'Professor Katherine',
          'student@studentsphere.com': 'Alexander Wright',
        };

        const mockUser = {
          id: 'mock_user_' + mockRoles[lower],
          name: mockNames[lower],
          email: lower,
          role: mockRoles[lower],
        };

        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify(mockUser));
        const dummyToken = `${header}.${payload}.signature`;

        localStorage.setItem('token', dummyToken);
        setToken(dummyToken);
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      }

      return {
        success: false,
        message: 'Could not connect to database and credentials do not match our sandbox accounts.'
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return {
        success: false,
        message: 'System initialization error. Please run the backend API service first!'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, apiBase: API_BASE }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
