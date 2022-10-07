import { configureStore } from "@reduxjs/toolkit";
import { backgroundSlice } from "./backgroundSlice";
import { filterPlayerSlice } from "./filterStateSlice";
import playerSlice from "./playerSlice";

const store = configureStore({
  reducer: {
    player: playerSlice.reducer,
    background: backgroundSlice.reducer,
    filter: filterPlayerSlice.reducer,
  },
});
export default store;
