import * as PerudoGame from "../PerudoGame";

test('Get turn number', () => {
    const nbPlayers = 3;
    PerudoGame.disableThrowingDices();

    const game = new PerudoGame.Game(nbPlayers);
    const nbTurnsToPlay = 7;
    let diceQuantityOfBid = 1;

    for (let expectedTurnNumber = 0; expectedTurnNumber < nbTurnsToPlay; expectedTurnNumber++) {
        expect(game.currentRound.getTurnNumber())
            .toBe(expectedTurnNumber);

        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: diceQuantityOfBid });

        diceQuantityOfBid++;
    }

    expect(game.currentRound.getTurnNumber())
        .toBe(nbTurnsToPlay);

    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    expect(game.currentRound.getTurnNumber())
        .toBe(nbTurnsToPlay);
});
