import classNames from 'classnames';

function VariantTabs({ variants, current, setVariant }) {
  return (
    <ul className="nav nav-tabs mb-3">
      {variants.map((v) => (
        <li key={v.code} className="nav-item">
          <a
            onClick={(event) => {
              event.preventDefault();
              setVariant(v);
            }}
            className={classNames('nav-link', { active: v === current })}
            aria-current="page"
            href={`#${v.code}`}>
            {v.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
export default VariantTabs;
