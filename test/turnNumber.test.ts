import * as PerudoGame from "../PerudoGame";

test("Get turn number", () => {
  const nbPlayers = 3;
  PerudoGame.disableThrowingDices();

  const game = new PerudoGame.Game(nbPlayers);
  const nbTurnsToPlay = 7;

  for (let i = 0; i < nbTurnsToPlay; i++) {
    expect(game.currentRound.turnNumber).toBe(i);

    game.bid(i + 1, PerudoGame.DiceFace.Two);
  }

  expect(game.currentRound.turnNumber).toBe(nbTurnsToPlay);
});
