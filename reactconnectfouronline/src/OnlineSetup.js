import "./OnlineSetup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import data from "./services/data";
import Cookies from "js-cookie";

function OnlineSetup({ player }) {
  const [name, setUsername] = useState("");
  const [upPlayer, setupPlayer] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    data.getPlayer(player.id).then((response) => {
      setupPlayer(response);
      if (response.matchmaking == true) {
        data.getAllGames().then((games) => {
          const gameID = games.find((g) => g.player1Id == response.id).id;
          data.deleteGame(gameID);
          data
            .updatePlayer(response.id, {
              matchmaking: false,
            })
            .then((response2) => {
              setupPlayer(response2);
            });
        });
      }
    });
  }, []);

  const handleSearch = () => {
    console.log("handlesearch");
    if (name != "") {
      data.updatePlayer(upPlayer.id, { username: name });
    }
    data.updatePlayer(upPlayer.id, { matchmaking: true }).then(() => {
      console.log(data.getAllGames);
      data.getAllGames().then((response) => {
        const foundGame = response.find(
          (g) => g.searching == true && g.player1Id != upPlayer.id
        );
        console.log("here!!!!!        " + foundGame);
        console.log("/searching");
        if (foundGame) {
          console.log("joining");
          data
            .updateGame(foundGame.id, {
              player2Id: upPlayer.id,
              searching: false,
              yellow1: Math.random() < 0.5,
            })
            .then((response) => {
              data
                .updatePlayer(upPlayer.id, {
                  matchmaking: false,
                })
                .then(() => {
                  navigate(`/game/online/${foundGame.id}`);
                });
            });
        } else {
          console.log("going to search");
          data
            .createGame({ player1Id: upPlayer.id, searching: true })
            .then((response) => {
              console.log(response);
              data
                .updatePlayer(upPlayer.id, {
                  matchmaking: true,
                })
                .then((response) => {
                  navigate(`/searching/${upPlayer.id}`);
                });
            });
        }
      });
    });
  };

  return (
    <>
      <div>
        <form>
          <label>
            Enter username (optional):
            <input
              name="userLbl"
              type="text"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
        </form>
        <button onClick={handleSearch}>dasd</button>
      </div>
    </>
  );
}

export default OnlineSetup;
