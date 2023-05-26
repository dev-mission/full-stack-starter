import { useEffect } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '../AuthContext';

import Tour from './Tour';
import TourForm from './TourForm';
import TourStop from './TourStop';
import ToursList from './ToursList';
import TourStopForm from './TourStopForm';

function ToursRoutes() {
  const navigate = useNavigate();
  const { TeamId } = useParams();
  const { user, setMembership } = useAuthContext();

  useEffect(() => {
    if (user) {
      const membership = user.Memberships.find((m) => m.TeamId === TeamId);
      if (membership) {
        setMembership(membership);
      } else {
        navigate('/');
      }
    }
  }, [TeamId, user, setMembership, navigate]);

  return (
    <Routes>
      <Route path="new" element={<TourForm />} />
      <Route path=":TourId/stops/:TourStopId/edit" element={<TourStopForm />} />
      <Route path=":TourId/stops/:TourStopId" element={<TourStop />} />
      <Route path=":TourId/edit" element={<TourForm />} />
      <Route path=":TourId" element={<Tour />} />
      <Route path="" element={<ToursList />} />
    </Routes>
  );
}

export default ToursRoutes;
