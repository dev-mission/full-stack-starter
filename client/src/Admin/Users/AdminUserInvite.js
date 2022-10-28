import { useState } from 'react';
import classNames from 'classnames';
import { StatusCodes } from 'http-status-codes';

import Api from '../../Api';
import UnexpectedError from '../../UnexpectedError';
import ValidationError from '../../ValidationError';
import { useNavigate } from 'react-router-dom';

function AdminUserInvite() {
  const navigate = useNavigate();
  const [invite, setInvite] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function onChange(event) {
    const newInvite = { ...invite };
    newInvite[event.target.name] = event.target.value;
    setInvite(newInvite);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await Api.invites.create(invite);
      navigate('/admin/users', { flash: 'Invite sent!' });
    } catch (error) {
      setLoading(false);
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
      window.scrollTo(0, 0);
    }
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Invite a new User</h2>
              <form onSubmit={onSubmit}>
                {error && error.message && <div className="alert alert-danger">{error.message}</div>}
                <fieldset disabled={isLoading}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="firstName">
                      First name
                    </label>
                    <input
                      type="text"
                      className={classNames('form-control', { 'is-invalid': error?.errorsFor?.('firstName') })}
                      id="firstName"
                      name="firstName"
                      onChange={onChange}
                      value={invite.firstName ?? ''}
                    />
                    {error?.errorMessagesHTMLFor?.('firstName')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="lastName">
                      Last name
                    </label>
                    <input
                      type="text"
                      className={classNames('form-control', { 'is-invalid': error?.errorsFor?.('lastName') })}
                      id="lastName"
                      name="lastName"
                      onChange={onChange}
                      value={invite.lastName ?? ''}
                    />
                    {error?.errorMessagesHTMLFor?.('lastName')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="text"
                      className={classNames('form-control', { 'is-invalid': error?.errorsFor?.('email') })}
                      id="email"
                      name="email"
                      onChange={onChange}
                      value={invite.email ?? ''}
                    />
                    {error?.errorMessagesHTMLFor?.('email')}
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      className={classNames('form-control', { 'is-invalid': error?.errorsFor?.('message') })}
                      id="message"
                      name="message"
                      onChange={onChange}
                      value={invite.message ?? ''}
                    />
                    {error?.errorMessagesHTMLFor?.('message')}
                  </div>
                  <div className="mb-3 d-grid">
                    <button className="btn btn-primary" type="submit">
                      Submit
                    </button>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminUserInvite;
