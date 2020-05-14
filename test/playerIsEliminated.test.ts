import * as PerudoGame from "../PerudoGame";

test('Second players looses the round and is out of dice', () => {
    PerudoGame.disableThrowingDices();

    const nbDicesByPlayer = [2, 1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayer.length, nbDicesByPlayer);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], nbDicesByPlayer[0]);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], nbDicesByPlayer[1]);
    game.currentRound.playersDicesDrawByPlayerId[2].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], nbDicesByPlayer[2]);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[0])
        .toBe(nbDicesByPlayer[0]);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[1])
        .toBe(0);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[2]).toBe(nbDicesByPlayer[2]);

    game.initializeNewRound();

    console.log({ firstPlayerOfSecondRound: game.currentRound.firstPlayerId });

    expect(game.currentRound.firstPlayerId)
        .toBe(2);
});
