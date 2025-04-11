import { Navigate } from 'react-router-dom';
import { useAuth } from './Context/AuthContext';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
