import { Navigate, Route, Routes } from 'react-router-dom';

import TeamForm from './TeamForm';
import TeamsList from './TeamsList';
import ToursRoutes from '../Tours/ToursRoutes';

function TeamsRoutes() {
  return (
    <Routes>
      <Route path="new" element={<TeamForm />} />
      <Route path=":TeamId/tours/*" element={<ToursRoutes />} />
      <Route path=":TeamId" element={<Navigate to="tours" />} />
      <Route path="" element={<TeamsList />} />
    </Routes>
  );
}

export default TeamsRoutes;
