import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('pmd_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // 1. Check local users first (for custom signed up users)
    const localUsersStr = localStorage.getItem('pmd_users');
    if (localUsersStr) {
      const localUsers = JSON.parse(localUsersStr);
      const customUser = localUsers.find(u => u.username === username && u.password === password);
      if (customUser) {
        const loggedUser = { ...customUser, token: 'fake-jwt-token-local' };
        setUser(loggedUser);
        localStorage.setItem('pmd_user', JSON.stringify(loggedUser));
        return { success: true, role: loggedUser.role };
      }
    }

    // 2. Fallback to dummyjson API
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', {
        username,
        password,
        expiresInMins: 60,
      });
      const data = response.data;
      
      const userData = { ...data };
      if (!userData.role) {
        // Hardcode dummyjson users to roles if missing
        userData.role = username === 'emilys' ? 'admin' : 'user';
      }

      setUser(userData);
      localStorage.setItem('pmd_user', JSON.stringify(userData));
      return { success: true, role: userData.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = (userData) => {
    // Simulated signup saving to localStorage
    const localUsersStr = localStorage.getItem('pmd_users');
    let localUsers = localUsersStr ? JSON.parse(localUsersStr) : [];
    
    // Check if user exists
    if (localUsers.some(u => u.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
    };
    
    localUsers.push(newUser);
    localStorage.setItem('pmd_users', JSON.stringify(localUsers));
    
    // Auto login
    const loggedUser = { ...newUser, token: 'fake-jwt-token-local' };
    setUser(loggedUser);
    localStorage.setItem('pmd_user', JSON.stringify(loggedUser));
    
    return { success: true, role: newUser.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pmd_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
