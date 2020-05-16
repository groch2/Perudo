import * as PerudoGame from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.disableThrowingDices();

(function secondPlayerLoosesTheRoundAndIsOutOfDice() {
    const game = new PerudoGame.Game(nbPlayers);

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 2);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Three, 3);

    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Four, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Five, 2);

    const onlyPositiveDiceQuantityByFaceByPlayer =
        game
            .getDicesFacesOfCurrentRoundByPlayerId()
            .map(diceDraw => [...diceDraw.entries()].filter(([, quantity]) => quantity > 0));
    const diceDrawByPlayerIdWithDiceFaceNames =
        onlyPositiveDiceQuantityByFaceByPlayer
            .map(diceDraw => diceDraw.map(([diceFace, diceQuantity]) => [PerudoGame.diceFacesNames[diceFace], diceQuantity]))
    console.log(diceDrawByPlayerIdWithDiceFaceNames);
})();
