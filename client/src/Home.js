import { Helmet } from 'react-helmet-async';
import { useStaticContext } from './StaticContext';

function Home() {
  const staticContext = useStaticContext();
  return (
    <>
      <Helmet>
        <title>Home - {staticContext?.env?.REACT_APP_SITE_TITLE}</title>
      </Helmet>
      <main className="container">
        <h1>Home</h1>
      </main>
    </>
  );
}

export default Home;
