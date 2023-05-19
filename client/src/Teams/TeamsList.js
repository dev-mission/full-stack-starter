import { useEffect } from 'react';
import { useAuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function TeamsList() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.Memberships?.length === 0) {
    }
  }, [user]);

  return <main className="container"></main>;
}
export default TeamsList;
