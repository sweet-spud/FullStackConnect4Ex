import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as BoardSVG } from "./board.svg";
import propTypes from "prop-types";
import "./GameOnline.css";
import data from "./services/data";

function Cell(props) {
  return <button className={props.name} onClick={props.onclick}></button>;
}
Cell.propTypes = {
  name: propTypes.string,
  onclick: propTypes.func,
};

function GameSingle({ player }) {
  const navigate = useNavigate();
  const game = useRef();
  const player1 = useRef();
  const player2 = useRef();
  const isPlayer1 = useRef();
  const isYellow = useRef();
  const myTurn = useRef(false);
  const board = useRef(Array(42).fill(-1));
  const waitingForAni = useRef(false);
  const addToBoard = useRef([-1, -1]);
  const yellowNext = useRef(true);
  const [state, setState] = useState({
    // -1 - Undefined | 1 - yellow | 2 - red
    buttonPlace: "",
    actAnimation: false,
    win: -2,
  });
  useEffect(() => {
    data.getAllGames().then((response) => {
      const cGame = response.find(
        (g) => g.player1Id == player.id || g.player2Id == player.id
      );
      game.current = cGame;
      console.log(cGame);
      console.log(response);
      data
        .updateLogic(cGame.id, [board.current, undefined])
        .then((newLogic) => {
          data.getPlayer(cGame.player1Id).then((player1R) => {
            if (!player1R.username) {
              player1.current = { ...player1R, username: "Player 1" };
            } else {
              player1.current = player1R;
            }
            if (cGame.player1Id == player.id) {
              isPlayer1.current = true;
              isYellow.current = cGame.yellow1;
              myTurn.current = cGame.yellow1;
            } else {
              isPlayer1.current = false;
              isYellow.current = !cGame.yellow1;
              myTurn.current = !cGame.yellow1;
            }
            data.getPlayer(cGame.player2Id).then((player2R) => {
              if (!player2R.username) {
                player2.current = { ...player2R, username: "Player 2" };
              } else {
                player2.current = player2R;
              }
              setState({ ...state, win: -1 });
            });
          });
        });
    });
    const interval = setInterval(() => {
      console.log(waitingForAni.current);
      if (
        game.current &&
        player1.current &&
        player2.current &&
        myTurn.current === false &&
        waitingForAni.current === false
      ) {
        console.log("inside interval");
        data.getLogic(game.current.id).then((response) => {
          console.log(response);
          if (response[1]) {
            //
            // after click it clears interval on first loop cause current and response eval to true;
            //
            console.log(board.current);
            console.log(
              "clear-check: left: " +
                board.current[response[1][0]] +
                "   right: " +
                board.current[1][1] +
                "  bool: " +
                board.current[response[1][0]] !=
                response[1][1]
            );
            if (board.current[response[1][0]] != response[1][1]) {
              // clear doesnt work
              console.log("clear");
              let calcRet = checkCircleWin(
                response[1][0],
                response[1][1],
                "All"
              );
              let winRet = -1;
              calcRet[0].forEach((e) => {
                if (e >= 3) {
                  winRet = calcRet[1];
                }
              });
              setState({
                ...state,
                win: winRet,
                buttonPlace: "ani" + (response[1][0] + 1),
                actAnimation: true,
              });
              yellowNext.current = !yellowNext.current;
              addToBoard.current = response[1];
              waitingForAni.current = true;
            }
          }
        });
      }
    }, 2000);
  }, []);
  useEffect(() => {
    if (game.current && player1.current && player2.current) {
      document.getElementById("ani").addEventListener("animationend", () => {
        console.log("animation end");
        waitingForAni.current = false;
        let arr = board.current.slice();
        console.log(addToBoard.current);
        arr[addToBoard.current[0]] = addToBoard.current[1];
        board.current = arr;
        setState((prevState) => {
          return {
            ...prevState,
            actAnimation: false,
            buttonPlace: "",
          };
        });
        addToBoard.current = [-1, -1];
        console.log("current: " + myTurn.current);
        console.log("opposite: " + !myTurn.current);
        myTurn.current = !myTurn.current;
      });
    }
  }, [game.current, player1.current, player2.current]);

  const getBoardAniName = () => {
    if (state.actAnimation == true) {
      let a = addToBoard.current[0];
      while (a > 6) {
        a -= 7;
      }
      return "boardAnimationsAct" + (a + 1);
    }
    return "boardAnimations";
  };

  const checkCircleWin = (n, color, check) => {
    const row = Math.ceil(n / 7);
    const col =
      (n > 34
        ? n - 35
        : n > 27
        ? n - 28
        : n > 20
        ? n - 21
        : n > 13
        ? n - 14
        : n > 6
        ? n - 7
        : n) + 1;
    let total = [0, 0, 0, 0];
    // -1 - Undefined | 1 - yellow | 2 - red
    // Up
    if (row != 1 && (check == "Up" || check == "All")) {
      if (board.current[n - 7] != -1 && board.current[n - 7] == color) {
        total[0] += checkCircleWin(n - 7, color, "Up")[0][0] + 1;
      }
    }
    // Left-Up
    if (row != 1 && col != 1 && (check == "Left-Up" || check == "All")) {
      if (board.current[n - 8] != -1 && board.current[n - 8] == color) {
        total[1] += checkCircleWin(n - 8, color, "Left-Up")[0][1] + 1;
      }
    }
    // Right-Up
    if (row != 1 && col != 7 && (check == "Right-Up" || check == "All")) {
      if (board.current[n - 6] != -1 && board.current[n - 6] == color) {
        total[2] += checkCircleWin(n - 6, color, "Right-Up")[0][2] + 1;
      }
    }
    // Left
    if (col != 1 && (check == "Left" || check == "All")) {
      if (board.current[n - 1] != -1 && board.current[n - 1] == color) {
        total[3] += checkCircleWin(n - 1, color, "Left")[0][3] + 1;
      }
    }
    // Right
    if (col != 7 && (check == "Right" || check == "All")) {
      if (board.current[n + 1] != -1 && board.current[n + 1] == color) {
        total[3] += checkCircleWin(n + 1, color, "Right")[0][3] + 1;
      }
    }
    // Down
    if (row != 6 && (check == "Down" || check == "All")) {
      if (board.current[n + 7] != -1 && board.current[n + 7] == color) {
        total[0] += checkCircleWin(n + 7, color, "Down")[0][0] + 1;
      }
    }
    // Left-Down
    if (col != 1 && row != 6 && (check == "Left-Down" || check == "All")) {
      if (board.current[n + 6] != -1 && board.current[n + 6] == color) {
        total[2] += checkCircleWin(n + 6, color, "Left-Down")[0][2] + 1;
      }
    }
    // Right-Down
    if (col != 7 && row != 6 && (check == "Right-Down" || check == "All")) {
      if (board.current[n + 8] != -1 && board.current[n + 8] == color) {
        total[1] += checkCircleWin(n + 8, color, "Right-Down")[0][1] + 1;
      }
    }
    return [total, color];
  };

  const renderCell = (i) => {
    return (
      <Cell
        onclick={() => {
          if (
            board.current[i] != -1 ||
            state.win != -1 ||
            myTurn.current === false
          ) {
            return;
          }
          let n = i;
          while (n > 6) {
            n -= 7;
          }
          while (n < 42) {
            if (n < 35) {
              if (board.current[n + 7] == -1) {
                n += 7;
                continue;
              }
            }
            let col = 0;
            if (yellowNext.current == true) {
              col = 1;
            } else {
              col = 2;
            }
            let calcRet = checkCircleWin(n, col, "All");
            let winRet = -1;
            calcRet[0].forEach((e) => {
              if (e >= 3) {
                winRet = calcRet[1];
              }
            });
            console.log("click yellow next: " + yellowNext.current);
            setState((prevState) => {
              return {
                ...prevState,
                buttonPlace: "ani" + (n + 1),
                actAnimation: true,
                win: winRet,
              };
            });
            yellowNext.current = !yellowNext.current;
            addToBoard.current = [n, col];
            let arr = board.current.slice();
            arr[n] = col;
            console.log(arr);
            waitingForAni.current = true;
            data.updateLogic(game.current.id, [arr, [n, col]]);
            return;
          }
        }}
        name={
          board.current[i] == 2
            ? "cellRed"
            : board.current[i] == 1
            ? "cellYellow"
            : "cellWhite"
        }
      />
    );
  };

  if (!game.current || !player1.current || !player2.current) {
    console.log(
      "game: " + game + "   play1: " + player1 + "   ply2: " + player2
    );
    return (
      <div className="loadingDiv">
        <div className="spinner" />
        <h3>setting up board...</h3>
      </div>
    );
  }

  let status = "";
  if (state.win != -1) {
    console.log("if");
    if (state.win == 1) {
      if (isYellow.current && isPlayer1.current) {
        status = `${player1.current.username} wins!`;
      } else {
        status = `${player2.current.username} wins!`;
      }
    } else {
      if (!isYellow.current && isPlayer1.current) {
        status = `${player1.current.username} wins!`;
      } else {
        status = `${player2.current.username} wins!`;
      }
    }
  } else {
    console.log("else   " + isYellow.current);
    console.log("yellowNext  " + yellowNext.current);
    if (yellowNext.current) {
      if (isPlayer1.current) {
        status = isYellow.current
          ? `${player1.current.username}'s turn.`
          : `${player2.current.username}'s turn.`;
      } else {
        status = isYellow.current
          ? `${player2.current.username}'s turn.`
          : `${player1.current.username}'s turn.`;
      }
    } else {
      if (isPlayer1.current) {
        status = isYellow.current
          ? `${player2.current.username}'s turn.`
          : `${player1.current.username}'s turn.`;
      } else {
        status = isYellow.current
          ? `${player1.current.username}'s turn.`
          : `${player2.current.username}'s turn.`;
      }
    }
  }
  return (
    <>
      <div className="top">
        <h1>Connect-4</h1>
      </div>
      <div className="centerDiv">
        <div className="board">
          <BoardSVG
            className={
              state.actAnimation == true ? "boardShellAct" : "boardShell"
            }
          />
          <div className="cellBoard">
            <div className="row1">
              {renderCell(0)}
              {renderCell(1)}
              {renderCell(2)}
              {renderCell(3)}
              {renderCell(4)}
              {renderCell(5)}
              {renderCell(6)}
            </div>
            <div className="row2">
              {renderCell(7)}
              {renderCell(8)}
              {renderCell(9)}
              {renderCell(10)}
              {renderCell(11)}
              {renderCell(12)}
              {renderCell(13)}
            </div>
            <div className="row3">
              {renderCell(14)}
              {renderCell(15)}
              {renderCell(16)}
              {renderCell(17)}
              {renderCell(18)}
              {renderCell(19)}
              {renderCell(20)}
            </div>
            <div className="row4">
              {renderCell(21)}
              {renderCell(22)}
              {renderCell(23)}
              {renderCell(24)}
              {renderCell(25)}
              {renderCell(26)}
              {renderCell(27)}
            </div>
            <div className="row5">
              {renderCell(28)}
              {renderCell(29)}
              {renderCell(30)}
              {renderCell(31)}
              {renderCell(32)}
              {renderCell(33)}
              {renderCell(34)}
            </div>
            <div className="row6">
              {renderCell(35)}
              {renderCell(36)}
              {renderCell(37)}
              {renderCell(38)}
              {renderCell(39)}
              {renderCell(40)}
              {renderCell(41)}
            </div>
          </div>
          <div className={getBoardAniName()}>
            <div className={state.buttonPlace} id="ani">
              <span
                className={yellowNext.current == true ? "circleR" : "circleY"}
              ></span>
            </div>
          </div>
        </div>
        <div className="statusBar">
          <h4 className="barTxt">
            {player1.current.username} vs. {player2.current.username}
          </h4>
          <h4 className="barTxt">{status}</h4>
        </div>
      </div>
    </>
  );
}

export default GameSingle;
