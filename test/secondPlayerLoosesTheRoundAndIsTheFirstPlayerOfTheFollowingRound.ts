import { PerudoGame } from "../PerudoGame";

const nbPlayers = 3;
PerudoGame.throwingDicesEnabled = false;

(function secondPlayerLoosesTheRoundAndIsOutOfDice() {
    const nbDicesByPlayerId = [2, 2, 1];
    const game = new PerudoGame.Game(nbPlayers, nbDicesByPlayerId);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], nbDicesByPlayerId[0]);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], nbDicesByPlayerId[1]);
    game.currentRound.playersDicesDrawByPlayerId[2].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], nbDicesByPlayerId[2]);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[0] == nbDicesByPlayerId[0], `player 0 should have ${nbDicesByPlayerId[0]} dices`);
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[1] == 1, "player 1 should have 1 dices");
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[2] == nbDicesByPlayerId[2], `player 2 should have ${nbDicesByPlayerId[2]} dices`);

    game.initializeNewRound();

    console.log({ firstPlayerOfSecondRound: game.currentRound.firstPlayerId });

    console.assert(game.currentRound.firstPlayerId == 1, "the first player of the new round should be player with id 1.");
})();
