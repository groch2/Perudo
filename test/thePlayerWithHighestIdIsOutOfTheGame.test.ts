import * as PerudoGame from "../PerudoGame";

test('When there is n players, and the player with id (n - 2) plays, and the player with id (n - 1) is out of the game, then the next player should be the player with id 0', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    nbDicesByPlayerId[nbDicesByPlayerId.length - 1] = 0;
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    for (let i = 1; i < nbDicesByPlayerId.length - 1; i++) {
        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: i });

        const expectedPlayerId = i;
        expect(game.nextPlayerId)
            .toBe(expectedPlayerId);
    }

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: nbDicesByPlayerId.length - 1 });

    expect(game.nextPlayerId)
        .toBe(0);
});