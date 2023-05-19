import { useEffect } from 'react';
import { useAuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function ToursList() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.Memberships?.length === 0) {
      navigate('/teams/new');
    }
  }, [user, navigate]);

  return (
    <main className="container">
      <h1>Tours</h1>
    </main>
  );
}
export default ToursList;
