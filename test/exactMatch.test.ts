import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("Third player calls exact match and looses one dice", () => {
  const nbDicesByPlayer = [3, 3, 2];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[2].set(
    PerudoGame.DiceFace.Four,
    2
  );

  game.bid(4, PerudoGame.DiceFace.Four);
  game.bid(5, PerudoGame.DiceFace.Four);
  game.callExactMatch();

  for (let playerId = 0; playerId < 2; playerId++) {
    expect(game.currentRound.nbDicesByPlayer[playerId]).toBe(
      nbDicesByPlayer[playerId]
    );
  }
  expect(game.currentRound.nbDicesByPlayer[2]).toBe(nbDicesByPlayer[2] - 1);
});

test("Second players calls exact match and wins one dice", () => {
  const nbDicesByPlayer = [3, 3, 2];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[2].set(
    PerudoGame.DiceFace.Four,
    2
  );

  game.bid(3, PerudoGame.DiceFace.Four);
  game.bid(4, PerudoGame.DiceFace.Four);
  game.callExactMatch();

  for (let playerId = 0; playerId < 2; playerId++) {
    expect(game.currentRound.nbDicesByPlayer[playerId]).toBe(
      nbDicesByPlayer[playerId]
    );
  }
  expect(game.currentRound.nbDicesByPlayer[2]).toBe(nbDicesByPlayer[2] + 1);
});

test("Second players calls exact match and does not win any dice, because he already has the maximum number of dices by player", () => {
  const nbDicesByPlayer = [3, 3, PerudoGame.nbStartingDicesByPlayer];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Paco,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[2].set(
    PerudoGame.DiceFace.Four,
    PerudoGame.nbStartingDicesByPlayer
  );

  game.bid(3, PerudoGame.DiceFace.Three);
  game.bid(4, PerudoGame.DiceFace.Three);
  game.callExactMatch();

  for (let playerId = 0; playerId < 2; playerId++) {
    expect(game.currentRound.nbDicesByPlayer[playerId]).toBe(
      nbDicesByPlayer[playerId]
    );
  }
  expect(game.currentRound.nbDicesByPlayer[2]).toBe(nbDicesByPlayer[2]);
});

test("Second player calls exact match and looses one dice and is eliminated", () => {
  const nbDicesByPlayer = [2, 1];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    2
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    1
  );

  game.bid(2, PerudoGame.DiceFace.Three);
  game.callExactMatch();

  expect(game.isOver).toBe(true);
});
