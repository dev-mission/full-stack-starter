import { useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import { useAuthContext } from '../AuthContext';
import Api from '../Api';
import ConfirmModal from '../Components/ConfirmModal';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';
import VariantTabs from '../Components/VariantTabs';
import FileInput from '../Components/FileInput';

const ACCEPTED_FILES = {
  AUDIO: {
    'audio/*': ['.mp3', '.mp4', '.m4a'],
  },
  IMAGE: {
    'image/*': ['.jpg', '.jpeg', '.png'],
  },
};
Object.freeze(ACCEPTED_FILES);

function ResourceForm({ ResourceId, type, onCancel, onCreate, onUpdate }) {
  const { membership } = useAuthContext();

  const [resource, setResource] = useState();
  const [variant, setVariant] = useState();
  const [isUploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [isConfirmDeleteShowing, setConfirmDeleteShowing] = useState(false);
  const [deleteError, setDeleteError] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (membership && !ResourceId) {
      setResource({
        TeamId: membership.TeamId,
        name: '',
        type,
        variants: [membership.Team.variants[0]],
        Files: [],
      });
      setVariant(membership.Team.variants[0]);
    }
    if (ResourceId) {
      Api.resources.get(ResourceId).then((response) => {
        if (isCancelled) return;
        setResource(response.data);
        setVariant(response.data.variants[0]);
      });
    }
    return () => (isCancelled = true);
  }, [membership, ResourceId, type]);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let response;
      if (ResourceId) {
        response = await Api.resources.update(ResourceId, resource);
        onUpdate(response.data);
      } else {
        response = await Api.resources.create(resource);
        onCreate(response.data);
      }
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    } finally {
      setLoading(false);
    }
  }

  let variantFile = resource?.Files?.find((f) => f.variant === variant?.code);
  if (!variantFile) {
    variantFile = { variant: variant?.code, externalURL: '', key: '' };
    resource?.Files?.push(variantFile);
    if (resource) {
      setResource({ ...resource });
    }
  }

  function onChange(event) {
    const newResource = { ...resource };
    const { name, value } = event.target;
    if (['externalURL', 'key', 'originalName', 'duration', 'width', 'height'].includes(name)) {
      variantFile[name] = value;
    } else {
      newResource[name] = value;
      if (name === 'type') {
        newResource.externalURL = null;
        newResource.key = null;
        newResource.originalName = null;
        newResource.duration = null;
        newResource.width = null;
        newResource.height = null;
      }
    }
    setResource(newResource);
  }

  async function onDelete() {
    setConfirmDeleteShowing(false);
    try {
      await Api.resources.delete(resource.id);
      onCancel?.();
    } catch (error) {
      setDeleteError(error);
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        {variant && resource && (
          <form onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading || isUploading}>
              <FormGroup name="name" label="Name" onChange={onChange} record={resource} error={error} />
              {!resource.id && (
                <FormGroup type="select" name="type" label="Type" onChange={onChange} record={resource} error={error}>
                  <option value="AUDIO">Audio</option>
                  <option value="AR_LINK">AR Link</option>
                  <option value="IMAGE">Image</option>
                </FormGroup>
              )}
              <VariantTabs variants={resource.variants} current={variant} setVariant={setVariant} />
              {resource.type === 'AR_LINK' && (
                <FormGroup
                  name="externalURL"
                  label="External URL"
                  onChange={onChange}
                  disabled={variantFile.key}
                  value={variantFile.externalURL}
                  error={error}
                />
              )}
              {resource.type !== 'AR_LINK' && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="key">
                    Upload File
                  </label>
                  <FileInput
                    id="key"
                    name="key"
                    accept={ACCEPTED_FILES[resource.type]}
                    value={variantFile.key}
                    valueURL={variantFile.keyURL}
                    onChange={onChange}
                    onChangeMetadata={onChange}
                    onUploading={setUploading}>
                    <div className="card-body">
                      <div className="card-text text-muted">Drag-and-drop a file here, or click here to browse and select a file.</div>
                    </div>
                  </FileInput>
                  {error?.errorMessagesHTMLFor?.('key')}
                </div>
              )}
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                  &nbsp;
                  <button onClick={onCancel} className="btn btn-secondary" type="button">
                    Cancel
                  </button>
                </div>
                <button onClick={() => setConfirmDeleteShowing(true)} className="btn btn-outline-danger" type="button">
                  Delete
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
      <div className="col-md-6">{JSON.stringify(resource)}</div>
      <ConfirmModal nested isShowing={isConfirmDeleteShowing} onCancel={() => setConfirmDeleteShowing(false)} onOK={() => onDelete()}>
        Are you sure you wish to delete <b>{resource?.name}</b>?
      </ConfirmModal>
      <ConfirmModal nested title="An error has occurred" isShowing={!!deleteError} onOK={() => setDeleteError()}>
        {deleteError?.response?.data?.message ?? 'An unexpected error has occurred, please try again later or contact support.'}
      </ConfirmModal>
    </div>
  );
}
export default ResourceForm;
