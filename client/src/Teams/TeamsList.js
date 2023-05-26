import { useEffect } from 'react';
import { useAuthContext } from '../AuthContext';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useStaticContext } from '../StaticContext';

function TeamsList() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const staticContext = useStaticContext();

  useEffect(() => {
    if (user.Memberships?.length === 0) {
      navigate('/teams/new');
    } else if (user.Memberships?.length === 1) {
      // navigate(`/teams/${user.Memberships[0].TeamId}`)
    }
  }, [user, navigate]);

  return (
    <>
      <Helmet>
        <title>My Teams - {staticContext.env.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="container">
        <div className="row justify-content-center">
          <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
            <h1 className="mb-3">My Teams</h1>
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
    </>
  );
}
export default TeamsList;
