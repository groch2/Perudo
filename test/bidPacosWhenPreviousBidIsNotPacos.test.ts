import * as PerudoGame from "../PerudoGame";

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is half the previous bid quantity, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 2 });
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is less than half the previous bid quantity, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 1 }))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is half the previous bid quantity rounded up, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 5 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 3 });
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is less than half the previous bid quantity rounded up, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 5 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 2 }))
        .toThrow();
});
