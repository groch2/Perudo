import * as PerudoGame from "../perudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test('When first player bids on a dice face other than paco, and then second players increase the bid on the same dice face, then there should be no error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(2, PerudoGame.DiceFace.Two);
});

test('When first player bids on a dice face other than paco, and then second players uses a higher dice face and does not increase the bid, then there should be no error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(1, PerudoGame.DiceFace.Three);
});

test('When first player bids on a dice face other than paco, and then second players increases the quantity and uses a higher dice face, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    expect(() => game.increaseBid(2, PerudoGame.DiceFace.Three))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players does not increase the dice quantity and does not changes the dice face, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);
    const diceBid = { diceFace: PerudoGame.DiceFace.Two, diceQuantity: 1 };

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    expect(() => game.increaseBid(1, PerudoGame.DiceFace.Two))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players uses a lower dice face and increases the quantity, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(1, PerudoGame.DiceFace.Three);
    expect(() => game.increaseBid(2, PerudoGame.DiceFace.Two))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players decreases the quantity and uses a higher dice face, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(2, PerudoGame.DiceFace.Two);
    expect(() => game.increaseBid(1, PerudoGame.DiceFace.Three))
        .toThrow();
});

test('When first player bids on a dice face other than paco, and then second players decreases the quantity and uses a lower dice face, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.increaseBid(2, PerudoGame.DiceFace.Three);
    expect(() => game.increaseBid(1, PerudoGame.DiceFace.Two))
        .toThrow();
});
