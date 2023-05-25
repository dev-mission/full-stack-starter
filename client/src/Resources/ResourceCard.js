import './ResourceCard.scss';

function ResourceCard({ resource, onSelect }) {
  return (
    <div className="resource-card col-md-4">
      <div className="card">
        <div className="resource-card__img card-img-top"></div>
        <div className="card-body">
          <h3 className="card-title h6">{resource.name}</h3>
          <button onClick={() => onSelect(resource)} type="button" className="btn btn-sm btn-primary">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
export default ResourceCard;
