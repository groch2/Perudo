import * as PerudoGame from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.disableThrowingDices();

test('Second players calls bluff and first player loose one dice', () => {
    const nbDicesByPlayer = [2, 3];
    const game = new PerudoGame.Game(nbPlayers, nbDicesByPlayer.slice(0));

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 2);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[0])
        .toBe(nbDicesByPlayer[0] - 1);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[1])
        .toBe(nbDicesByPlayer[1]);

    game.initializeNewRound();

    expect(game.currentRound.firstPlayerId)
        .toBe(0);
});

test('Second players calls bluff and loose one dice', () => {
    const nbDicesByPlayer = [3, 3];
    const game = new PerudoGame.Game(nbPlayers, nbDicesByPlayer.slice(0));

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 2);

    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 2);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[0])
        .toBe(nbDicesByPlayer[0]);
    expect(game.currentRound.nbDicesOfEachPlayerByPlayerId[1])
        .toBe(nbDicesByPlayer[1] - 1);

    game.initializeNewRound();

    expect(game.currentRound.firstPlayerId)
        .toBe(1);
});
