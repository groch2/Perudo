import * as PerudoGame from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.disableThrowingDices();

(function secondPlayerLoosesTheRoundAndIsOutOfDice() {
    const game = new PerudoGame.Game(nbPlayers);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 2);
    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], 3);

    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 3);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Five], 2);

    console.log(game.getDicesFacesOfCurrentRoundByPlayerId());
})();
