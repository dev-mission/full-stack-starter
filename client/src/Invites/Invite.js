import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import RegistrationForm from '../RegistrationForm';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function Invite() {
  const { setUser: setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const { inviteId } = useParams();
  const [invite, setInvite] = useState(null);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inviteId) {
      Api.invites.get(inviteId).then((response) => {
        setInvite(response.data);
        setAuthUser(null);
      });
    }
  }, [inviteId, setAuthUser]);

  function onChange(event) {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await Api.invites.accept(invite.id, user);
      setAuthUser(response.data);
      navigate(`/account`, { state: { flash: 'Your account has been created!' } });
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">You're Invited</h2>
              {invite?.acceptedAt && <p>This invite has already been accepted.</p>}
              {invite?.revokedAt && <p>This invite is no longer available.</p>}
              {invite && invite.acceptedAt === null && invite.revokedAt === null && (
                <RegistrationForm onSubmit={onSubmit} onChange={onChange} error={error} user={user} isLoading={isLoading} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Invite;
