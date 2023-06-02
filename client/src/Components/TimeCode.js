import { useState } from 'react';
import classNames from 'classnames';

import './TimeCode.scss';

const TIMECODE_RE = /^(\d\d):(\d\d)$/;
function isValid(value) {
  return value === '' || !!value.match(TIMECODE_RE);
}

function TimeCode({ isEditing, onChange, seconds }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const value = Number.isInteger(seconds) ? `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}` : '';

  const [editingValue, setEditingValue] = useState(value);
  if (isEditing) {
    function onChangeInternal(event) {
      const { value: newValue } = event.target;
      setEditingValue(newValue);
      if (newValue === '') {
        onChange(null);
      } else {
        const match = newValue.match(TIMECODE_RE);
        if (match) {
          const newSeconds = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
          onChange(newSeconds);
        }
      }
    }
    return (
      <input
        type="text"
        className={classNames('form-control form-control-sm time-code__input', { 'is-invalid': !isValid(editingValue) })}
        value={editingValue}
        onChange={onChangeInternal}
      />
    );
  }
  if (editingValue !== value) {
    setEditingValue(value);
  }
  return value;
}
export default TimeCode;
