import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Api from '../Api';
import StopForm from '../Stops/StopForm';

function TourStopForm() {
  const navigate = useNavigate();
  const { TourId, TourStopId } = useParams();
  const [stopId, setStopId] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (TourId && TourStopId) {
      Api.tours
        .stops(TourId)
        .get(TourStopId)
        .then((response) => {
          if (isCancelled) return;
          setStopId(response.data.StopId);
        });
    }
    return () => (isCancelled = true);
  }, [TourId, TourStopId]);

  function onCancel() {
    navigate(-1);
  }

  function onUpdate() {
    navigate(-1);
  }

  return (
    <>
      <main className="container">
        <h1 className="mb-3">Edit Stop</h1>
        {!stopId && <div className="spinner-border"></div>}
        {!!stopId && <StopForm StopId={stopId} onCancel={onCancel} onUpdate={onUpdate} />}
      </main>
    </>
  );
}
export default TourStopForm;
