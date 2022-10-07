import { createSlice } from "@reduxjs/toolkit";
import { colors } from "../data/Background";
import { changeSong, nextSong, prevSong, repeatAudio } from "./actions";

const Allcolors = colors;
const initialState = { allColors: Allcolors, currentColor: colors[0] };

function changeColor(allColors, currentColor) {
  const AllColorsExceptCurrentColor = allColors.filter(
    (color) => color.gradient !== currentColor.gradient
  );

  //Randomly select an index
  const RandomSelection = Math.floor(
    Math.random() * AllColorsExceptCurrentColor.length
  );

  return AllColorsExceptCurrentColor[RandomSelection];
}

export const backgroundSlice = createSlice({
  name: "background",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(nextSong, (state) => {
      const randomColor = changeColor(state.allColors, state.currentColor);
      state.currentColor = randomColor;
    });
    builder.addCase(prevSong, (state) => {
      const randomColor = changeColor(state.allColors, state.currentColor);
      state.currentColor = randomColor;
    });
    builder.addCase(changeSong, (state) => {
      const randomColor = changeColor(state.allColors, state.currentColor);
      state.currentColor = randomColor;
    });
    builder.addCase(repeatAudio, (state) => {
      const randomColor = changeColor(state.allColors, state.currentColor);
      state.currentColor = randomColor;
    });
  },
});
