import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';

import { useAuthContext } from './AuthContext';
import { useStaticContext } from './StaticContext';
import TeamsList from './Teams/TeamsList';

function Home() {
  const { user, membership } = useAuthContext();
  const staticContext = useStaticContext();

  if (membership) {
    return <Navigate to={`/teams/${membership.TeamId}`} />;
  } else if (user?.Memberships?.length === 1) {
    return <Navigate to={`/teams/${user.Memberships[0].TeamId}`} />;
  } else if (user) {
    return <TeamsList />;
  }

  return (
    <>
      <Helmet>
        <title>Home - {staticContext.env.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="container">
        <h1>Home</h1>
      </main>
    </>
  );
}

export default Home;
