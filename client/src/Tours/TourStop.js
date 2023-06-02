import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Api from '../Api';
import Stop from '../Stops/Stop';

function TourStop() {
  const { TourId, TourStopId } = useParams();
  const [stopId, setStopId] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.tours
      .stops(TourId)
      .get(TourStopId)
      .then((response) => {
        if (isCancelled) return;
        setStopId(response.data.StopId);
      });
    return () => (isCancelled = true);
  }, [TourId, TourStopId]);

  return <Stop stopId={stopId} />;
}

export default TourStop;
