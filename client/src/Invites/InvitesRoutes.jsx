import { Route, Routes } from 'react-router-dom';

import Invite from './Invite';

function InvitesRoutes() {
  return (
    <Routes>
      <Route path=":inviteId" element={<Invite />} />
    </Routes>
  );
}

export default InvitesRoutes;
