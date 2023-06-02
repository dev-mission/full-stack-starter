import { useNavigate, useParams } from 'react-router-dom';

import StopForm from '../Stops/StopForm';

function TourIntroForm() {
  const navigate = useNavigate();
  const { StopId } = useParams();

  function onCancel() {
    navigate(-1);
  }

  function onUpdate() {
    navigate(-1);
  }

  return (
    <>
      <main className="container">
        <h1 className="mb-3">Edit Intro</h1>
        {!StopId && <div className="spinner-border"></div>}
        {!!StopId && <StopForm StopId={StopId} onCancel={onCancel} onUpdate={onUpdate} />}
      </main>
    </>
  );
}
export default TourIntroForm;
