import React from 'react';
import classNames from 'classnames';

import DropzoneUploader from './DropzoneUploader';
import './PhotoInput.scss';

function PhotoInput({ className, children, id, name, onChange, onUploading, value, valueUrl }) {
  function onRemoved() {
    if (onChange) {
      onChange({ target: { name, value: '' } });
    }
  }

  function onUploaded(status) {
    if (onChange) {
      onChange({ target: { name, value: status.signedId } });
    }
  }

  return (
    <DropzoneUploader
      id={id}
      className={classNames('photo-input', className)}
      multiple={false}
      disabled={value && value !== ''}
      onRemoved={onRemoved}
      onUploaded={onUploaded}>
      {(statuses, onRemove) => {
        if (statuses.length > 0) {
          return statuses.map((s) => (
            <div
              key={s.id}
              className={classNames('photo-input__preview', {
                'photo-input__preview--uploading': s.status === 'pending' || s.status === 'uploading',
              })}>
              <img src={s.file.preview} className="img-thumbnail" alt="" />
              <button onClick={() => onRemove(s)} className="btn btn-danger photo-input__remove" type="button">
                &times;
              </button>
              <div className="spinner-border photo-input__spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ));
        } else if (statuses.length === 0 && value) {
          return (
            <div className={classNames('photo-input__preview')}>
              <img src={valueUrl} className="img-thumbnail" alt="" />
              <button onClick={onRemoved} className="btn btn-danger photo-input__remove" type="button">
                &times;
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
export default PhotoInput;
