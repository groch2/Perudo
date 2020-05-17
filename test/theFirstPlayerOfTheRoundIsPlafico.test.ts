import * as PerudoGame from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.disableThrowingDices();

test('When a player looses a dice and has more than one dice left, then he is not plafico.', () => {
    const nbDicesByPlayer = [3, 3, 1];
    const game = new PerudoGame.Game(nbDicesByPlayer);

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Four, 1);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    game.initializeNewRound();

    expect(game.currentRound.isFirstPlayerOfCurrentRoundPlafico)
        .toBe(false);
});

test('When a player looses a dice and has one dice left, then he is plafico.', () => {
    const nbDicesByPlayer = [3, 2, 1];
    const game = new PerudoGame.Game(nbDicesByPlayer);

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Four, 1);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    game.initializeNewRound();

    expect(game.currentRound.isFirstPlayerOfCurrentRoundPlafico)
        .toBe(true);
});
