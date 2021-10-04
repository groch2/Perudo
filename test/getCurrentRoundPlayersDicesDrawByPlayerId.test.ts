import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("When no dice is on a particular face, then that dice face should not appear in the detail of the dice draw of the current round by player", () => {
  const nbDicesByPlayer = [1, 0];
  for (
    let diceFaceIndexA = 0;
    diceFaceIndexA < PerudoGame.diceFacesNames.length;
    diceFaceIndexA++
  ) {
    const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));
    game.currentRound.playersDicesDrawByPlayerId[0].set(diceFaceIndexA, 1);

    const diceFaces = game.currentRoundPlayersDicesDrawByPlayerId.reduce(
      (state, item) => {
        item
          .map(([diceFace]) => diceFace)
          .forEach((diceFace) => state.add(diceFace));
        return state;
      },
      new Set()
    );
    expect(diceFaces.size).toBe(1);
    expect([...diceFaces.values()][0]).toBe(
      PerudoGame.diceFacesNames[diceFaceIndexA]
    );
  }
});
