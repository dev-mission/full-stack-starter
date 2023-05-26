import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../AuthContext';

import Api from '../Api';

import TourCard from './TourCard';
import { useStaticContext } from '../StaticContext';

function ToursList() {
  const staticContext = useStaticContext();
  const { membership } = useAuthContext();

  const [tours, setTours] = useState();

  useEffect(() => {
    if (!membership) return;
    let isCancelled = false;
    Api.tours.index(membership.TeamId).then((response) => {
      if (isCancelled) return;
      setTours(response.data);
    });
    return () => (isCancelled = true);
  }, [membership]);

  return (
    <>
      <Helmet>
        <title>
          {membership?.Team?.name ?? ''} - {staticContext.env.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
      <main className="container">
        <h1 className="mb-5">{membership?.Team?.name}</h1>
        {!tours && <div className="spinner-border"></div>}
        {tours && (
          <div className="row">
            {tours.map((tour) => (
              <TourCard key={tour.id} title={tour.names[tour.variants[0].code]} href={tour.id} />
            ))}
            <TourCard title="New Tour" href="new" />
          </div>
        )}
      </main>
    </>
  );
}
export default ToursList;
