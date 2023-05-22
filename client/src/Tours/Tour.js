import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames';

import Api from '../Api';
import FormGroup from '../Components/FormGroup';

function Tour() {
  const { TourId } = useParams();
  const [tour, setTour] = useState();
  const [variant, setVariant] = useState();
  const [assets, setAssets] = useState();
  const [stops, setStops] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.tours.get(TourId).then((response) => {
      if (isCancelled) return;
      setTour(response.data);
      setVariant(response.data.variants[0]);
    });
    return () => (isCancelled = true);
  }, [TourId]);

  return (
    <main className="container">
      {!tour && <div className="spinner-border"></div>}
      {tour && (
        <>
          <div className="row">
            <div className="col-md-6">
              <h1 className="mb-3">{tour.names[tour.variants[0].code]}</h1>
              <form>
                <FormGroup plaintext name="link" label="Link" record={tour} />
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
                <FormGroup plaintext name="name" label="Name" value={tour.names[variant.code]} />
                <FormGroup plaintext name="description" label="Description" value={tour.descriptions[variant.code]} />
                <div className="mb-3">
                  <Link className="btn btn-primary" to="edit">
                    Edit
                  </Link>
                </div>
              </form>
              <h2>Assets</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  {!assets && (
                    <tr>
                      <td colSpan="4">
                        <div className="spinner-border"></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mb-3">
                <button type="button" className="btn btn-primary">
                  Add Asset
                </button>
              </div>
              <h2>Stops</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {!stops && (
                    <tr>
                      <td colSpan="4">
                        <div className="spinner-border"></div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mb-3">
                <button type="button" className="btn btn-primary">
                  Add Stop
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
export default Tour;
