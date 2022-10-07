import { createSlice, nanoid } from "@reduxjs/toolkit";
import { audios } from "../data/songs";

export const songData = audios.map((song) => {
  return { uuid: nanoid(), ...song };
});

function find(list, lookFor) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].uuid === lookFor.uuid) return i;
  }
}

function getRandomMusic(state) {
  const random = Math.random();
  const randomIndex = Math.floor(random * state.songs.length);

  //Prevent from randomly selecting same music as currentSong
  if (randomIndex !== indexOfCurrentState(state)) {
    state.currentSong = state.songs[randomIndex];
  } else {
    return getRandomMusic(state); //tails call recursive for a system that support tail call recursion
  }
}

function indexOfCurrentState(state) {
  const AllSongs = state.songs;
  const currentSong = state.currentSong;
  const indexOfCurrentSong = find(AllSongs, currentSong);
  return indexOfCurrentSong;
}

const initialState = {
  songs: songData,
  isPlaying: false,
  currentSong: songData[0],
  shuffle: false,
  repeat: {
    isRepeat: false,
    repeatCount: 1,
  },
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playOrPause: (state, action) => {
      if (action.payload !== null) {
        state.isPlaying = action.payload;
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },
    nextAudio: (state) => {
      state.repeat.repeatCount = 1; //resets repeat count whenever a new music starts
      if (state.shuffle) {
        getRandomMusic(state);
      } else {
        const indexOfCurrentSong = indexOfCurrentState(state);
        if (indexOfCurrentSong < state.songs.length - 1) {
          state.currentSong = state.songs[indexOfCurrentSong + 1];
        } else {
          state.currentSong = state.songs[0];
        }
      }
    },
    prevAudio: (state) => {
      state.repeat.repeatCount = 1; //resets repeat count whenever a new music starts
      if (state.shuffle) {
        getRandomMusic(state);
      } else {
        const indexOfCurrentSong = indexOfCurrentState(state);
        if (indexOfCurrentSong !== 0) {
          state.currentSong = state.songs[indexOfCurrentSong - 1];
        } else {
          state.currentSong = state.songs[state.songs.length - 1];
        }
      }
    },
    shuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    changeSong: (state, action) => {
      state.repeat.repeatCount = 1; //resets repeat count whenever a new music starts
      const newSongIndex = find(state.songs, action.payload);
      state.currentSong = state.songs[newSongIndex];
    },
    repeat: (state) => {
      state.repeat.isRepeat = !state.repeat.isRepeat;
    },
    repeatAudio: (state) => {
      if (state.repeat.repeatCount) {
        state.currentSong = { ...state.currentSong };
      }
      state.repeat.repeatCount = 0;
    },
    songListUpdated: (state, action) => {
      state.songs = action.payload;
    },
  },
});

export default playerSlice;
