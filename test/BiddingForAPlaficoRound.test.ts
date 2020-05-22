import * as PerudoGame from "../perudoGame";

test('When first player is plafico and starts by bidding pacos, then there should be no error', () => {
    const nbDicesByPlayerId = [1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.bid(1, PerudoGame.DiceFace.Paco);
});

test('When first player is plafico and starts by bidding anything but pacos, and second player bids a quantity of pacos which is less than the quantity of the first bid, then there should be an error', () => {
    const nbDicesByPlayerId = [1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);
    game.bid(3, PerudoGame.DiceFace.Two);
    expect(() => game.bid(2, PerudoGame.DiceFace.Paco))
        .toThrow(PerudoGame.ErrorMessages.BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
});
