import * as PerudoGame from "../PerudoGame";

test('When a player bids pacos, and the next players bids pacos and increases the number of dice compared to the previous bid, then there should be no error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(1, PerudoGame.DiceFace.Paco);
    game.increaseBid(2, PerudoGame.DiceFace.Paco);

    expect(game.nextPlayerId)
        .toBe(0);
});

test('When a player bids pacos, and the next players bids pacos and does not increases the number of dice compared to the previous bid, then there should be an error', () => {
    const nbPlayers = 3;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    game.increaseBid(1, PerudoGame.DiceFace.Two);
    game.increaseBid(1, PerudoGame.DiceFace.Paco);

    expect(() => game.increaseBid(1, PerudoGame.DiceFace.Paco))
        .toThrowError(PerudoGame.ErrorMessages.BIDDING_PACOS_AFTER_A_BID_OF_PACOS)
});
