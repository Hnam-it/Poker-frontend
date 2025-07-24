import { Navigate } from 'react-router-dom';

function ProtectedRoute({ requiredRole, children }) {
  // Kiểm tra user từ localStorage thay vì props
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && storedUser.role !== requiredRole) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
}

export default ProtectedRoute;