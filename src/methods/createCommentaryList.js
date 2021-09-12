export let createCommentaryList = (list) => {
  return list.map(({ player, Dragon }) => {
    return `${player.playerName} ${player.actionName} with ${player.actionValue} and ${Dragon.DragonName} ${Dragon.actionName} with ${Dragon.actionValue}`;
  });
};
