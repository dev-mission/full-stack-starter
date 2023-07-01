import { Navigate, Routes, Route } from 'react-router-dom';

import AdminUsersRoutes from './Users/AdminUsersRoutes';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="users/*" element={<AdminUsersRoutes />} />
      <Route path="" element={<Navigate to="users" />} />
    </Routes>
  );
}

export default AdminRoutes;
