import * as PerudoGame from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.disableThrowingDices();

(function () {
    const game = new PerudoGame.Game(nbPlayers);

    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Two, 2);
    game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Three, 3);

    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Four, 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Five, 2);

    console.log(game.currentRoundPlayersDicesDrawByPlayerIdByPositiveDiceFaceNumber);
    console.log(game.currentRound.totalNbDicesByFaceIndex);
    console.log(game.currentRound.totalPositiveNbDicesByFaceName);
})();
