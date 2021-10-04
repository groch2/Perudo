import * as PerudoGame from "../perudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("When there is only 2 players left, and the first player looses his last dice, then the game should be over", () => {
  const nbDicesByPlayer = [1, 1];
  const game = new PerudoGame.Game(nbDicesByPlayer);

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    1
  );
  game.currentRound.playersDicesDrawByPlayerId[1].set(
    PerudoGame.DiceFace.Three,
    1
  );

  game.bid(1, PerudoGame.DiceFace.Four);
  game.callBluff();

  expect(game.isOver).toBe(true);
});

test("When there is only one player with some dices left and the method to increase the bid is called, then there should be an error", () => {
  const nbDicesByPlayer = [1, 0];
  const game = new PerudoGame.Game(nbDicesByPlayer);

  expect(() => game.bid(1, PerudoGame.DiceFace.Four)).toThrow(
    PerudoGame.ErrorMessages.GAME_OVER
  );
});

test("When there is only one player with some dices left and the method to call bluff is called, then there should be an error", () => {
  const nbDicesByPlayer = [1, 0];
  const game = new PerudoGame.Game(nbDicesByPlayer);

  expect(() => game.callBluff()).toThrow(PerudoGame.ErrorMessages.GAME_OVER);
});

test("When there is only one player with some dices left and the method to call exact match is called, then there should be an error", () => {
  const nbDicesByPlayer = [1, 0];
  const game = new PerudoGame.Game(nbDicesByPlayer);

  expect(() => game.callExactMatch()).toThrow(
    PerudoGame.ErrorMessages.GAME_OVER
  );
});
