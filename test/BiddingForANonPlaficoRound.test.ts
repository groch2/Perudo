import * as PerudoGame from "../perudoGame";

test('When first player is not plafico and starts by bidding pacos, then there should be an error', () => {
    const nbDicesByPlayerId = [2, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    expect(() => game.bid(1, PerudoGame.DiceFace.Paco))
        .toThrow(PerudoGame.ErrorMessages.START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS);
});

test('When first player is not plafico and starts by anything but pacos, then there should be no error', () => {
    const nbDicesByPlayerId = [2, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId);

    for (let diceFace: PerudoGame.DiceFace = PerudoGame.DiceFace.Two; diceFace < PerudoGame.diceFacesNames.length; diceFace++) {
        game.bid(1, diceFace);
    }
});
