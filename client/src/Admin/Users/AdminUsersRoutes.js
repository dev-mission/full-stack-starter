import { Routes, Route } from 'react-router-dom';

import AdminUserInvite from './AdminUserInvite';
import AdminUsersList from './AdminUsersList';
import UserForm from '../../Users/UserForm';

function AdminUsersRoutes() {
  return (
    <Routes>
      <Route path="invite" element={<AdminUserInvite />} />
      <Route path=":userId" element={<UserForm />} />
      <Route path="" element={<AdminUsersList />} />
    </Routes>
  );
}

export default AdminUsersRoutes;
