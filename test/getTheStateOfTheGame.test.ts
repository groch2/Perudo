import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test("When no dice is on a particular face, then that dice face should not appear in the total of positive nb of dices by face name", () => {
  const nbDicesByPlayer = [1, 0];
  for (
    let diceFaceIndexA = 0;
    diceFaceIndexA < PerudoGame.diceFacesNames.length;
    diceFaceIndexA++
  ) {
    const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));
    game.currentRound.playersDicesDrawByPlayerId[0].set(diceFaceIndexA, 1);

    for (
      let diceFaceIndexB = 0;
      diceFaceIndexB < PerudoGame.diceFacesNames.length;
      diceFaceIndexB++
    ) {
      if (diceFaceIndexB === diceFaceIndexA) continue;
      const isDiceFaceB_Present =
        game.currentRound.totalOfPositiveNbOfDicesByFaceName.some(
          ([diceFace]) => diceFace === PerudoGame.DiceFace[diceFaceIndexB]
        );
      expect(isDiceFaceB_Present).toBe(false);
    }
  }
});

test("nbDicesOfNextPlayer should return the number of dices of the next player", () => {
  const nbPlayers = 3;
  const nbDicesByPlayer = [...new Array(nbPlayers).fill(0).keys()].map(
    (n) => n + 1
  );
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));
  for (let i = 0; i < nbPlayers; i++) {
    expect(game.nbDicesOfNextPlayer).toBe(nbDicesByPlayer[i]);
    game.bid(i + 1, PerudoGame.DiceFace.Two);
  }
});

test("nbDicesOfOtherPlayersThanTheNextPlayer should return the total number of dices on the table minus the number of dices of the current player", () => {
  const nbPlayers = 3;
  const nbDicesByPlayer = [...new Array(nbPlayers).fill(0).keys()].map(
    (n) => n + 1
  );
  const totalNbDices = nbDicesByPlayer.reduce((a, b) => a + b);
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));
  for (let i = 0; i < nbPlayers; i++) {
    expect(game.nbDicesOfOtherPlayersThanTheNextPlayer).toBe(
      totalNbDices - nbDicesByPlayer[i]
    );
    game.bid(i + 1, PerudoGame.DiceFace.Two);
  }
});

test("nextPlayerDices should return the detail of the dices of the next player", () => {
  const nbDicesByPlayer = [1, 3];
  const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

  game.currentRound.playersDicesDrawByPlayerId[0].set(
    PerudoGame.DiceFace.Two,
    1
  );

  const dicesDetailOfPlayer2 = [
    [PerudoGame.DiceFace.Three, 2],
    [PerudoGame.DiceFace.Four, 1],
    [PerudoGame.DiceFace.Six, 3],
  ];

  for (let [diceFace, diceQuantity] of dicesDetailOfPlayer2) {
    game.currentRound.playersDicesDrawByPlayerId[1].set(diceFace, diceQuantity);
  }

  game.bid(1, PerudoGame.DiceFace.Two);

  const expected = dicesDetailOfPlayer2.map(([diceFace, diceQuantity]) => [
    PerudoGame.diceFacesNames[diceFace],
    diceQuantity,
  ]);
  expect(game.nextPlayerDices).toStrictEqual(expected);
});
