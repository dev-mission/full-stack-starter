import classNames from 'classnames';

function FormGroup({ id, type = 'text', name, label, helpText, placeholder, plaintext, record, value, error, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id ?? name}>
        {label}
      </label>
      {type === 'textarea' && (
        <textarea
          className={classNames({
            'form-control': !plaintext,
            'form-control-plaintext': plaintext,
            'is-invalid': error?.errorsFor?.(name),
          })}
          id={id ?? name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={record ? record[name] : value}></textarea>
      )}
      {type !== 'textarea' && (
        <input
          type={type}
          className={classNames({
            'form-control': !plaintext,
            'form-control-plaintext': plaintext,
            'is-invalid': error?.errorsFor?.(name),
          })}
          id={id ?? name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={record ? record[name] : value}
        />
      )}
      {error?.errorMessagesHTMLFor?.(name)}
      {helpText && <div className="form-text">{helpText}</div>}
    </div>
  );
}
export default FormGroup;
