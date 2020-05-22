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

test('When first player is plafico and starts by bidding other dice face than paco, and then the second player ends the round by calling exact match, then the pacos should not count as joker when counting the number of dices that match the bid, so the second player should have lost a dice', () => {
    PerudoGame.disableThrowingDices();

    const nbDicesByPlayerId = [1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);
    
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 1);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 1);

    game.bid(2, PerudoGame.DiceFace.Two);
    game.callExactMatch();

    expect(game.nbDicesByPlayerId[1])
        .toBe(0);
});