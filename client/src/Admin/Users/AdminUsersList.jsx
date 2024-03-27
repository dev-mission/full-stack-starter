import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { DateTime } from 'luxon';

import Api from '../../Api';
import { useStaticContext } from '../../StaticContext';
import Pagination from '../../Components/Pagination';

function AdminUsersList() {
  const staticContext = useStaticContext();
  const [users, setUsers] = useState([]);
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const [invites, setInvites] = useState([]);

  useEffect(() => {
    Api.users.index(page).then((response) => {
      setUsers(response.data);
      const linkHeader = Api.parseLinkHeader(response);
      let newLastPage = page;
      if (linkHeader?.last) {
        const match = linkHeader.last.match(/page=(\d+)/);
        newLastPage = parseInt(match[1], 10);
      } else if (linkHeader?.next) {
        newLastPage = page + 1;
      }
      setLastPage(newLastPage);
    });
    Api.invites.index().then((response) => setInvites(response.data));
  }, [page]);

  async function revoke(invite) {
    let name = `${invite.firstName} ${invite.lastName}`.trim();
    let nameAndEmail = `${name} <${invite.email}>`.trim();
    if (window.confirm(`Are you sure you wish to revoke the invite to ${nameAndEmail}?`)) {
      const response = await Api.invites.revoke(invite.id);
      if (response.status === 200) {
        setInvites(invites.filter((i) => i.id !== invite.id));
      }
    }
  }

  async function resend(invite) {
    let name = `${invite.firstName} ${invite.lastName}`.trim();
    let nameAndEmail = `${name} <${invite.email}>`.trim();
    if (window.confirm(`Are you sure you wish to resend the invite to ${nameAndEmail}?`)) {
      const response = await Api.invites.resend(invite.id);
      if (response.status === 200) {
        for (const inv of invites) {
          if (inv.id === invite.id) {
            inv.updatedAt = response.data.updatedAt;
            break;
          }
        }
        setInvites([...invites]);
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Users - {staticContext?.env?.VITE_SITE_TITLE ?? ''}</title>
      </Helmet>
      <main className="users container">
        <h1>Manage Users</h1>
        <div className="mb-5">
          <Link to="invite" className="btn btn-outline-primary">
            Invite a new User
          </Link>
        </div>
        {invites.length > 0 && (
          <>
            <h2>Invites</h2>
            <div className="table-responsive mb-5">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="w-20">First name</th>
                    <th className="w-20">Last name</th>
                    <th className="w-20">Email</th>
                    <th className="w-20">Invited on</th>
                    <th className="w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td>{invite.firstName}</td>
                      <td>{invite.lastName}</td>
                      <td>
                        <a href={`mailto:${invite.email}`}>{invite.email}</a>
                      </td>
                      <td>{DateTime.fromISO(invite.updatedAt).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-link p-0" onClick={() => resend(invite)}>
                          Resend&nbsp;Invite
                        </button>
                        &nbsp;|&nbsp;
                        <button className="btn btn-link p-0" onClick={() => revoke(invite)}>
                          Revoke&nbsp;Invite
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <h2>Users</h2>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th className="w-20">First name</th>
                <th className="w-20">Last name</th>
                <th className="w-20">Email</th>
                <th className="w-5">Admin?</th>
                <th className="w-15">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>{user.isAdmin && 'Admin'}</td>
                  <td>
                    <Link to={`${user.id}`}>Edit&nbsp;Profile</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} lastPage={lastPage} />
        </div>
      </main>
    </>
  );
}
export default AdminUsersList;
