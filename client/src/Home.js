import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';
import TeamsList from './Teams/TeamsList';

function Home() {
  const { user, membership } = useAuthContext();

  if (membership) {
    return <Navigate to={`/teams/${membership.TeamId}`} />;
  } else if (user?.Memberships?.length === 1) {
    return <Navigate to={`/teams/${user.Memberships[0].TeamId}`} />;
  } else if (user) {
    return <TeamsList />;
  }
  return (
    <main className="container">
      <h1>Home</h1>
    </main>
  );
}

export default Home;
