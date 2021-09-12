import checkGameOver from "../methods/checkGameOver";
import getWinner from "../methods/getWinner";
import ellipsisString from "../utils/ellipsisString";

export default function doActionReducer(state, { type, payload }) {
  let newPlayerHealth = null;
  let newDragonHealth = null;

  if (type === "attack" || type === "blast") {
    newPlayerHealth = state.playerHealth - payload.DragonActionValue;

    newDragonHealth = state.DragonHealth - payload.playerActionValue;

    newPlayerHealth < 0 && (newPlayerHealth = 0);
    newDragonHealth < 0 && (newDragonHealth = 0);
  }
  if (type === "heal") {
    newPlayerHealth =
      state.playerHealth +
      payload.playerActionValue -
      payload.DragonActionValue;

    newDragonHealth = state.DragonHealth;

    newPlayerHealth < 0 && (newPlayerHealth = 0);
    newPlayerHealth > 100 && (newPlayerHealth = 100);
  }

  switch (type) {
    case "attack":
    case "blast":
      return {
        ...state,
        playerHealth: newPlayerHealth,
        DragonHealth: newDragonHealth,
        win: checkGameOver(newPlayerHealth, newDragonHealth),
        winner: getWinner(newPlayerHealth, newDragonHealth, { ...state.name }),
        actionList: modifyActionList([...state.actionList], payload, {
          ...state.name,
        }),
      };
    case "heal":
      return {
        ...state,
        playerHealth: newPlayerHealth,
        DragonHealth: newDragonHealth,
        win: checkGameOver(newPlayerHealth, newDragonHealth),
        winner: getWinner(newPlayerHealth, newDragonHealth, { ...state.name }),
        actionList: modifyActionList([...state.actionList], payload, {
          ...state.name,
        }),
      };

    case "giveup":
      return {
        ...payload,
      };

    case "name":
      return {
        ...state,
        name: { ...payload },
      };

    default:
      return state;
  }
}

function modifyActionList(currentList, payload, name) {
  return [
    ...currentList,
    {
      player: {
        actionName: payload.actionName,
        actionValue: payload.playerActionValue,
        playerName: ellipsisString(name.playerName, 0, 13),
      },
      Dragon: {
        actionName:
          payload.actionName === "heal" ? "attack" : payload.actionName,
        actionValue: payload.DragonActionValue,
        DragonName: ellipsisString(name.DragonName, 0, 13),
      },
    },
  ];
}
