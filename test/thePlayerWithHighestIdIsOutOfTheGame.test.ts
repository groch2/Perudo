import * as PerudoGame from "../PerudoGame";

test('When there is n players, and the player with id (n - 2) plays, and the player with id (n - 1) is out of the game, then the next player should be the player with id 0', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 3;
    const nbDicesByPlayer = new Array(nbPlayers).fill(2);
    nbDicesByPlayer[nbDicesByPlayer.length - 1] = 0;
    const game = new PerudoGame.Game(nbDicesByPlayer);

    for (let i = 1; i < nbDicesByPlayer.length - 1; i++) {
        game.increaseBid(i, PerudoGame.DiceFace.Two);

        const expectedPlayerId = i;
        expect(game.nextPlayerId)
            .toBe(expectedPlayerId);
    }

    game.increaseBid(PerudoGame.DiceFace.Two, nbDicesByPlayer.length - 1);

    expect(game.nextPlayerId)
        .toBe(0);
});