import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';

import Api from './Api';

import './PhotoUploader.scss';

function PhotoUploader({ className, children, id, name, onChange, onUploading, value, valueUrl }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  function onDrop(acceptedFiles) {
    fileRef.current = null;
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
    if (acceptedFiles.length > 0) {
      setUploading(true);
      if (onUploading) {
        onUploading(true);
      }
      const file = acceptedFiles[0];
      fileRef.current = file;
      const blob = {
        filename: file.name,
        content_type: file.type || 'application/octet-stream',
        byte_size: file.size,
      };
      let signedId;
      Api.assets
        .create({ blob })
        .then((response) => {
          if (fileRef.current === file) {
            const { url, headers } = response.data.direct_upload;
            signedId = response.data.signed_id;
            return Api.assets.upload(url, headers, file);
          }
        })
        .then((response) => {
          if (fileRef.current === file) {
            setUploading(false);
            if (onUploading) {
              onUploading(false);
            }
            if (onChange) {
              onChange({ target: { name, value: signedId } });
            }
          }
        });
    }
  }

  function onRemove() {
    if (isUploading) {
      setUploading(false);
      if (onUploading) {
        onUploading(false);
      }
    }
    fileRef.current = null;
    setFiles([]);
    if (onChange) {
      onChange({ target: { name, value: '', valueUrl: '' } });
    }
  }

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <Dropzone id={id} multiple={false} onDrop={onDrop} disabled={(value && value !== '') || files.length > 0}>
      {({ getRootProps, getInputProps }) => (
        <div className={classNames('photouploader', className)}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files.length > 0 &&
              files.map((f) => (
                <div key={f.path} className={classNames('photouploader__preview', { 'photouploader__preview--uploading': isUploading })}>
                  <img src={f.preview} className="img-thumbnail" alt="" />
                  <button onClick={onRemove} className="btn btn-danger photouploader__remove" type="button">
                    &times;
                  </button>
                  <div className="spinner-border photouploader__spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ))}
            {files.length === 0 && value && (
              <div className={classNames('photouploader__preview')}>
                <img src={valueUrl} className="img-thumbnail" alt="" />
                <button onClick={onRemove} className="btn btn-danger photouploader__remove" type="button">
                  &times;
                </button>
              </div>
            )}
            {files.length === 0 && !value && children}
          </div>
        </div>
      )}
    </Dropzone>
  );
}
export default PhotoUploader;
