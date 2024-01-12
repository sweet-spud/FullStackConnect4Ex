import "./Matchmaking.css";
import { useEffect, useState } from "react";
import data from "./services/data";
import { useNavigate } from "react-router-dom";

function Matchmaking({ player }) {
  const navigate = useNavigate();
  const [state, setState] = useState(1);

  useEffect(() => {
    data.getAllGames().then((games) => {
      const gameID = games.find((g) => g.player1Id == player.id).id;
      const onClose = () => {
        data.updatePlayer(player.id, {
          matchmaking: false,
        });
        data.deleteGame(gameID);
      };
      //       window.addEventListener("beforeunload", alertUser);
      window.addEventListener("unload", onClose);
      return () => {
        //        window.removeEventListener("beforeunload", alertUser);
        window.removeEventListener("unload", onClose);
      };
    });
  }, []);

  useEffect(() => {
    console.log(player);
    data.getPlayer(player.id).then((actPlayer) => {
      console.log(actPlayer);
      console.log("matchmaking effct");
      if (actPlayer.matchmaking == false) {
        console.log("navigate away");
        navigate("/");
      }
      data.getAllGames().then((response) => {
        const gameId = response.find((g) => g.player1Id == player.id).id;
        let time = 0;
        let dots = 1;
        let up = true;
        const interval = setInterval(() => {
          if (time > 90) {
            console.log("time-out");
            data.deleteGame(gameId);
            data.updatePlayer(player.id, {
              matchmaking: false,
            });
            clearInterval(interval);
            navigate("/");
          }

          data.getPlayer(player.id).then((response) => {
            console.log("interval");
            if (response.matchmaking == false) {
              clearInterval(interval);
            }
            console.log(time);
            /*
          data.getAllGames().then((response) => {
            const foundGame = response.find((g) => g.searching == true);
            if (foundGame) {
              if (foundGame.player1Id != player.id) {
                data.updateGame(foundGame.id, {
                  player2Id: player,
                  searching: false,
                });
                data.updatePlayer(player.id, { matchmaking: false });
                navigate(`/game/online/${foundGame.id}`);
              }
            }
            time += 1;
          });
          */
            data
              .getGame(gameId)
              .then((response) => {
                if (response.player2Id) {
                  data.updatePlayer(player.id, { matchmaking: false });
                  navigate(`/game/online/${gameId}`);
                }
                time += 1;
              })
              .catch(() => {
                clearInterval(interval);
                //  window.replace; // pass method as param to use as reference
              });
          });
          if (dots === 3) {
            setState(1);
            dots = 0;
          } else {
            setState(dots + 1);
            dots++;
          }
        }, 2000); // 2 sec
        return () => clearTimeout(interval);
      });
    });
  }, []);

  return (
    <>
      <div className="main">
        <div className="spinner" />
        <h3>
          matchmaking
          <span>{state === 1 ? "." : state === 2 ? ".." : "..."}</span>
        </h3>
      </div>
    </>
  );
}

export default Matchmaking;
