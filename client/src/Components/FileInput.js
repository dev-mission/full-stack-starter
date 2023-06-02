import React from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import mime from 'mime/lite';

import AudioPlayer from './AudioPlayer';
import DropzoneUploader from './DropzoneUploader';
import './FileInput.scss';

function FileInput({ accept, className, children, id, name, onChange, onChangeMetadata, value, valueURL }) {
  function onUploaded(status) {
    onChange?.({ target: { name, value: status.signedId } });
    onChangeMetadata?.({ target: { name: 'originalName', value: status.file.name } });
  }

  function onRemoved() {
    onChange?.({ target: { name, value: null } });
    onChangeMetadata?.({ target: { name: 'originalName', value: null } });
    onChangeMetadata?.({ target: { name: 'duration', value: null } });
    onChangeMetadata?.({ target: { name: 'width', value: null } });
    onChangeMetadata?.({ target: { name: 'height', value: null } });
  }

  function onAudioDurationChange(newDuration) {
    onChangeMetadata?.({ target: { name: 'duration', value: newDuration } });
  }

  function onImageLoad(event) {
    const { target: img } = event;
    onChangeMetadata?.({ target: { name: 'width', value: img.naturalWidth } });
    onChangeMetadata?.({ target: { name: 'height', value: img.naturalHeight } });
  }

  let valueContentType;
  if (value) {
    valueContentType = mime.getType(value);
  }

  return (
    <DropzoneUploader
      id={id}
      className={classNames('file-input', className)}
      accept={accept}
      multiple={false}
      disabled={value && value !== ''}
      onRemoved={onRemoved}
      onUploaded={onUploaded}>
      {({ statuses, onRemove }) => {
        if (statuses.length > 0) {
          return statuses.map((s) => (
            <div key={s.id} className="file-input__file">
              {s.file.type.startsWith('audio/') && (
                <AudioPlayer className="me-3 my-1 flex-grow-1" src={s.file.preview} onDurationChange={onAudioDurationChange} />
              )}
              {s.file.type.startsWith('image/') && (
                <img className="img-fluid me-3 my-1 file-input__image" alt={s.file.name} src={s.file.preview} onLoad={onImageLoad} />
              )}
              {(s.status === 'pending' || s.status === 'uploading') && (
                <div className="spinner-border file-input__spinner" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
              {!(s.status === 'pending' || s.status === 'uploading') && (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemove(s)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              )}
            </div>
          ));
        } else if (statuses.length === 0 && value) {
          return (
            <div className="file-input__file">
              {valueContentType.startsWith('audio/') && <AudioPlayer className="me-3 my-1 flex-grow-1" src={valueURL} />}
              {valueContentType.startsWith('image/') && (
                <img className="img-fluid me-3 my-1 file-input__image" alt={value} src={valueURL} />
              )}
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemoved()}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          );
        } else if (statuses.length === 0 && !value && children) {
          return children;
        }
      }}
    </DropzoneUploader>
  );
}
export default FileInput;
