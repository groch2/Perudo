import { PerudoGame } from "../PerudoGame";

PerudoGame.throwingDicesEnabled = false;

(function nextPlayerIsOutOfTheGame() {
    const nbDicesByPlayerId = [2, 2, 2, 2, 0];
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    for (let [playerId, nbDices] of nbDicesByPlayerId.entries()) {
        game.currentRound.playersDicesDrawByPlayerId[playerId].set(<any>PerudoGame.DiceFace[playerId + 1], nbDices);
    }

    console.log({ nbDicesByPlayerId: game.nbDicesByPlayerId });

    console.log({ firstPlayer: game.nextPlayerId });

    for (let i = 0; i < nbDicesByPlayerId.length - 1; i++) {
        console.log("player plays...");
        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: i + 1 });

        console.log({ nextPlayerId: game.nextPlayerId });

        const expectedPlayerId = i + 1;
        if (i < nbDicesByPlayerId.length - 2) {
            console.assert(game.nextPlayerId === expectedPlayerId, `next playerId should be ${expectedPlayerId}`);
        }
    }

    console.assert(game.nextPlayerId === 0, "next playerId should be 0");
})();
