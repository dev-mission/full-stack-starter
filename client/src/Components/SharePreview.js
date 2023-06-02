import './SharePreview.scss';

function SharePreview({ tour }) {
  const title = tour?.names[tour?.variants[0].code];
  const description = tour?.descriptions[tour?.variants[0].code];
  const link = `${tour?.Team?.link}.xrtour.org`;
  const imageURL = tour?.CoverResource?.Files?.[0]?.URL;

  return (
    <div className="share-preview">
      <div className="share-preview__image" style={{ backgroundImage: imageURL ? `url(${imageURL})` : 'none' }}></div>
      <div className="share-preview__metadata">
        <div className="share-preview__link">{link}</div>
        <div className="share-preview__title">{title}</div>
        <div className="share-preview__description">{description}</div>
      </div>
    </div>
  );
}
export default SharePreview;
