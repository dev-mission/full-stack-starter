import { useEffect } from 'react';
import { useAuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function TeamsList() {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user.Memberships?.length === 0) {
      navigate('/teams/new');
    } else if (user.Memberships?.length === 1) {
      // navigate(`/teams/${user.Memberships[0].TeamId}`)
    }
  }, [user, navigate]);

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <ul className="list-group">
            {user.Memberships?.map((m) => (
              <Link key={m.TeamId} to={`/teams/${m.TeamId}`} className="list-group-item">
                {m.Team.name}
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
export default TeamsList;
