import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Api from '../Api';
import FormGroup from '../Components/FormGroup';
import ResourcesModal from '../Resources/ResourcesModal';
import VariantTabs from '../Components/VariantTabs';

function Tour() {
  const { TourId } = useParams();
  const [tour, setTour] = useState();
  const [variant, setVariant] = useState();
  const [resources, setResources] = useState();
  const [stops, setStops] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.tours
      .get(TourId)
      .then((response) => {
        if (isCancelled) return;
        setTour(response.data);
        setVariant(response.data.variants[0]);
        return Promise.all([Api.tours.resources(TourId).index()]);
      })
      .then((result) => {
        if (result) {
          const [resourcesResponse] = result;
          if (isCancelled) return;
          setResources(resourcesResponse.data);
        }
      });
    return () => (isCancelled = true);
  }, [TourId]);

  const [isShowingResourcesModal, setShowingResourcesModal] = useState(false);

  function onHideResourcesModal() {
    setShowingResourcesModal(false);
  }

  async function onSelectResource(resource) {
    const response = await Api.tours.resources(TourId).create({
      ResourceId: resource.id,
      start: '',
      end: '',
    });
    const newResources = [...resources, response.data];
    newResources.sort((r1, r2) => {
      let result = r1.start.localeCompare(r2.start);
      if (result === 0) {
        result = r1.Resource.name.localeCompare(r2.Resource.name);
      }
      return result;
    });
    setResources(newResources);
    setShowingResourcesModal(false);
  }

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
                <VariantTabs variants={tour.variants} current={variant} setVariant={setVariant} />
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
                  {!resources && (
                    <tr>
                      <td colSpan="4">
                        <div className="spinner-border"></div>
                      </td>
                    </tr>
                  )}
                  {resources?.length === 0 && (
                    <tr>
                      <td colSpan="4">No assets yet.</td>
                    </tr>
                  )}
                  {resources?.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td>{r?.Resource.type}</td>
                      <td>{r?.Resource.name}</td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mb-3">
                <button onClick={() => setShowingResourcesModal(true)} type="button" className="btn btn-primary">
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
      <ResourcesModal isShowing={isShowingResourcesModal} onHide={onHideResourcesModal} onSelect={onSelectResource} />
    </main>
  );
}
export default Tour;
