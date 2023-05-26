import { useEffect, useRef, useState } from 'react';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import StopCard from './StopCard';

function StopsList({ onNewStop, onSelect }) {
  const { membership } = useAuthContext();

  const [search, setSearch] = useState('');
  const [searchDebounced, setSearchDebounced] = useState(search);
  const [stops, setStops] = useState();

  const timeoutRef = useRef();

  useEffect(() => {
    let isCancelled = false;
    if (membership) {
      setStops(undefined);
      Api.stops.index(membership.TeamId, searchDebounced).then((response) => {
        if (isCancelled) return;
        setStops(response.data);
      });
    }
    return () => (isCancelled = true);
  }, [membership, searchDebounced]);

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
        <div className="mb-3">
          <input onChange={onSearchChange} value={search} type="search" className="form-control" placeholder="Search..." />
        </div>
        <div className="mb-3">
          <button onClick={() => onNewStop()} type="button" className="btn btn-primary">
            New Stop
          </button>
        </div>
      </div>
      <div className="col-md-9">
        {!stops && <div className="spinner-border"></div>}
        {stops?.length === 0 && <p>No stops yet.</p>}
        {!!stops?.length && (
          <div className="row">
            {stops?.map((s) => (
              <StopCard key={s.id} stop={s} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default StopsList;
