import * as PerudoGame from "../PerudoGame";

test('Get turn number', () => {
    const nbPlayers = 3;
    PerudoGame.disableThrowingDices();

    const game = new PerudoGame.Game(nbPlayers);
    const nbTurnsToPlay = 7;

    for (let i = 0; i < nbTurnsToPlay; i++) {
        expect(game.currentRound.turnNumber)
            .toBe(i);

        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: i + 1 });
    }

    expect(game.currentRound.turnNumber)
        .toBe(nbTurnsToPlay);
});
