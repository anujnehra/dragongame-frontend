import React, { useReducer, useEffect, useRef } from "react";
import "../../style/Game.scss";
import HealthBox from "./HealthBox";
import ControlBox from "./ControlBox";
import CommentaryBox from "./CommentaryBox";
import PopUp from "../PopUp";
import Button from "../Button";
import actionMethod from "../../methods/actionMethods";
import doActionReducer from "../../reducer/doActionReducer";
import Header from "../Header";
import { useAuthe } from "../../hooks/authe";
import useFetchUser from "../../hooks/useFetchUser";
import Loader from "../Loader";
import ellipsisString from "../../utils/ellipsisString";
import { useGame } from "../../hooks/game";
import useQuery from "../../hooks/useQuery";
import Countdown from "react-countdown";

let { attack, blast, heal } = actionMethod;

let initialState = {
  name: {
    playerName: "",
    DragonName: "",
  },
  playerHealth: 100,
  DragonHealth: 100,
  win: false,
  winner: null,
  actionList: [],
};

function Game() {
  let [gameState, gameDispatch] = useReducer(doActionReducer, initialState);
  let as = useQuery().get("as");
  let authe = useAuthe();
  let { user } = useFetchUser(false, as);
  let { game, setGame } = useGame();
  let popUpRef = useRef(null);
  let DragonName = "Dragon";

  let doAction = (actionFun, actionName) => {
    let playerActionValue = actionFun();
    let DragonActionValue = actionFun();
    gameDispatch({
      type: actionName,
      payload: {
        actionName,
        playerActionValue,
        DragonActionValue,
      },
    });
  };

  let handelAction = (e) => {
    switch (e.target.name) {
      case "attack":
        doAction(attack, "attack");
        break;
      case "blast":
        doAction(blast, "blast");
        break;
      case "heal":
        doAction(heal, "heal");
        break;
      case "giveup":
      case "play-again":
        gameDispatch({
          type: "giveup",
          payload: {
            ...initialState,
            name: {
              playerName: user ? user.name : "",
              DragonName: DragonName,
            },
          },
        });
        break;

      default:
        throw new Error("SomeThing Wrong....");
    }
  };

  useEffect(() => {
    if ((user || as) && !gameState.name.playerName) {
      gameDispatch({
        type: "name",
        payload: {
          playerName: user ? user.name : "Guest",
          DragonName: DragonName,
        },
      });
    }

    if (gameState.win && as !== "guest") {
      let t = new Date();
      let YYYY = t.getFullYear();
      let MM = (t.getMonth() + 1 < 10 ? "0" : "") + (t.getMonth() + 1);
      let DD = (t.getDate() < 10 ? "0" : "") + t.getDate();
      let HH = (t.getHours() < 10 ? "0" : "") + t.getHours();
      let mm = (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
      let ss = (t.getSeconds() < 10 ? "0" : "") + t.getSeconds();

      let time_of_call =
        YYYY + "-" + MM + "-" + DD + " " + HH + ":" + mm + ":" + ss;

      (async () => {
        let res = await fetch("/games/add.json", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: authe.getAuthe(),
          },
          body: JSON.stringify({
            winner: gameState.winner || "Tie",
            date: time_of_call,
            user_id: user.id,
          }),
        });
        if (res.status === 201) {
          let result = await res.json();
        }
        if (res.status === 401) {
          authe.removeAuthe();
        }
      })();
    }
    let timerId = setTimeout(() => {
      if (gameState.win) {
        popUpRef.current.style.opacity = 1;
      }
    }, 400);
    return () => {
      clearTimeout(timerId);
    };
  }, [gameState.win, user, as]);

  const Completionist = () => <span>Time out last result inserted</span>;

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      let t = new Date();
      let YYYY = t.getFullYear();
      let MM = (t.getMonth() + 1 < 10 ? "0" : "") + (t.getMonth() + 1);
      let DD = (t.getDate() < 10 ? "0" : "") + t.getDate();
      let HH = (t.getHours() < 10 ? "0" : "") + t.getHours();
      let mm = (t.getMinutes() < 10 ? "0" : "") + t.getMinutes();
      let ss = (t.getSeconds() < 10 ? "0" : "") + t.getSeconds();

      let time_of_call =
        YYYY + "-" + MM + "-" + DD + " " + HH + ":" + mm + ":" + ss;

      (async () => {
        let res = await fetch("/games/add.json", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: authe.getAuthe(),
          },
          body: JSON.stringify({
            winner:
              gameState.playerHealth > gameState.DragonHealth
                ? user.name
                : gameState.playerHealth < gameState.DragonHealth
                ? "Dragon"
                : "Tie",
            date: time_of_call,
            user_id: user.id,
          }),
        });
        if (res.status === 201) {
          let result = await res.json();
        }
        if (res.status === 401) {
          authe.removeAuthe();
        }
      })();

      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return <span>Timer {seconds}</span>;
    }
  };

  return (
    <div className="page game-page">
      <Countdown date={Date.now() + 59000} renderer={renderer} />
      <Header />
      {!user && as === null ? (
        <Loader height={70} width={6} margin={4} />
      ) : (
        <main className="game-container">
          <div className="game">
            <HealthBox
              playerName={user ? user.name : "Guest"}
              DragonName={DragonName}
              playerHealth={gameState.playerHealth}
              DragonHealth={gameState.DragonHealth}
              className="item item1"
            ></HealthBox>

            <div className="item item2">
              <ControlBox onAction={handelAction} disabled={gameState.win} />
            </div>

            <CommentaryBox
              className="item item3"
              commentaryList={gameState.actionList}
            />

            <PopUp
              className="result-pop-up"
              ref={popUpRef}
              show={gameState.win}
            >
              <h3 className="pop-up-text">
                {gameState.winner
                  ? `${ellipsisString(gameState.winner, 0, 13)} Win`
                  : "Tie"}
              </h3>

              <Button
                className="secondary-btn"
                name="play-again"
                onClick={handelAction}
              >
                Play Again
              </Button>
            </PopUp>
          </div>
        </main>
      )}
    </div>
  );
}

export default Game;
