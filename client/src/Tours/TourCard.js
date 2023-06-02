import { Link } from 'react-router-dom';
import './TourCard.scss';

function TourCard({ title: titleOverride, tour, href }) {
  let title = titleOverride;
  let imageURL;
  if (tour) {
    title = tour.names[tour.variants[0].code];
    imageURL = tour.CoverResource?.Files[0].URL;
  }
  return (
    <div className="tour-card col-6 col-md-4 col-lg-3">
      <Link to={href} className="card text-decoration-none">
        <div className="tour-card__img card-img-top" style={{ backgroundImage: imageURL ? `url(${imageURL})` : 'none' }}></div>
        <div className="card-body">
          <h3 className="card-title text-center h6 mb-0">{title}</h3>
        </div>
      </Link>
    </div>
  );
}
export default TourCard;
