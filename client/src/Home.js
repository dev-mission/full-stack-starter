import { useAuthContext } from './AuthContext';
import ToursList from './Tours/ToursList';

function Home() {
  const { user } = useAuthContext();

  return user ? (
    <ToursList />
  ) : (
    <main className="container">
      <h1>Home</h1>
    </main>
  );
}

export default Home;
