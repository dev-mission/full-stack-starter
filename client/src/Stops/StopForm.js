import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { capitalize, pluralize } from 'inflection';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';

import { useAuthContext } from '../AuthContext';
import Api from '../Api';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';
import VariantTabs from '../Components/VariantTabs';

function StopForm({ StopId, onCancel, onCreate, onUpdate, startingAddress, type }) {
  const { membership } = useAuthContext();
  const { StopId: StopIdParam } = useParams();
  const navigate = useNavigate();

  const [Stop, setStop] = useState();
  const [variant, setVariant] = useState();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    let isCancelled = false;
    let id = StopId ?? StopIdParam;
    if (membership && !id) {
      setStop({
        TeamId: membership.TeamId,
        type,
        link: type !== 'STOP' ? uuid() : '',
        address: startingAddress ?? '',
        destAddress: null,
        names: { [membership.Team.variants[0].code]: '' },
        descriptions: { [membership.Team.variants[0].code]: '' },
        variants: [membership.Team.variants[0]],
      });
      setVariant(membership.Team.variants[0]);
    }
    if (id) {
      Api.stops.get(id).then((response) => {
        if (isCancelled) return;
        setStop(response.data);
        setVariant(response.data.variants[0]);
      });
    }
    return () => (isCancelled = true);
  }, [membership, StopId, StopIdParam, type, startingAddress]);

  function onChange(event) {
    const newStop = { ...Stop };
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
      if (Stop.id) {
        response = await Api.stops.update(Stop.id, Stop);
        onUpdate?.(response.data);
      } else {
        response = await Api.stops.create(Stop);
        onCreate?.(response.data);
      }
      if (StopIdParam) {
        navigate(-1);
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

  function onCancelInternal() {
    onCancel?.();
    if (StopIdParam) {
      navigate(-1);
    }
  }

  const form = (
    <div className="row">
      <div className="col-md-6">
        {!Stop && <div className="spinner-border"></div>}
        {variant && Stop && (
          <form autoComplete="off" onSubmit={onSubmit}>
            {error && error.message && <div className="alert alert-danger">{error.message}</div>}
            <fieldset disabled={isLoading}>
              {Stop.type === 'STOP' && (
                <>
                  <FormGroup name="link" label="Link" onChange={onChange} record={Stop} error={error} />
                  <FormGroup name="address" label="Address" onChange={onChange} record={Stop} error={error} />
                </>
              )}
              {Stop.type === 'TRANSITION' && (
                <>
                  <FormGroup name="address" label="Starting Address" onChange={onChange} record={Stop} error={error} />
                  <FormGroup name="destAddress" label="Destination Address" onChange={onChange} record={Stop} error={error} />
                </>
              )}
              <VariantTabs variants={Stop.variants} current={variant} setVariant={setVariant} />
              <FormGroup name="name" label="Name" onChange={onChange} value={Stop.names[variant?.code]} error={error} />
              <FormGroup
                type="textarea"
                name="description"
                label="Description"
                onChange={onChange}
                value={Stop.descriptions[variant?.code]}
                error={error}
              />
              <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
                &nbsp;
                <button onClick={onCancelInternal} className="btn btn-secondary" type="button">
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        )}
      </div>
      <div className="col-md-6">{JSON.stringify(Stop)}</div>
    </div>
  );
  if (StopIdParam) {
    return (
      <>
        <main className="container">
          <h1 className="mb-3">Edit {Stop ? capitalize(Stop.type) : ''}</h1>
          {form}
        </main>
      </>
    );
  } else {
    return form;
  }
}
export default StopForm;
