import classNames from 'classnames';

function RegistrationForm({ error, isLoading, onChange, onSubmit, user }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isLoading}>
        {error && error.message && <div className="alert alert-danger">{error.message}</div>}
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
            type="email"
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
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </fieldset>
    </form>
  );
}

export default RegistrationForm;
