import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import Api from './Api';
import { useAuthContext } from './AuthContext';
import RegistrationForm from './RegistrationForm';
import UnexpectedError from './UnexpectedError';
import ValidationError from './ValidationError';

function Register() {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  function onChange(event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    try {
      const response = await Api.auth.register(user);
      authContext.setUser(response.data);
      navigate('/');
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
              <h2 className="card-title">Register</h2>
              <RegistrationForm onChange={onChange} onSubmit={onSubmit} error={error} user={user} />
              <div className="mb-3 text-center">
                <Link to="/login">Already have an account?</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
