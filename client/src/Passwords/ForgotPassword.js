import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';

import Api from '../Api';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setShowError(false);
    Api.passwords
      .reset(email)
      .then(() => {
        navigate('/login', { state: { flash: 'Please check your email in a few minutes for a reset password link.' } });
      })
      .catch(() => setShowError(true));
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Forgot your password?</h2>
              <p>Enter the email address you registered to receive a reset password link.</p>
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="text"
                    className={classNames('form-control', { 'is-invalid': showError })}
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                  {showError && <div className="invalid-feedback d-block">Email not found.</div>}
                </div>
                <div className="mb-3 d-grid">
                  <button className="btn btn-primary" type="submit">
                    Submit
                  </button>
                </div>
                <div className="mb-3 text-center">
                  <Link to="/login">Back to login...</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
