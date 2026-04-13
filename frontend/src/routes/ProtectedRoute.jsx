import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <h3>please login for your task</h3>;
  return user ? children : <Navigate to="/login" />;
}
