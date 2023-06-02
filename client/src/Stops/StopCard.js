import './StopCard.scss';

function StopCard({ stop, onSelect }) {
  const sr = stop.Resources.find((sr) => sr.Resource.type === 'IMAGE');
  return (
    <div className="stop-card col-md-4">
      <div className="card">
        <div className="stop-card__img card-img-top" style={{ backgroundImage: `url(${sr?.Resource?.Files?.[0].URL})` }}></div>
        <div className="card-body">
          <h3 className="card-title h6">{stop.names[stop.variants[0].code]}</h3>
          <p className="small">{stop.address}</p>
          <button onClick={() => onSelect(stop)} type="button" className="btn btn-sm btn-primary">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
export default StopCard;
