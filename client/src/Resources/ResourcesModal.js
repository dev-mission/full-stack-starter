import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import './ResourcesModal.scss';
import ResourcesList from './ResourcesList';
import ResourceForm from './ResourceForm';

function ResourcesModal({ isShowing, onHide, onSelect }) {
  const [isEditing, setEditing] = useState(false);
  const [ResourceId, setResourceId] = useState();
  const [type, setType] = useState();

  function onNewAsset(newType) {
    setResourceId(undefined);
    setType(newType);
    setEditing(true);
  }

  function onCreate(resource) {
    setEditing(false);
    onSelect(resource);
  }

  function onUpdate(resource) {
    setEditing(false);
  }

  return (
    <Modal show={isShowing} onHide={onHide} size="xl" dialogClassName="resources-modal">
      <Modal.Header closeButton>
        <Modal.Title>Assets</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!isEditing && <ResourcesList onNewAsset={onNewAsset} onSelect={onSelect} />}
        {isEditing && (
          <ResourceForm ResourceId={ResourceId} type={type} onCancel={() => setEditing(false)} onCreate={onCreate} onUpdate={onUpdate} />
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ResourcesModal;
