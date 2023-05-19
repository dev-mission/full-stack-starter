import classNames from 'classnames';

function FormGroup({ id, name, label, helpText, placeholder, record, error, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id ?? name}>
        {label}
      </label>
      <input
        type="text"
        className={classNames('form-control', { 'is-invalid': error?.errorsFor?.(name) })}
        id={id ?? name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={record[name]}
      />
      {error?.errorMessagesHTMLFor?.(name)}
      {helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
}
export default FormGroup;
