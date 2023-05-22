import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';
import classNames from 'classnames';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function TourForm() {
  const navigate = useNavigate();
  const { membership } = useAuthContext();
  const { TourId } = useParams();

  const isNew = !TourId;

  const [variant, setVariant] = useState();
  const [tour, setTour] = useState({
    TeamId: '',
    link: '',
    names: {},
    descriptions: {},
    variants: [],
    visibility: 'PRIVATE',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (membership && !TourId) {
      setVariant(membership.Team.variants[0]);
      setTour({
        TeamId: membership.TeamId,
        link: '',
        names: { [membership.Team.variants[0].code]: '' },
        descriptions: { [membership.Team.variants[0].code]: '' },
        variants: [membership.Team.variants[0]],
        visibility: 'PRIVATE',
      });
    }
    if (TourId) {
      Api.tours.get(TourId).then((response) => {
        setVariant(response.data.variants[0]);
        setTour(response.data);
      });
    }
  }, [membership, TourId]);

  function onChange(event) {
    const newTour = { ...tour };
    const { name, value } = event.target;
    if (name === 'name' || name === 'description') {
      newTour[`${name}s`][variant?.code] = value;
    } else {
      newTour[name] = value;
    }
    setTour(newTour);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let response;
      if (TourId) {
        response = await Api.tours.update(TourId, tour);
      } else {
        response = await Api.tours.create(tour);
      }
      navigate(`/teams/${membership.TeamId}/tours/${response.data.id}`);
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
    <main className="container">
      <div className="row">
        <div className="col-md-6">
          <h1 className="mb-3">
            {isNew && 'New Tour'}
            {!isNew && 'Edit Tour'}
          </h1>
          {variant && tour && (
            <form onSubmit={onSubmit}>
              {error && error.message && <div className="alert alert-danger">{error.message}</div>}
              <fieldset disabled={isLoading}>
                <FormGroup
                  name="link"
                  label="Link name"
                  helpText="Letters, numbers, and hypen only, to be used in URLs."
                  onChange={onChange}
                  record={tour}
                  error={error}
                />
                <ul className="nav nav-tabs mb-3">
                  {tour.variants.map((v) => (
                    <li key={v.code} className="nav-item">
                      <a
                        onClick={() => setVariant(v)}
                        className={classNames('nav-link', { active: v === variant })}
                        aria-current="page"
                        href={`#${v.code}`}>
                        {v.name}
                      </a>
                    </li>
                  ))}
                </ul>
                <FormGroup name="name" label="Name" onChange={onChange} value={tour.names[variant?.code]} error={error} />
                <FormGroup
                  type="textarea"
                  name="description"
                  label="Description"
                  onChange={onChange}
                  value={tour.descriptions[variant?.code]}
                  error={error}
                />
                <div className="mb-3">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
export default TourForm;
