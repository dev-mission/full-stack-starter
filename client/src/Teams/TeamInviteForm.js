import { useState } from 'react';
import Api from '../Api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function TeamInviteForm({ TeamId, onCreate }) {
  const [data, setData] = useState({
    TeamId,
    email: '',
    role: 'EDITOR',
  });
  const [isLoading, setLoading] = useState(false);

  function onChange(event) {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await Api.memberships.create(data);
      onCreate?.(response.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <label htmlFor="email" className="form-label small">
        Add a Member by email address:
      </label>
      <div>
        <form onSubmit={onSubmit}>
          <fieldset disabled={isLoading} className="d-flex">
            <input
              id="email"
              name="email"
              value={data.email}
              onChange={onChange}
              type="email"
              className="form-control flex-grow-1 me-2"
              placeholder="name@domain.com"
            />
            <select name="role" value={data.role} onChange={onChange} className="form-select w-auto me-2">
              <option value="OWNER">Owner</option>
              <option value="EDITOR">Editor</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <button type="submit" className="btn btn-icon btn-outline-primary">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}
export default TeamInviteForm;
