import {useState} from 'react';
import {useHistory, Link} from 'react-router-dom';
import classNames from 'classnames';
import {StatusCodes} from 'http-status-codes'

import Api from './Api';
import UnexpectedError from './UnexpectedError';
import ValidationError from './ValidationError';

function Register() {
  const history = useHistory();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const onChange = function(event) {
    const newUser = {...user};
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  };

  const onSubmit = async function(event) {
    event.preventDefault();
    setError(null);
    try {
      await Api.auth.register(user);
      history.push('/login', {flash: 'Your account has been created!'});
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    };
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Register</h2>
              <form onSubmit={onSubmit}>
                {error && error.message && (
                  <div className="alert alert-danger">{error.message}</div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor="firstName">First name</label>
                  <input type="text" class={classNames('form-control', {'is-invalid': error?.errorsFor?.('firstName')})} id="firstName" name="firstName" onChange={onChange} value={user.firstName} />
                  {error?.errorMessagesHTMLFor?.('firstName')}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="lastName">Last name</label>
                  <input type="text" class={classNames('form-control', {'is-invalid': error?.errorsFor?.('lastName')})} id="lastName" name="lastName" onChange={onChange} value={user.lastName} />
                  {error?.errorMessagesHTMLFor?.('lastName')}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input type="text" class={classNames('form-control', {'is-invalid': error?.errorsFor?.('email')})} id="email" name="email" onChange={onChange} value={user.email} />
                  {error?.errorMessagesHTMLFor?.('email')}
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input type="password" class={classNames('form-control', {'is-invalid': error?.errorsFor?.('password')})} id="password" name="password" onChange={onChange} value={user.password} />
                  {error?.errorMessagesHTMLFor?.('password')}
                </div>
                <div className="mb-3 d-grid">
                  <button className="btn btn-primary" type="submit">Submit</button>
                </div>
                <div className="mb-3 text-center">
                  <Link to="/login">Already have an account?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>  
    </main>
  );
}

export default Register;
