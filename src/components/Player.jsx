import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  nextSong,
  playOrPause,
  prevSong,
  repeat,
  repeatAudio,
  shuffle,
} from "../store/actions";
import MusicList from "./MusicList";

function formatMusicTime(val) {
  if (val < 10) return `0${val}`;
  return val;
}

function Player() {
  const isPlaying = useSelector((state) => state.player.isPlaying);
  const currentSong = useSelector((state) => state.player.currentSong);
  const stateShuffle = useSelector((state) => state.player.shuffle);
  const repeatState = useSelector((state) => state.player.repeat);
  const background = useSelector((state) => state.background.currentColor);
  const dispatch = useDispatch();
  const audioPlayer = useRef();
  const [volume, setVolume] = useState("56");
  const [seekAudio, setSeekAudio] = useState(1);
  const [isMute, setIsMute] = useState({
    muted: false,
    valueBeforeMute: volume,
  });
  const [currentTime, setCurrentTime] = useState("00 : 00");
  const [currentDuration, setCurrentDuration] = useState("00 : 00");
  const [showList, setShowList] = useState(false);
  const isRepeat = repeatState.isRepeat;
  const repeatCount = repeatState.repeatCount;

  function playStatus() {
    dispatch(playOrPause());
  }

  async function nextAudio() {
    dispatch(nextSong());
    await audioPlayer.current.pause();
    await audioPlayer.current.load();
    if (isPlaying) audioPlayer.current.play();
  }

  async function prevAudio() {
    dispatch(prevSong());
    await audioPlayer.current.pause();
    await audioPlayer.current.load();
    if (isPlaying) audioPlayer.current.play();
  }

  function changeSeek(e) {
    setSeekAudio(e.target.value);
    audioPlayer.current.currentTime =
      audioPlayer.current.duration * (e.target.value / 100);
  }

  async function repeatCurrentSong() {
    dispatch(repeatAudio());
    await audioPlayer.current.pause();
    await audioPlayer.current.load();
    audioPlayer.current.play();
  }

  function updateSeek() {
    const musicCurrentTime = audioPlayer.current.currentTime;
    const musicDuration = isNaN(audioPlayer.current.duration)
      ? 100
      : audioPlayer.current.duration; //bug fix for audioPlayer duration
    setSeekAudio(musicCurrentTime * (100 / musicDuration));

    //To update time
    const currentMinutes = formatMusicTime(Math.floor(musicCurrentTime / 60));
    const currentSeconds = formatMusicTime(
      Math.floor(musicCurrentTime - currentMinutes * 60)
    );
    setCurrentTime(`${currentMinutes} : ${currentSeconds}`);

    const durationMinutes = formatMusicTime(
      isNaN(audioPlayer.current.duration)
        ? 0
        : Math.floor(audioPlayer.current.duration / 60)
    );
    const durationSeconds = formatMusicTime(
      isNaN(audioPlayer.current.duration)
        ? 0
        : Math.floor(audioPlayer.current.duration - durationMinutes * 60)
    );
    setCurrentDuration(`${durationMinutes} : ${durationSeconds}`);
    if (musicCurrentTime === musicDuration)
      isRepeat && repeatCount ? repeatCurrentSong() : nextAudio();
  }

  function isShuffle() {
    dispatch(shuffle());
  }

  function placeOnRepeat() {
    dispatch(repeat());
  }
  useEffect(() => {
    audioPlayer.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (isPlaying) audioPlayer.current.play();
    if (!isPlaying) audioPlayer.current.pause();
  }, [isPlaying]);

  return (
    <div
      className="player"
      style={{
        backgroundColor: background.color,
        backgroundImage: background.gradient,
      }}
    >
      <div className="track-info">
        <h1>{currentSong.title}</h1>
        <h3>{currentSong.name}</h3>
      </div>

      <div className="range-and-controllers">
        <div className="range-selector">
          <span>{currentTime}</span>
          <label htmlFor="seek">
            <input
              type="range"
              id="seek"
              min="1"
              value={seekAudio}
              onChange={changeSeek}
              max="100"
            />
          </label>
          <span>{currentDuration}</span>
          <audio
            ref={audioPlayer}
            src={currentSong.url}
            onTimeUpdate={updateSeek}
          >
            <track kind="captions" />
          </audio>
        </div>
        <div className="controllers">
          {!stateShuffle ? (
            <button onClick={isShuffle}>
              <i className="fa-solid fa-arrow-down"></i>
            </button>
          ) : (
            <button onClick={isShuffle}>
              <i className="fa-solid fa-shuffle"></i>
            </button>
          )}
          <button onClick={prevAudio}>
            <i className="fa-solid fa-backward"></i>
          </button>
          {!isPlaying ? (
            <button className="play-or-pause" onClick={playStatus}>
              <i className="fa-solid fa-play"></i>
            </button>
          ) : (
            <button className="play-or-pause" onClick={playStatus}>
              <i className="fa-solid fa-pause"></i>
            </button>
          )}
          <button onClick={nextAudio}>
            <i className="fa-solid fa-forward"></i>
          </button>
          {isRepeat ? (
            <button onClick={placeOnRepeat}>
              <i className="fa-solid fa-repeat"></i>
            </button>
          ) : (
            <button onClick={placeOnRepeat}>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>

      <div className="volume">
        {!isMute.muted ? (
          <button
            onClick={() => {
              setIsMute({
                muted: true,
                valueBeforeMute: volume,
              });
              setVolume("0");
            }}
          >
            <i className="fa-solid fa-volume-high"></i>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsMute({
                valueBeforeMute: volume,
                muted: false,
              });
              setVolume(isMute.valueBeforeMute);
            }}
          >
            <i className="fa-solid fa-volume-xmark"></i>
          </button>
        )}
        <label htmlFor="volume">
          Volume &nbsp;
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </label>
        <button onClick={() => setShowList(true)}>
          <i className="fa-solid fa-list-ul"></i>
        </button>
      </div>
      {showList && (
        <MusicList audioPlayer={audioPlayer} setShowList={setShowList} />
      )}
    </div>
  );
}
export default Player;
