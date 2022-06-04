import { Route, Routes } from 'react-router-dom';

import UserForm from './UserForm';

function UserRoutes() {
  return (
    <Routes>
      <Route path="" element={<UserForm />} />
    </Routes>
  );
}

export default UserRoutes;
