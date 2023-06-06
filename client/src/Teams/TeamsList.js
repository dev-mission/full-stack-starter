import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { useAuthContext } from '../AuthContext';
import { useStaticContext } from '../StaticContext';

function TeamsList() {
  const navigate = useNavigate();
  const { user, membership } = useAuthContext();
  const staticContext = useStaticContext();

  useEffect(() => {
    if (user.Memberships?.length === 0) {
      navigate('/teams/new');
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
                <div key={m.TeamId} className="list-group-item d-flex justify-content-between">
                  {m.Team.name}
                  <span>
                    {m.TeamId !== membership?.TeamId && (
                      <Link to={m.TeamId} className="btn btn-sm btn-primary me-2">
                        Switch
                      </Link>
                    )}
                    {m.role !== 'VIEWER' && (
                      <Link to={`${m.TeamId}/manage`} className="btn btn-sm btn-secondary">
                        Manage
                      </Link>
                    )}
                  </span>
                </div>
              ))}
              <Link to="new" className="list-group-item">
                <FontAwesomeIcon icon={faPlus} /> New Team
              </Link>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
export default TeamsList;
