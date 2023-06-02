import classNames from 'classnames';

import TimeCode from '../TimeCode';

import './Scrubber.scss';

function Scrubber({ className, position, duration, onSeek }) {
  function onClick(event) {
    const rect = event.target.getBoundingClientRect();
    const dx = event.clientX - rect.left;
    onSeek?.(Math.round((duration * dx) / rect.width));
  }

  return (
    <div className={classNames('scrubber', className)}>
      <div className="scrubber__position">
        <TimeCode seconds={position} />
      </div>
      <div onClick={onClick} className="scrubber__bar">
        <div className="scrubber__progress" style={{ width: `${Math.round((100 * position) / duration)}%` }}></div>
      </div>
      <div className="scrubber__duration">
        <TimeCode seconds={duration} />
      </div>
    </div>
  );
}

export default Scrubber;
