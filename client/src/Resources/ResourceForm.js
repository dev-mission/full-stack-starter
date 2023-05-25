import { useEffect, useState } from 'react';
import { StatusCodes } from 'http-status-codes';

import { useAuthContext } from '../AuthContext';
import Api from '../Api';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';
import VariantTabs from '../Components/VariantTabs';
import PhotoInput from '../Components/PhotoInput';

function ResourceForm({ ResourceId, type, onCancel, onCreate, onUpdate }) {
  const { membership } = useAuthContext();

  const [resource, setResource] = useState();
  const [variant, setVariant] = useState();
  const [isUploading, setUploading] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

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

  function variantFile() {
    let file = resource?.Files?.find((f) => f.variant === variant?.code);
    if (!file) {
      file = { variant: variant?.code, externalURL: '', key: '' };
      resource?.Files?.push(file);
      if (resource) {
        setResource({ ...resource });
      }
    }
    return file;
  }

  function onChange(event) {
    const newResource = { ...resource };
    const { name, value } = event.target;
    if (name === 'externalURL' || name === 'key') {
      variantFile()[name] = value;
    } else {
      newResource[name] = value;
    }
    setResource(newResource);
  }

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

  return (
    <div className="row">
      <div className="col-md-6">
        {variant && resource && (
          <form onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading || isUploading}>
              <FormGroup name="name" label="Name" onChange={onChange} record={resource} error={error} />
              <FormGroup type="select" name="type" label="Type" onChange={onChange} record={resource} error={error}>
                <option value="AUDIO">Audio</option>
                <option value="AR_LINK">AR Link</option>
                <option value="IMAGE">Image</option>
              </FormGroup>
              <VariantTabs variants={resource.variants} current={variant} setVariant={setVariant} />
              <FormGroup
                name="externalURL"
                label="External URL"
                onChange={onChange}
                disabled={variantFile().key}
                value={variantFile().externalURL}
                error={error}
              />
              {type === 'IMAGE' && (
                <div className="mb-3">
                  <label className="form-label" htmlFor="key">
                    Upload File
                  </label>
                  <PhotoInput
                    className="card"
                    disabled={variantFile().externalURL}
                    id="key"
                    name="key"
                    value={resource.key}
                    valueUrl={resource.keyURL}
                    onChange={onChange}
                    onUploading={setUploading}>
                    <div className="card-body">
                      <div className="card-text">Drag-and-drop a photo file here, or click here to browse and select a file.</div>
                    </div>
                  </PhotoInput>
                  {error?.errorMessagesHTMLFor?.('key')}
                </div>
              )}
              <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
                &nbsp;
                <button onClick={onCancel} className="btn btn-secondary" type="button">
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
      <div className="col-md-6">{JSON.stringify(resource)}</div>
    </div>
  );
}
export default ResourceForm;
