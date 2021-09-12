export default function checkGameOver(playerHealth, DragonHealth) {
  if (playerHealth === 0 || DragonHealth === 0) {
    return true;
  }

  return false;
}
