import { Route, Routes } from 'react-router-dom';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function PasswordsRoutes() {
  return (
    <Routes>
      <Route path="forgot" element={<ForgotPassword />} />
      <Route path="reset/:token" element={<ResetPassword />} />
    </Routes>
  );
}

export default PasswordsRoutes;
