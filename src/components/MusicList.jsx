import gsap from "gsap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeSong,
  filterSong,
  // MUSIC_PLAYER_STORAGE,
  playOrPause,
  songListUpdated,
} from "../store/actions";
import { ARTIST, DATE_ADDED, NAME, REVERSE } from "../store/actions";

function MusicList({ audioPlayer, setShowList }) {
  const AllSongs = useSelector((state) => state.filter.songList);
  const typeOfFilter = useSelector((state) => state.filter.sortType);
  const currentSong = useSelector((state) => state.player.currentSong);
  const dispatch = useDispatch();

  async function changeCurrentSong(e) {
    const song = JSON.parse(e.target.getAttribute("data-song"));
    dispatch(changeSong(song));
    dispatch(playOrPause(true));
    await audioPlayer.current.pause();
    await audioPlayer.current.load();
    audioPlayer.current.play();
  }

  function sortSongList(e) {
    if (e.target.value !== typeOfFilter) {
      dispatch(filterSong(e.target.value));
    }
  }
  //component animation when in it comes in view
  useEffect(() => {
    let tl = gsap.timeline();
    tl.fromTo(
      ".music-list-container",
      0.5,
      {
        xPercent: 40,
        ease: "elastic.out(2, 0.5)",
      },
      { xPercent: 0, ease: "elastic.out(2, 0.5)" }
    );
  }, []);

  // useEffect(() => {
  //   localStorage.setItem(
  //     MUSIC_PLAYER_STORAGE,
  //     JSON.stringify({
  //       current: currentSong,
  //       filterType: typeOfFilter,
  //     })
  //   );
  // }, [typeOfFilter, currentSong]);

  useEffect(() => {
    dispatch(songListUpdated(AllSongs));
  }, [AllSongs]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="music-list-container">
      <div className="close-btn-container">
        <button onClick={() => setShowList(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        <label htmlFor="filter">
          SortBy: &nbsp;
          <select
            id="filter"
            value={typeOfFilter}
            onChange={sortSongList}
            onBlur={sortSongList}
          >
            <option value={DATE_ADDED}>{DATE_ADDED}</option>
            <option value={NAME}>{NAME}</option>
            <option value={ARTIST}>{ARTIST}</option>
            <option value={REVERSE}>{REVERSE}</option>
          </select>
        </label>
      </div>
      <div className="all-buttons">
        {AllSongs.map((song) => {
          const style =
            song.uuid === currentSong.uuid
              ? {
                  fontSize: "1.5rem",
                  color: "blue",
                  fontWeight: "bold",
                }
              : {};
          return (
            <div className="button-container" key={song.uuid}>
              <button
                style={style}
                data-song={JSON.stringify(song)}
                onClick={changeCurrentSong}
              >
                {`${song.name} - ${song.title}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MusicList;
