import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import inflection from 'inflection';

import './StopsModal.scss';
import StopsList from './StopsList';
import StopForm from './StopForm';

function StopsModal({ type, isShowing, onHide, onSelect, startingAddress }) {
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
        <Modal.Title>{inflection.transform(type, ['pluralize', 'capitalize'])}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isEditing && <StopsList type={type} onNewStop={onNewStop} onSelect={onSelect} />}
        {isEditing && (
          <StopForm
            type={type}
            StopId={StopId}
            onCancel={() => setEditing(false)}
            onCreate={onCreate}
            onUpdate={onUpdate}
            startingAddress={startingAddress}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default StopsModal;
