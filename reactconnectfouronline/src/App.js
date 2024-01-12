import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./Home";
import GameSingle from "./GameSingle";
import Matchmaking from "./Matchmaking";
import GameOnline from "./GameOnline";
import OnlineSetup from "./OnlineSetup";
import data from "./services/data";
import Cookies from "js-cookie";

function App() {
  const [player, setPlayer] = useState(undefined);
  const create = () => {
    console.log("create-meth called");
    data
      .createPlayer({
        matchmaking: false,
      })
      .then((newPlayer) => {
        console.log(newPlayer.id);
        Cookies.set("user", newPlayer.id, { expires: 1 });
        setPlayer(newPlayer);
      });
  };
  const effect = () => {
    console.log("use-effect");
    const cookU = Cookies.get("user");
    console.log(cookU);
    if (cookU) {
      data
        .getPlayer(cookU)
        .then((player) => {
          console.log("here");
          setPlayer(player);
        })
        .catch(() => {
          console.log("invalid cookie");
          create();
        });
    } else {
      console.log("creating");
      create();
    }
  };
  useEffect(effect, []);

  return (
    <Routes>
      {console.log(player)}
      <Route path="/" element={<Home player={player} />} />
      <Route path="/game/:playerId" element={<GameSingle player={player} />} />
      <Route path="/play-online" element={<OnlineSetup player={player} />} />
      <Route path="/searching/:id" element={<Matchmaking player={player} />} />
      <Route
        path="/game/online/:gameId"
        element={<GameOnline player={player} />}
      />
    </Routes>
  );
}

export default App;
