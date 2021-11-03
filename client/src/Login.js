import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';

import Api from './Api';
import {useAuthContext} from './AuthContext';

function Login() {
  const authContext = useAuthContext();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showInvalidError, setShowInvalidError] = useState(false);

  const onSubmit = async function(event) {
    event.preventDefault();
    setShowInvalidError(false);
    try {
      const response = await Api.auth.login(email, password);
      authContext.setUser(response.data);
      history.replace(history.location.state?.from || '/');
    } catch (error) {
      if (error.response?.status === 422) {
        setShowInvalidError(true);
      } else {
        console.log(error);
      }
    };
  }

  return (

    <main className="container" >
      <div className="row justify-content-center" >
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <div className="container" >
              <h2 className="card-title">Log in</h2>
              {history.location.state?.flash && (
                <div className="alert alert-info">{history.location.state.flash}</div>
              )}
              {showInvalidError && (
                <div className="alert alert-danger">Invalid email and/or password.</div>
              )}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input type="password" className="form-control" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="mb-3 d-grid">
                  <button className="btn btn-primary" type="submit">Submit</button>
                </div>
                <div className="mb-3 text-center">
                  <Link to="/passwords/forgot">Forgot your password?</Link>
                  </div>
                  <div className="mb-3 text-center">
                  <Link to="/register">Need an account?</Link>
                </div>
              </form>
            </div>
            </div>
          </div>
        </div>
      </div>  
    </main>
  );
}

export default Login;
