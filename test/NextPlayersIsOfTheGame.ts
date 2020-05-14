import { PerudoGame } from "../PerudoGame";

PerudoGame.throwingDicesEnabled = false;

/// When there is n players, and the player with id (n - 2) plays, and the player with id (n - 1) is out of the game, then the next player should be the player with id 0
(function thePlayerWithHighestIdIsOutOfTheGame() {
    const nbPlayers = 5;
    const nbDicesByPlayerId = new Array(nbPlayers).fill(2);
    nbDicesByPlayerId[nbDicesByPlayerId.length - 1] = 0;
    const game = new PerudoGame.Game(nbDicesByPlayerId.length, nbDicesByPlayerId);

    console.log({ nbDicesByPlayerId: game.nbDicesByPlayerId });

    console.log({ firstPlayerId: game.nextPlayerId });

    for (let i = 1; i < nbDicesByPlayerId.length - 1; i++) {
        console.log("player plays...");
        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: i });

        console.log({ nextPlayerId: game.nextPlayerId });
        const expectedPlayerId = i;
        console.assert(game.nextPlayerId === expectedPlayerId, `next playerId should be ${expectedPlayerId}`);
    }

    console.log("before last player plays...");
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: nbDicesByPlayerId.length - 1 });

    console.log({ nextPlayerId: game.nextPlayerId });
    console.assert(game.nextPlayerId === 0, "next playerId should be 0");
})();
