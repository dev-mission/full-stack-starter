import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StatusCodes } from 'http-status-codes';

import Api from '../Api';
import { useAuthContext } from '../AuthContext';
import FormGroup from '../Components/FormGroup';
import UnexpectedError from '../UnexpectedError';
import ValidationError from '../ValidationError';

function TeamForm() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthContext();
  const { teamId } = useParams();

  const isEditing = !!teamId;
  const isFirstTeam = !user?.Memberships?.length;

  const [team, setTeam] = useState({
    name: isFirstTeam ? `${user.firstName}'s Personal Team` : '',
    link: isFirstTeam ? `${user.firstName}${user.lastName}`.toLocaleLowerCase() : '',
  });
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState();

  function onChange(event) {
    const newTeam = { ...team };
    newTeam[event.target.name] = event.target.value;
    setTeam(newTeam);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let response;
      if (team.id) {
        response = await Api.teams.update(team.id, team);
      } else {
        response = await Api.teams.create(team);
      }
      const Team = { ...response.data };
      const { Memberships } = Team;
      const [Membership] = Memberships;
      delete Team.Memberships;
      Membership.Team = Team;
      const index = user.Memberships.findIndex((m) => m.id === Membership.id);
      if (index >= 0) {
        user.Memberships[index] = Membership;
      } else {
        user.Memberships.push(Membership);
      }
      user.Memberships.sort((m1, m2) => m1.Team?.name?.localeCompare(m2.Team?.name));
      setUser({ ...user });
      navigate('/');
    } catch (error) {
      if (error.response?.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        setError(new ValidationError(error.response.data));
      } else {
        setError(new UnexpectedError());
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">
                {isEditing && 'Edit Team'}
                {!isEditing && !isFirstTeam && 'New Team'}
                {!isEditing && isFirstTeam && 'Set up your Personal Team'}
              </h2>
              <form onSubmit={onSubmit}>
                {error && error.message && <div className="alert alert-danger">{error.message}</div>}
                <fieldset disabled={isLoading}>
                  <FormGroup name="name" label="Name" onChange={onChange} record={team} error={error} />
                  <FormGroup
                    name="link"
                    label="Link name"
                    helpText="Letters, numbers, and hypen only, to be used in URLs."
                    onChange={onChange}
                    record={team}
                    error={error}
                  />
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
export default TeamForm;
