import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import Scrubber from './Viewer/Scrubber';
import './AudioPlayer.scss';

function AudioPlayer({ className, onCanPlay, onDurationChange, src }) {
  const ref = useRef();
  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState();
  const [position, setPosition] = useState(0);

  function onCanPlayInternal() {
    setReady(true);
    onCanPlay?.();
  }

  function onDurationChangeInternal() {
    const newDuration = Math.round(ref.current.duration);
    setDuration(newDuration);
    onDurationChange?.(newDuration);
  }

  function onEndedInternal() {
    setPlaying(false);
    ref.current.currentTime = 0;
  }

  function onTimeUpdateInternal() {
    setPosition(Math.round(ref.current.currentTime));
  }

  function onPlayPause() {
    if (isPlaying) {
      ref.current.pause();
    } else {
      ref.current.play();
    }
    setPlaying(!isPlaying);
  }

  return (
    <div className={classNames('audio-player', className)}>
      <audio
        ref={ref}
        src={src}
        onCanPlay={onCanPlayInternal}
        onDurationChange={onDurationChangeInternal}
        onEnded={onEndedInternal}
        onTimeUpdate={onTimeUpdateInternal}
      />
      <button type="button" onClick={onPlayPause} disabled={!isReady} className="btn btn-outline-primary me-3">
        {!isPlaying && <FontAwesomeIcon icon={faPlay} />}
        {!!isPlaying && <FontAwesomeIcon icon={faPause} />}
      </button>
      <Scrubber className="audio-player__scrubber" position={position} duration={duration} />
    </div>
  );
}
export default AudioPlayer;
