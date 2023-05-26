import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Api from '../Api';
import FormGroup from '../Components/FormGroup';
import ResourcesModal from '../Resources/ResourcesModal';
import VariantTabs from '../Components/VariantTabs';
import StopsModal from '../Stops/StopsModal';
import { useStaticContext } from '../StaticContext';
import ResourcesTable from '../Resources/ResourcesTable';
import StopsTable from '../Stops/StopsTable';

function Tour() {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
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
        return Promise.all([Api.tours.resources(TourId).index(), Api.tours.stops(TourId).index()]);
      })
      .then((result) => {
        if (result) {
          const [resourcesResponse, stopsResponse] = result;
          if (isCancelled) return;
          setResources(resourcesResponse.data);
          setStops(stopsResponse.data);
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

  const [isShowingStopsModal, setShowingStopsModal] = useState(false);

  function onHideStopsModal() {
    setShowingStopsModal(false);
  }

  async function onSelectStop(stop) {
    const response = await Api.tours.stops(TourId).create({
      StopId: stop.id,
      position: stops.reduce((max, current) => Math.max(max, current), 0) + 1,
    });
    const newStops = [...stops, response.data];
    setStops(newStops);
    setShowingStopsModal(false);
  }

  function onClickStop(stop) {
    navigate(`stops/${stop.id}`);
  }

  return (
    <>
      <Helmet>
        <title>
          {tour?.names[tour.variants[0].code] ?? ''} - {staticContext.env.REACT_APP_SITE_TITLE}
        </title>
      </Helmet>
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
                <ResourcesTable resources={resources} />
                <div className="mb-3">
                  <button onClick={() => setShowingResourcesModal(true)} type="button" className="btn btn-primary">
                    Add Asset
                  </button>
                </div>
                <h2>Stops</h2>
                <StopsTable stops={stops} onClickStop={onClickStop} />
                <div className="mb-3">
                  <button onClick={() => setShowingStopsModal(true)} type="button" className="btn btn-primary">
                    Add Stop
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        <ResourcesModal isShowing={isShowingResourcesModal} onHide={onHideResourcesModal} onSelect={onSelectResource} />
        <StopsModal isShowing={isShowingStopsModal} onHide={onHideStopsModal} onSelect={onSelectStop} />
      </main>
    </>
  );
}
export default Tour;
