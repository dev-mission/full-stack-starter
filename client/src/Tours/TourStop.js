import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Api from '../Api';
import Stop from '../Stops/Stop';
import StopsModal from '../Stops/StopsModal';
import StopsTable from '../Stops/StopsTable';

function TourStop() {
  const { TourId, TourStopId } = useParams();
  const navigate = useNavigate();
  const [TourStop, setTourStop] = useState();
  const [isShowingStopsModal, setShowingStopsModal] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    Api.tours
      .stops(TourId)
      .get(TourStopId)
      .then((response) => {
        if (isCancelled) return;
        setTourStop(response.data);
      });
    return () => (isCancelled = true);
  }, [TourId, TourStopId]);

  async function onSelectTransition(stop) {
    setShowingStopsModal(false);
    const newTourStop = { ...TourStop };
    newTourStop.TransitionStopId = stop.id;
    newTourStop.TransitionStop = stop;
    setTourStop(newTourStop);
    await Api.tours.stops(TourId).update(TourStopId, { TransitionStopId: stop.id });
  }

  function onClickTransition(type, stop) {
    navigate(`transitions/${stop.id}`);
  }

  async function onRemoveTransition(stop) {
    const newTourStop = { ...TourStop };
    newTourStop.TransitionStopId = null;
    delete newTourStop.TransitionStop;
    setTourStop(newTourStop);
    await Api.tours.stops(TourId).update(TourStopId, { TransitionStopId: null });
  }

  return (
    <>
      <Stop StopId={TourStop?.StopId} transition={TourStop?.TransitionStop}>
        <h2>Transition</h2>
        <StopsTable
          type="TRANSITION"
          stops={TourStop?.TransitionStop ? [{ id: TourStop.TransitionStopId, Stop: TourStop.TransitionStop }] : []}
          onClick={onClickTransition}
          onRemove={onRemoveTransition}
        />
        <div className="mb-5">
          <button
            onClick={() => {
              setShowingStopsModal(true);
            }}
            type="button"
            className="btn btn-primary">
            Set Transition
          </button>
        </div>
      </Stop>
      <StopsModal
        type="TRANSITION"
        isShowing={isShowingStopsModal}
        onHide={() => setShowingStopsModal(false)}
        onSelect={onSelectTransition}
        startingAddress={TourStop?.Stop?.address}
      />
    </>
  );
}

export default TourStop;
