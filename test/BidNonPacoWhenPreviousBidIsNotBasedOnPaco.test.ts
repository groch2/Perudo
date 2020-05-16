import * as PerudoGame from "../PerudoGame";

test('When first player bids on a dice face other than paco, and then second players increase the bid on the same dice face, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
});

test('When first player bids on a dice face other than paco, and then second players uses a higher dice face and does not increase the bid, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 1 });
});

test('When first player bids on a dice face other than paco, and then second players increases the quantity and uses a higher dice face, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 2 }))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players does not increase the dice quantity and does not changes the dice face, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);
    const diceBid = { diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 };

    game.playerPlays(diceBid);
    expect(() => game.playerPlays(diceBid))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players uses a lower dice face and increases the quantity, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 1 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 }))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players decreases the quantity and uses a higher dice face, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 1 }))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players decreases the quantity and uses a lower dice face, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Three, diceQuantity: 2 });
    expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 }))
        .toThrow();
});
