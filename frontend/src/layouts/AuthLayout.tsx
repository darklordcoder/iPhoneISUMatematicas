import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { encryptionService } from '../services/encryptionService';

export const AuthLayout = () => {
  const tokenData = encryptionService.getDecryptedToken();
  const location = useLocation();

  if (!tokenData?.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}; 