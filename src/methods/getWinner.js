export default function getWinner(playerHealth, DragonHealth, name) {
  if (playerHealth === DragonHealth) {
    return null;
  } else if (playerHealth > DragonHealth) {
    return name.playerName;
  } else {
    return name.DragonName;
  }
}
