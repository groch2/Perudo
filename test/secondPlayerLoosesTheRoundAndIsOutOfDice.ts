import { PerudoGame } from "../PerudoGame";

const nbPlayers = 3;
PerudoGame.throwingDicesEnabled = false;

(function secondPlayerLoosesTheRoundAndIsOutOfDice() {
    const game = new PerudoGame.Game(nbPlayers, [PerudoGame.nbStartingDicesByPlayer, 1, PerudoGame.nbStartingDicesByPlayer]);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 2);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], 1);
    game.currentRound.playersDicesDrawByPlayerId[2].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    for (let unimpactedPlayerId of [0, 2]) {
        console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[unimpactedPlayerId] == PerudoGame.nbStartingDicesByPlayer, `player ${unimpactedPlayerId} should have 5 dices`);
    }
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[1] == 0, "player 1 should have 0 dices");

    game.initializeNewRound();

    console.log({ firstPlayer: game.currentRound.firstPlayerId });

    console.assert(game.currentRound.firstPlayerId == 1, "the first player of the new round should be player with id 1.");
})();
