import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("Second players calls bluff and first player loose one dice", () => {
  const nbDicesByPlayer = [2, 3];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Four,
    1
  );

  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Two,
    2
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Four,
    1
  );

  game.bid(3, PerudoGame.DiceFace.Four);
  game.callBluff();

  expect(game.currentRound.nbDicesByPlayer[0]).toBe(nbDicesByPlayer[0] - 1);
  expect(game.currentRound.nbDicesByPlayer[1]).toBe(nbDicesByPlayer[1]);

  expect(game.currentRound.nextPlayerId).toBe(0);
});

test("Second players calls bluff and loose one dice", () => {
  const nbDicesByPlayer = [3, 3];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Four,
    2
  );

  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Four,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Two,
    2
  );

  game.bid(3, PerudoGame.DiceFace.Four);
  game.callBluff();

  expect(game.currentRound.nbDicesByPlayer[0]).toBe(nbDicesByPlayer[0]);
  expect(game.currentRound.nbDicesByPlayer[1]).toBe(nbDicesByPlayer[1] - 1);

  expect(game.currentRound.nextPlayerId).toBe(1);
});
