import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Otherwise allow to view the page
  return children;
}
