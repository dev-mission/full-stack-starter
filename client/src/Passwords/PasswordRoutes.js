import { Navigate, Route, Routes } from 'react-router-dom';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function PasswordRoutes() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="forgot" replace />} />
      <Route path="forgot" element={<ForgotPassword />} />
      <Route path="reset/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default PasswordRoutes;
