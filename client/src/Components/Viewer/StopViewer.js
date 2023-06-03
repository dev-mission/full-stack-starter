import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import Scrubber from './Scrubber';
import './StopViewer.scss';

function StopViewer({ position, stop, transition, variant, onTimeUpdate }) {
  const [duration, setDuration] = useState(0);
  const [imageURL, setImageURL] = useState();

  const [images, setImages] = useState();
  const [tracks, setTracks] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  const ref = useRef({});

  const [isReady, setReady] = useState(false);
  const [isPlaying, setPlaying] = useState(false);

  useEffect(() => {
    if (stop.Resources) {
      let newDuration = 0;
      let newImages = [];
      let newTracks = [];
      for (const sr of stop.Resources) {
        if (Number.isInteger(sr.end)) {
          newDuration = Math.max(newDuration, sr.end);
        } else if (Number.isInteger(sr.start)) {
          newDuration = Math.max(newDuration, sr.start);
        }
        if (sr.Resource.type === 'AUDIO') {
          newDuration = Math.max(newDuration, sr.start + sr.Resource.Files.find((f) => f.variant === variant.code)?.duration ?? 0);
          newTracks.push(sr);
        } else if (sr.Resource.type === 'IMAGE') {
          newImages.push({ ...sr });
        }
      }
      if (transition?.Resources) {
        const offset = newDuration;
        for (const ir of newImages) {
          if (!Number.isInteger(ir.end)) {
            ir.end = offset;
          }
        }
        for (const sr of transition.Resources) {
          if (Number.isInteger(sr.end)) {
            newDuration = Math.max(newDuration, offset + sr.end);
          } else if (Number.isInteger(sr.start)) {
            newDuration = Math.max(newDuration, offset + sr.start);
          }
          if (sr.Resource.type === 'AUDIO') {
            newDuration = Math.max(
              newDuration,
              offset + sr.start + sr.Resource.Files.find((f) => f.variant === variant.code)?.duration ?? 0
            );
            newTracks.push({ ...sr, start: offset + sr.start });
          } else if (sr.Resource.type === 'IMAGE') {
            newImages.push({ ...sr, start: offset + sr.start, end: Number.isInteger(sr.end) ? offset + sr.end : null });
          }
        }
      }
      setDuration(newDuration);
      setImages(newImages);
      setTracks(newTracks);
      ref.current = {};
    }
  }, [stop, transition, variant]);

  useEffect(() => {
    if (images && tracks && Number.isInteger(position)) {
      let newImageURL;
      for (const sr of images) {
        if (sr.start <= position && (sr.end ?? Number.MAX_SAFE_INTEGER) > position) {
          newImageURL = sr.Resource.Files.find((f) => f.variant === variant.code)?.URL;
          break;
        }
      }
      if (newImageURL !== imageURL) {
        setImageURL(newImageURL);
      }
      for (const sr of tracks) {
        const end = sr.start + sr.Resource.Files.find((f) => f.variant === variant.code)?.duration ?? 0;
        if (sr.start <= position && position < end) {
          if (sr !== currentTrack) {
            setCurrentTrack(sr);
          }
          const audio = ref.current[sr.id];
          if (audio) {
            if (audio.paused) {
              audio.currentTime = position - sr.start;
            }
            if (isPlaying) {
              audio.play();
            }
          }
          break;
        }
      }
    }
  }, [variant, images, imageURL, tracks, currentTrack, isPlaying, position]);

  function onPlayPause() {
    if (isPlaying) {
      for (const audio of Object.values(ref.current)) {
        audio.pause();
      }
    } else {
      if (currentTrack) {
        ref.current[currentTrack.id]?.play();
      }
    }
    setPlaying(!isPlaying);
  }

  function onTimeUpdateInternal(event) {
    const { target: audio } = event;
    if (audio.id === currentTrack?.id) {
      onTimeUpdate?.(Math.round(audio.currentTime) + currentTrack.start);
    }
  }

  function onEndedInternal(event) {
    let isEnded = true;
    for (const audio of Object.values(ref.current)) {
      isEnded = isEnded && audio.paused;
    }
    if (isEnded) {
      setPlaying(false);
    }
  }

  function onSeek(newPosition) {
    if (isPlaying) {
      for (const audio of Object.values(ref.current)) {
        audio.pause();
      }
      setPlaying(false);
      setCurrentTrack();
    }
    onTimeUpdate?.(newPosition);
  }

  return (
    <div className="stop-viewer">
      <div className="stop-viewer__image" style={{ backgroundImage: imageURL ? `url(${imageURL})` : 'none' }}></div>
      <div className="stop-viewer__controls">
        <Scrubber onSeek={onSeek} position={position} duration={duration} className="stop-viewer__scrubber" />
        <button onClick={onPlayPause} type="button" className="btn btn-lg btn-outline-primary">
          {!isPlaying && <FontAwesomeIcon icon={faPlay} />}
          {isPlaying && <FontAwesomeIcon icon={faPause} />}
        </button>
      </div>
      {tracks?.map((sr) => (
        <audio
          id={sr.id}
          key={sr.id}
          ref={(el) => el && (ref.current[el.id] = el)}
          src={sr.Resource.Files.find((f) => f.variant === variant.code)?.URL}
          onTimeUpdate={onTimeUpdateInternal}
          onEnded={onEndedInternal}
        />
      ))}
    </div>
  );
}
export default StopViewer;
