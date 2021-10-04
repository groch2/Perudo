import * as PerudoGame from "../PerudoGame";

test("10 players, but none have any dice left except for one. So the next player should always be this one, regardless of the starting player", () => {
  const nbPlayers = 10;
  const nbDicesByPlayerId = new Array(nbPlayers);
  for (let i = 0; i < nbPlayers; i++) {
    nbDicesByPlayerId.fill(0)[i] = 1;
    [...nbDicesByPlayerId.entries()]
      .filter(([nbDices]) => nbDices > 0)
      .map(([, playerId]) => playerId)
      .forEach((playerId) => {
        const actualPlayerId = PerudoGame.getNextPlayerId(
          nbDicesByPlayerId,
          playerId
        );
        expect(actualPlayerId).toBe(i);
      });
  }
});

test("if there is 2 players and the current player is 1, then the next player should be 0", () => {
  const nbDicesByPlayerId = [2, 3];
  const actualNextPlayerId = PerudoGame.getNextPlayerId(
    nbDicesByPlayerId,
    nbDicesByPlayerId.length
  );
  expect(actualNextPlayerId).toBe(0);
});
