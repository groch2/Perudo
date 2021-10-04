import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("If the second players looses the round and is out of dice and the third player has at least one dice, then the third player is the first player of the next round", () => {
  const nbDicesByPlayer = [2, 1, 1];
  const game = new PerudoGame.Game([...nbDicesByPlayer]);

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    nbDicesByPlayer[0]
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    nbDicesByPlayer[1]
  );
  game.currentRound.playersDicesDrawByPlayerId[2].set(
    PerudoGame.DiceFace.Four,
    nbDicesByPlayer[2]
  );

  game.bid(2, PerudoGame.DiceFace.Two);
  game.bid(3, PerudoGame.DiceFace.Two);
  game.callBluff();

  expect(game.currentRound.nbDicesByPlayer[0]).toBe(nbDicesByPlayer[0]);
  expect(game.currentRound.nbDicesByPlayer[1]).toBe(0);
  expect(game.currentRound.nbDicesByPlayer[2]).toBe(nbDicesByPlayer[2]);

  expect(game.currentRound.nextPlayerId).toBe(2);
});

test("If the second players looses the round and is out of dice and the third player does not have any dice left and the fourth player has at least one dice, then the fourth player is the first player of the next round", () => {
  const nbDicesByPlayer = [2, 1, 0, 1];
  const game = new PerudoGame.Game([...nbDicesByPlayer]);

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    nbDicesByPlayer[0]
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    nbDicesByPlayer[1]
  );
  game.currentRound.playersDicesDrawByPlayerId[3].set(
    PerudoGame.DiceFace.Four,
    nbDicesByPlayer[3]
  );

  game.bid(2, PerudoGame.DiceFace.Two);
  game.bid(3, PerudoGame.DiceFace.Two);
  game.callBluff();

  expect(game.currentRound.nbDicesByPlayer[0]).toBe(nbDicesByPlayer[0]);
  expect(game.currentRound.nbDicesByPlayer[1]).toBe(0);
  expect(game.currentRound.nbDicesByPlayer[3]).toBe(nbDicesByPlayer[3]);

  expect(game.currentRound.nextPlayerId).toBe(3);
});
