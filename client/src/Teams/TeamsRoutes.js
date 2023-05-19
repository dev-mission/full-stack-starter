import { Route, Routes } from 'react-router-dom';

import Team from './Team';
import TeamsList from './TeamsList';

function TeamsRoutes() {
  return (
    <Routes>
      <Route path="new" element={<Team />} />
      <Route path="" element={<TeamsList />} />
    </Routes>
  );
}

export default TeamsRoutes;
