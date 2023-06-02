import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import mime from 'mime/lite';

import Api from '../Api';

import './FileUploader.scss';

function FileUploader({ className, children, id, name, onChange, onUploading, value }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function onDrop(acceptedFiles) {
    fileRef.current = null;
    setFiles(acceptedFiles);
    if (acceptedFiles.length === 0) {
      return;
    }
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
    const response = await Api.assets.create({ blob });
    if (fileRef.current !== file) {
      return;
    }
    const { url, headers } = response.data.direct_upload;
    signedId = response.data.signed_id;
    await Api.assets.upload(url, headers, file);
    if (fileRef.current !== file) {
      return;
    }
    setUploading(false);
    if (onUploading) {
      onUploading(false);
    }
    if (onChange) {
      onChange({ target: { name, value: signedId } });
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
      onChange({ target: { name, value: '' } });
    }
  }

  let valueContentType;
  if (value) {
    valueContentType = mime.getType(value);
  }

  return (
    <Dropzone id={id} multiple={false} onDrop={onDrop} disabled={(value && value !== '') || files.length > 0}>
      {({ getRootProps, getInputProps }) => (
        <div className={classNames('fileuploader', { 'fileuploader--uploading': isUploading }, className)}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {files.length > 0 &&
              files.map((f) => (
                <div key={f.name} className="fileuploader__file">
                  <button className="bg-transparent border-0" onClick={() => onRemove()}>
                    &times;
                  </button>
                  &nbsp;{f.name}
                  {isUploading && (
                    <div className="spinner-border fileuploader__spinner" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </div>
              ))}
            {files.length === 0 && value && (
              <div className="fileuploader__file">
                <button className="bg-transparent border-0" onClick={() => onRemove()}>
                  &times;
                </button>
                &nbsp;
                {valueContentType === 'application/pdf' && 'PDF Document'}
                {valueContentType.startsWith('image/') && `${valueContentType.substring(6).toUpperCase()} Image`}
                {isUploading && (
                  <div className="spinner-border fileuploader__spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            )}
            {files.length === 0 && !value && children}
          </div>
        </div>
      )}
    </Dropzone>
  );
}
export default FileUploader;
