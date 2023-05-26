import './StopCard.scss';

function StopCard({ stop, onSelect }) {
  return (
    <div className="stop-card col-md-4">
      <div className="card">
        <div className="stop-card__img card-img-top"></div>
        <div className="card-body">
          <h3 className="card-title h6">{stop.names[stop.variants[0].code]}</h3>
          <button onClick={() => onSelect(stop)} type="button" className="btn btn-sm btn-primary">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
export default StopCard;
