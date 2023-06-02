import { useParams } from 'react-router-dom';

import Stop from '../Stops/Stop';

function TourIntro() {
  const { StopId } = useParams();

  return <Stop stopId={StopId} />;
}

export default TourIntro;
