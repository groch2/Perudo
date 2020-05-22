import * as PerudoGame from "../perudoGame";

test('When a player bids pacos, and the next players bids pacos and increases the number of dice compared to the previous bid, then there should be no error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.bid(1, PerudoGame.DiceFace.Two);
    game.bid(1, PerudoGame.DiceFace.Paco);
    game.bid(2, PerudoGame.DiceFace.Paco);

    expect(game.nextPlayerId)
        .toBe(0);
});

test('When a player bids pacos, and the next players bids pacos and does not increases the number of dice compared to the previous bid, then there should be an error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.bid(1, PerudoGame.DiceFace.Two);
    game.bid(1, PerudoGame.DiceFace.Paco);

    expect(() => game.bid(1, PerudoGame.DiceFace.Paco))
        .toThrowError(PerudoGame.ErrorMessages.BIDDING_PACOS_AFTER_A_BID_OF_PACOS)
});
