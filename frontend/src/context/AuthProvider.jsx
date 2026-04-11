import { useState, useEffect } from 'react';
import { profileAPI, logoutAPI } from '../api/auth.api';
import { AuthContext } from './AuthContext.jsx';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileAPI();

        if (data && data.id && data.email) {
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log('LoadProfile Error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const logout = async () => {
    try {
      await logoutAPI();
      setUser(null);
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
