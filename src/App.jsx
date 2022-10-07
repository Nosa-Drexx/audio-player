import { Provider } from "react-redux";
import Player from "./components/Player";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <Player />
    </Provider>
  );
}

export default App;
