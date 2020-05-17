import * as PerudoGame from "../PerudoGame";

test('When first player is plafico and starts by bidding pacos, then there should be no error', () => {
    const nbDicesByPlayerId = [1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 1 });
});

test('When first player is plafico and starts by bidding anything but pacos, and second player bids a quantity of pacos which is at least half the quantity of the first bid, then there should be an error', () => {
    const nbDicesByPlayerId = [1, 1];
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    for (let diceFace: PerudoGame.DiceFace = PerudoGame.DiceFace.Two; diceFace < PerudoGame.diceFacesNames.length; diceFace++) {
        game.playerPlays({ diceFace, diceQuantity: 3 });
        expect(() => game.playerPlays({ diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 2 }))
            .toThrow(PerudoGame.ErrorMessages.BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
    }
});
