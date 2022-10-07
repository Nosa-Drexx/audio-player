import { createAction } from "@reduxjs/toolkit";

export const DATE_ADDED = "Date-Added";
export const NAME = "Name";
export const ARTIST = "Artist";
export const REVERSE = "Reverse";
export const MUSIC_PLAYER_STORAGE = "MUSIC_PLAYER_STORAGE";

export const playOrPause = createAction("player/playOrPause", (val = null) => ({
  payload: val,
}));

export const shuffle = createAction("player/shuffle", () => ({}));

export const nextSong = createAction("player/nextAudio", () => ({}));

export const prevSong = createAction("player/prevAudio", () => ({}));

export const changeSong = createAction("player/changeSong", (currentSong) => ({
  payload: currentSong,
}));

export const repeat = createAction("player/repeat", () => ({}));

export const repeatAudio = createAction("player/repeatAudio", () => ({}));

export const songListUpdated = createAction(
  "player/songListUpdated",
  (newSongList) => ({ payload: newSongList })
);

export const filterSong = createAction("filter/filterSong", (howToFilter) => ({
  payload: howToFilter,
}));
