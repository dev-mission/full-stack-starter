import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import ResourceCard from './ResourceCard';

function ResourcesList({ onNewAsset, onSelect }) {
  const { membership } = useAuthContext();

  const [type, setType] = useState('IMAGE');
  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState(search);
  const [resources, setResources] = useState();

  const timeoutRef = useRef();

  useEffect(() => {
    let isCancelled = false;
    if (membership) {
      setResources(undefined);
      Api.resources.index(membership.TeamId, type, searchDebounced).then((response) => {
        if (isCancelled) return;
        setResources(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [membership, type, searchDebounced]);

  function onClickType(newType) {
    if (type !== newType) {
      setType(newType);
    }
  }

  function onSearchChange(event) {
    const { value } = event.target;
    setSearch(value);
    // debounce the search value change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setSearchDebounced(value);
    }, 300);
  }

  return (
    <div className="row">
      <div className="col-md-3">
        <ul className="list-group mb-3">
          <button
            type="button"
            onClick={() => onClickType('IMAGE')}
            className={classNames('list-group-item list-group-item-action', { active: type === 'IMAGE' })}>
            Images
          </button>
          <button
            type="button"
            onClick={() => onClickType('AUDIO')}
            className={classNames('list-group-item list-group-item-action', { active: type === 'AUDIO' })}>
            Audio
          </button>
          <button
            type="button"
            onClick={() => onClickType('AR_LINK')}
            className={classNames('list-group-item list-group-item-action', { active: type === 'AR_LINK' })}>
            AR Links
          </button>
        </ul>
        <div className="mb-3">
          <input onChange={onSearchChange} value={search} type="search" className="form-control" placeholder="Search..." />
        </div>
        <div className="mb-3">
          <button onClick={() => onNewAsset(type)} type="button" className="btn btn-primary">
            New Asset
          </button>
        </div>
      </div>
      <div className="col-md-9">
        {!resources && <div className="spinner-border"></div>}
        {resources?.length === 0 && <p>No assets yet.</p>}
        {resources?.length && (
          <div className="row">
            {resources?.map((r) => (
              <ResourceCard key={r.id} resource={r} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default ResourcesList;
