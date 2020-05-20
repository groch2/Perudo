import * as PerudoGame from "../PerudoGame";

test('When a player bids pacos, and the next players bids non pacos and bids twice the quantity of the previous bid plus one, then there should be no error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(1, PerudoGame.DiceFace.Paco);
    game.increaseBid(3, PerudoGame.DiceFace.Two);

    expect(game.nextPlayerId)
        .toBe(0);
});

test('When a player bids pacos, and the next players bids non pacos and bids exactly twice the quantity of the previous bid, then there should be an error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(1, PerudoGame.DiceFace.Paco);
    expect(() => game.increaseBid(2, PerudoGame.DiceFace.Two))
        .toThrowError(PerudoGame.ErrorMessages.BIDDING_NON_PACOS_AFTER_A_BID_OF_PACOS);
});
