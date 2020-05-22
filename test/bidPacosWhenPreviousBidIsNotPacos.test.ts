import * as PerudoGame from "../PerudoGame";

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is half the previous bid quantity, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.bid(4, PerudoGame.DiceFace.Two);
    game.bid(2, PerudoGame.DiceFace.Paco);
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is less than half the previous bid quantity, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.bid(4, PerudoGame.DiceFace.Two);
    expect(() => game.bid(1, PerudoGame.DiceFace.Paco))
        .toThrow(PerudoGame.ErrorMessages.BID_PACO_AFTER_NON_PACO);
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is half the previous bid quantity rounded up, then there should be no error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.bid(5, PerudoGame.DiceFace.Two);
    game.bid(3, PerudoGame.DiceFace.Paco);
});

test('When first player bids on a dice face other than paco, and then second players bids a number of pacos that is less than half the previous bid quantity rounded up, then there should be an error', () => {
    PerudoGame.disableThrowingDices();

    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    game.bid(5, PerudoGame.DiceFace.Two);
    expect(() => game.bid(2, PerudoGame.DiceFace.Paco))
        .toThrow(PerudoGame.ErrorMessages.BID_PACO_AFTER_NON_PACO);
});
