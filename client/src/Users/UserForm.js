import { useState } from 'react';
import classNames from 'classnames';
import { StatusCodes } from 'http-status-codes';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import PhotoInput from '../Components/PhotoInput';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function UserForm() {
  const authContext = useAuthContext();

  const [user, setUser] = useState({ ...authContext.user, password: '' });
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function onChange(event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const response = await Api.users.update(user.id, user);
      authContext.setUser(response.data);
      setSuccess(true);
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    }
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">My Account</h2>
              <form onSubmit={onSubmit}>
                {error && error.message && <div className="alert alert-danger">{error.message}</div>}
                {success && <div className="alert alert-info">Your account has been updated!</div>}
                <div className="mb-3">
                  <label className="form-label" htmlFor="picture">
                    Picture
                  </label>
                  <PhotoInput
                    className="card"
                    id="picture"
                    name="picture"
                    value={user.picture}
                    valueUrl={user.pictureUrl}
                    onChange={onChange}
                    onUploading={setUploading}>
                    <div className="card-body">
                      <div className="card-text">Drag-and-drop a photo file here, or click here to browse and select a file.</div>
                    </div>
                  </PhotoInput>
                  {error?.errorMessagesHTMLFor?.('picture')}
                </div>
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
                    value={user.firstName}
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
                    value={user.lastName}
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
                    value={user.email}
                  />
                  {error?.errorMessagesHTMLFor?.('email')}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    className={classNames('form-control', { 'is-invalid': error?.errorsFor?.('password') })}
                    id="password"
                    name="password"
                    onChange={onChange}
                    value={user.password}
                  />
                  {error?.errorMessagesHTMLFor?.('password')}
                </div>
                <div className="mb-3 d-grid">
                  <button disabled={isUploading} className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default UserForm;
