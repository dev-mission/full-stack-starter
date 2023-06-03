import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import inflection from 'inflection';

import Api from '../Api';
import { useStaticContext } from '../StaticContext';
import FormGroup from '../Components/FormGroup';
import VariantTabs from '../Components/VariantTabs';
import ResourcesModal from '../Resources/ResourcesModal';
import StopsModal from '../Stops/StopsModal';
import StopsTable from '../Stops/StopsTable';
import SharePreview from '../Components/SharePreview';

function Tour() {
  const staticContext = useStaticContext();
  const navigate = useNavigate();
  const { TourId } = useParams();
  const [tour, setTour] = useState();
  const [variant, setVariant] = useState();
  const [stops, setStops] = useState();

  useEffect(() => {
    let isCancelled = false;
    Api.tours
      .get(TourId)
      .then((response) => {
        if (isCancelled) return;
        setTour(response.data);
        setVariant(response.data.variants[0]);
        return Api.tours.stops(TourId).index();
      })
      .then((response) => {
        if (isCancelled) return;
        setStops(response.data);
      });
    return () => (isCancelled = true);
  }, [TourId]);

  const [isShowingResourcesModal, setShowingResourcesModal] = useState(false);

  function onHideResourcesModal() {
    setShowingResourcesModal(false);
  }

  async function onSelectResource(resource) {
    await Api.tours.update(tour.id, { CoverResourceId: resource.id });
    const newTour = { ...tour };
    newTour.CoverResource = resource;
    setTour(newTour);
    setShowingResourcesModal(false);
  }

  const [stopType, setStopType] = useState('STOP');
  const [isShowingStopsModal, setShowingStopsModal] = useState(false);

  function onHideStopsModal() {
    setShowingStopsModal(false);
  }

  async function onSelectStop(stop) {
    if (stop.type === 'INTRO') {
      await Api.tours.update(tour.id, { IntroStopId: stop.id });
      const newTour = { ...tour };
      newTour.IntroStop = stop;
      newTour.IntroStopId = stop.id;
      setTour(newTour);
    } else if (stop.type === 'STOP') {
      const response = await Api.tours.stops(TourId).create({
        StopId: stop.id,
        position: stops.reduce((max, current) => Math.max(max, current), 0) + 1,
      });
      const newStops = [...stops, response.data];
      setStops(newStops);
    }
    setShowingStopsModal(false);
  }

  function onClickStop(type, stop) {
    navigate(`${inflection.pluralize(type).toLocaleLowerCase()}/${stop.id}`);
  }

  async function onRemoveIntro() {
    await Api.tours.update(tour.id, { IntroStopId: null });
    const newTour = { ...tour };
    newTour.IntroStop = null;
    setTour(newTour);
  }

  async function onRemoveStop(stop) {
    await Api.tours.stops(tour.id).remove(stop.id);
    const newStops = [...stops];
    const index = newStops.indexOf(stop);
    newStops.splice(index, 1);
    setStops(newStops);
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
            <h1 className="mb-3">{tour.names[tour.variants[0].code]}</h1>
            <div className="row">
              <div className="col-md-6">
                <form className="mb-5">
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
                <div className="row mb-5">
                  <div className="col-md-6">
                    <h2>Cover</h2>
                    {tour.CoverResource && (
                      <div className="row">
                        <div className="col-6">
                          <img
                            className="img-thumbnail mb-3"
                            src={tour.CoverResource.Files.find((f) => f.variant === variant.code)?.URL}
                            alt="Cover"
                          />
                        </div>
                      </div>
                    )}
                    <button onClick={() => setShowingResourcesModal(true)} type="button" className="btn btn-primary">
                      Select Cover
                    </button>
                  </div>
                </div>
                <h2>Intro</h2>
                <StopsTable
                  type="INTRO"
                  stops={tour.IntroStop ? [{ id: tour.IntroStopId, Stop: tour.IntroStop }] : []}
                  onClick={onClickStop}
                  onRemove={onRemoveIntro}
                />
                <div className="mb-5">
                  <button
                    onClick={() => {
                      setStopType('INTRO');
                      setShowingStopsModal(true);
                    }}
                    type="button"
                    className="btn btn-primary">
                    Set Intro
                  </button>
                </div>
                <h2>Stops</h2>
                <StopsTable stops={stops} onClick={onClickStop} onRemove={onRemoveStop} />
                <div className="mb-5">
                  <button
                    onClick={() => {
                      setStopType('STOP');
                      setShowingStopsModal(true);
                    }}
                    type="button"
                    className="btn btn-primary">
                    Add Stop
                  </button>
                </div>
              </div>
              <div className="col-md-4 offset-md-1">
                <SharePreview tour={tour} />
              </div>
            </div>
          </>
        )}
        <ResourcesModal isShowing={isShowingResourcesModal} onHide={onHideResourcesModal} onSelect={onSelectResource} types={['IMAGE']} />
        <StopsModal type={stopType} isShowing={isShowingStopsModal} onHide={onHideStopsModal} onSelect={onSelectStop} />
      </main>
    </>
  );
}
export default Tour;
