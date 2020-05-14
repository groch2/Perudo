import { PerudoGame } from "../PerudoGame";

PerudoGame.throwingDicesEnabled = false;

(function nextPlayerIsOutOfTheGame() {
    const nbDicesByPlayerId = [2, 2, 2, 2, 0];
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    for (let [playerId, nbDices] of nbDicesByPlayerId.entries()) {
        game.currentRound.playersDicesDrawByPlayerId[playerId].set(<any>PerudoGame.DiceFace[playerId + 1], nbDices);
    }

    console.log({ nbDicesByPlayerId: game.nbDicesByPlayerId });

    let nextPlayerId = game.currentRound.nextPlayerId;

    console.log({ firstPlayer: nextPlayerId });

    for (let turn = 0; turn < nbDicesByPlayerId.length - 1; turn++) {
        console.log("player plays...");
        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: turn + 1 });
        nextPlayerId = game.currentRound.nextPlayerId;
        console.log({ nextPlayerId: nextPlayerId });
    }

    console.assert(nextPlayerId === 0, "next playerId should be 0");
})();
