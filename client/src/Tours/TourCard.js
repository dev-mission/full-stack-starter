import { Link } from 'react-router-dom';
import './TourCard.scss';

function TourCard({ title, href }) {
  return (
    <div className="tour-card col-6 col-md-4 col-lg-3">
      <Link to={href} className="card text-decoration-none">
        <div className="tour-card__img card-img-top"></div>
        <div className="card-body">
          <h3 className="card-title text-center h6 mb-0">{title}</h3>
        </div>
      </Link>
    </div>
  );
}
export default TourCard;
