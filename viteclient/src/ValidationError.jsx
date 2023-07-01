import inflection from 'inflection';

class ValidationError extends Error {
  constructor(data) {
    super();
    this.data = data;
  }

  errorsFor(name) {
    const errors = this.data.errors.filter((e) => e.path === name);
    return errors.length ? errors : null;
  }

  errorMessagesHTMLFor(name) {
    const errors = this.errorsFor(name);
    if (errors) {
      return (
        <div className="invalid-feedback d-block">{inflection.capitalize([...new Set(errors.map((e) => e.message))].join(', '))}.</div>
      );
    }
  }
}

export default ValidationError;
