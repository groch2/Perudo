import * as PerudoGame from "../PerudoGame";

test('Second players looses the round and is out of dice', () => {
    PerudoGame.disableThrowingDices();

    const nbDicesByPlayer = [2, 1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayer.length, nbDicesByPlayer);

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, nbDicesByPlayer[0]);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, nbDicesByPlayer[1]);
    game.currentRound.playersDicesDrawByPlayerId[2].set(PerudoGame.DiceFace.Four, nbDicesByPlayer[2]);

    console.debug(game.getDicesFacesOfCurrentRoundByPlayerId());

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[0])
        .toBe(nbDicesByPlayer[0]);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[1])
        .toBe(0);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[2])
        .toBe(nbDicesByPlayer[2]);

    game.initializeNewRound();

    expect(game.currentRound.firstPlayerId)
        .toBe(2);
});
