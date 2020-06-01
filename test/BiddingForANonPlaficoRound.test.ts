import * as PerudoGame from "../perudoGame";

test('When first player is not plafico and starts by bidding pacos, then there should be an error', () => {
    const nbDicesByPlayerId = [2, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    expect(() => game.bid(1, PerudoGame.DiceFace.Paco))
        .toThrow(PerudoGame.ErrorMessages.START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS);
    expect(game.nextPlayerId).toBe(0);
});

test('When first player is not plafico and starts by anything but pacos, then there should be no error', () => {
    const nbDicesByPlayerId = [2, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    for (let diceFace: PerudoGame.DiceFace = PerudoGame.DiceFace.Two; diceFace < PerudoGame.diceFacesNames.length; diceFace++) {
        game.bid(1, diceFace);
    }
});

test('Player bids and turn changes to next player', () => {
    const nbDicesByPlayerId = [3, 3];
    PerudoGame.disableThrowingDices();
    const game = new PerudoGame.Game(nbDicesByPlayerId);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 3);

    game.bid(3, PerudoGame.DiceFace.Two);

    game.callBluff();
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 2);

    expect(game.nextPlayerId).toBe(1);

    game.bid(3, PerudoGame.DiceFace.Two);
    expect(game.nextPlayerId).toBe(0);
});
