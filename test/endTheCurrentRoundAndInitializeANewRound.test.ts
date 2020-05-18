import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test('If the current player call bluff, then the current round ends, and a new round beggins.', () => {
    const nbRoundsToPlay = 3;
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    for (let i = 0; i < nbRoundsToPlay; i++) {
        expect(game.currentRoundNumber)
            .toBe(i);

        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 });
        game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);
    }

    expect(game.currentRoundNumber)
        .toBe(nbRoundsToPlay);
});

test('If the current player call exact match, then the current round ends, and a new round beggins.', () => {
    const nbRoundsToPlay = 3;
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    for (let i = 0; i < nbRoundsToPlay; i++) {
        expect(game.currentRoundNumber)
            .toBe(i);

        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 });
        game.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);
    }

    expect(game.currentRoundNumber)
        .toBe(nbRoundsToPlay);
});
