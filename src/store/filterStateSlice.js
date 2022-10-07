import { createSlice } from "@reduxjs/toolkit";
import {
  ARTIST,
  DATE_ADDED,
  // MUSIC_PLAYER_STORAGE,
  NAME,
  REVERSE,
} from "./actions";
import { songData } from "./playerSlice";

function sortHelper(state, val) {
  const stateDuplicate = [...state];
  const arr = state.map((song) => song[val]).sort();
  const finalState = [];
  function loopThrough() {
    for (let searchVal of arr) {
      for (let i = 0; i < stateDuplicate.length; i++) {
        if (searchVal === stateDuplicate[i][val]) {
          finalState.push(stateDuplicate[i]);
          stateDuplicate.splice(i, 1);
          break;
        }
      }
    }
  }
  loopThrough();
  return finalState;
}

// const userFilterSetting = localStorage.getItem(MUSIC_PLAYER_STORAGE)
//   ? JSON.parse(localStorage.getItem(MUSIC_PLAYER_STORAGE)).filterType
//   : DATE_ADDED; //caching user previous selection implementation

const initialState = {
  songList: songData,
  sortType: DATE_ADDED,
};

export const filterPlayerSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    filterSong: (state, action) => {
      state.sortType = action.payload;
      if (action.payload === DATE_ADDED) {
        state.songList = [...songData];
      }
      if (action.payload === ARTIST) {
        state.songList = sortHelper(state.songList, "name");
      }
      if (action.payload === NAME) {
        state.songList = sortHelper(state.songList, "title");
      }
      if (action.payload === REVERSE) {
        const songListRef = state.songList;
        let finalState = [];
        for (let i = songListRef.length - 1; i > -1; i--) {
          finalState.push(songListRef[i]);
        }
        state.songList = finalState;
      }
    },
  },
});
