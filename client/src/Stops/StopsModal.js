import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import './StopsModal.scss';
import StopsList from './StopsList';
import StopForm from './StopForm';

function StopsModal({ isShowing, onHide, onSelect }) {
  const [isEditing, setEditing] = useState(false);
  const [StopId, setStopId] = useState();

  function onNewStop() {
    setStopId(undefined);
    setEditing(true);
  }

  function onCreate(stop) {
    setEditing(false);
    onSelect(stop);
  }

  function onUpdate(stop) {
    setEditing(false);
  }

  return (
    <Modal show={isShowing} onHide={onHide} size="xl" dialogClassName="resources-modal">
      <Modal.Header closeButton>
        <Modal.Title>Stops</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isEditing && <StopsList onNewStop={onNewStop} onSelect={onSelect} />}
        {isEditing && <StopForm StopId={StopId} onCancel={() => setEditing(false)} onCreate={onCreate} onUpdate={onUpdate} />}
      </Modal.Body>
    </Modal>
  );
}

export default StopsModal;
