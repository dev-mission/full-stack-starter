import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import classNames from 'classnames';

import Api from '../Api';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [showExpired, setShowExpired] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setShowError(false);
    setShowInvalid(false);
    Api.passwords
      .update(token, password)
      .then((response) => navigate('/login', { state: { flash: 'Your new password has been saved.' } }))
      .catch((error) => setShowError(true));
  }

  useEffect(
    function () {
      if (token) {
        Api.passwords
          .get(token)
          .then((response) => {})
          .catch((error) => {
            if (error && error.response && error.response.status === 404) {
              setShowInvalid(true);
            } else if (error && error.response && error.response.status === 410) {
              setShowExpired(true);
            }
          });
      }
    },
    [token]
  );

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Reset your password</h2>
              {showInvalid && (
                <div className="alert alert-danger">
                  <p>Sorry, this password reset link is invalid.</p>
                  <p>
                    <Link to="forgot">Request another?</Link>
                  </p>
                </div>
              )}
              {showExpired && (
                <div className="alert alert-danger">
                  <p>Sorry, this password reset link has expired.</p>
                  <p>
                    <Link to="forgot">Request another?</Link>
                  </p>
                </div>
              )}
              {!showExpired && !showInvalid && (
                <>
                  <p>Enter a new password for your account.</p>
                  <form onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="password">
                        New password
                      </label>
                      <input
                        type="password"
                        className={classNames('form-control', { 'is-invalid': showError })}
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      {showError && (
                        <div className="invalid-feedback d-block">Minimum eight characters, at least one letter and one number.</div>
                      )}
                    </div>
                    <div className="mb-3 d-grid">
                      <button className="btn btn-primary" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
