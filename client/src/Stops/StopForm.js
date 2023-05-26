import { useEffect, useState } from 'react';
import { pluralize } from 'inflection';
import { StatusCodes } from 'http-status-codes';

import { useAuthContext } from '../AuthContext';
import Api from '../Api';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';
import VariantTabs from '../Components/VariantTabs';

function StopForm({ StopId, onCancel, onCreate, onUpdate }) {
  const { membership } = useAuthContext();

  const [stop, setStop] = useState();
  const [variant, setVariant] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;
    if (membership && !StopId) {
      setStop({
        TeamId: membership.TeamId,
        link: '',
        address: '',
        names: { [membership.Team.variants[0].code]: '' },
        descriptions: { [membership.Team.variants[0].code]: '' },
        variants: [membership.Team.variants[0]],
      });
      setVariant(membership.Team.variants[0]);
    }
    if (StopId) {
      Api.stops.get(StopId).then((response) => {
        if (isCancelled) return;
        setStop(response.data);
        setVariant(response.data.variants[0]);
      });
    }
    return () => (isCancelled = true);
  }, [membership, StopId]);

  function onChange(event) {
    const newStop = { ...stop };
    const { name, value } = event.target;
    if (name === 'name' || name === 'description') {
      newStop[pluralize(name)][variant?.code] = value;
    } else {
      newStop[name] = value;
    }
    setStop(newStop);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let response;
      if (StopId) {
        response = await Api.stops.update(StopId, stop);
        onUpdate(response.data);
      } else {
        response = await Api.stops.create(stop);
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
        {variant && stop && (
          <form autoComplete="off" onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading}>
              <FormGroup name="link" label="Link" onChange={onChange} record={stop} error={error} />
              <FormGroup name="address" label="Address" onChange={onChange} record={stop} error={error} />
              <VariantTabs variants={stop.variants} current={variant} setVariant={setVariant} />
              <FormGroup name="name" label="Name" onChange={onChange} value={stop.names[variant?.code]} error={error} />
              <FormGroup
                type="textarea"
                name="description"
                label="Description"
                onChange={onChange}
                value={stop.descriptions[variant?.code]}
                error={error}
              />
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
      <div className="col-md-6">{JSON.stringify(stop)}</div>
    </div>
  );
}
export default StopForm;
