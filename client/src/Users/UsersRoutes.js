import { Route, Routes } from 'react-router-dom';

import UserForm from './UserForm';

function UsersRoutes() {
  return (
    <Routes>
      <Route path="" element={<UserForm />} />
    </Routes>
  );
}

export default UsersRoutes;
