import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test('Third player calls exact match and looses one dice', () => {
    const nbDicesByPlayer = [3, 3, 2];
    const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 2);

    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 2);

    game.currentRound.playersDicesDrawByPlayerId[2].set(PerudoGame.DiceFace.Four, 2);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 4 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 5 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);

    for (let playerId = 0; playerId < 2; playerId++) {
        expect(game.currentRound.nbDicesByPlayer[playerId])
            .toBe(nbDicesByPlayer[playerId]);
    }
    expect(game.currentRound.nbDicesByPlayer[2])
        .toBe(nbDicesByPlayer[2] - 1);
});

test('Second players calls exact match and wins one dice', () => {
    const nbDicesByPlayer = [3, 3, 2];
    const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 2);

    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 2);

    game.currentRound.playersDicesDrawByPlayerId[2].set(PerudoGame.DiceFace.Four, 2);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 3 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 4 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);

    for (let playerId = 0; playerId < 2; playerId++) {
        expect(game.currentRound.nbDicesByPlayer[playerId])
            .toBe(nbDicesByPlayer[playerId]);
    }
    expect(game.currentRound.nbDicesByPlayer[2])
        .toBe(nbDicesByPlayer[2] + 1);
});

test('Second players calls exact match and does not win any dice, because he already has the maximum number of dices by player', () => {
    const nbDicesByPlayer = [3, 3, PerudoGame.nbStartingDicesByPlayer];
    const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 2);

    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Paco, 1);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 2);

    game.currentRound.playersDicesDrawByPlayerId[2].set(PerudoGame.DiceFace.Four, PerudoGame.nbStartingDicesByPlayer);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 3 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 4 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);

    for (let playerId = 0; playerId < 2; playerId++) {
        expect(game.currentRound.nbDicesByPlayer[playerId])
            .toBe(nbDicesByPlayer[playerId]);
    }
    expect(game.currentRound.nbDicesByPlayer[2])
        .toBe(nbDicesByPlayer[2]);
});
