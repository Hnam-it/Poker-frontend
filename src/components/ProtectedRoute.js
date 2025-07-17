import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    // Nếu chưa login thì redirect về login
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    // Nếu role không đủ thì redirect về trang khác hoặc lỗi
    return <Navigate to="/profile" replace />;
  }
  return children;
}

export default ProtectedRoute;
