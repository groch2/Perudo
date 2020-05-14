import { PerudoGame } from "../PerudoGame";

const nbPlayers = 3;
PerudoGame.throwingDicesEnabled = false;

(function secondPlayerLoosesTheRoundAndIsOutOfDice() {
    const [nbDicesOfPlayer0, nbDicesOfPlayer2] = [2, 1];
    const game = new PerudoGame.Game(nbPlayers, [2, 1, 1]);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], nbDicesOfPlayer0);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], 1);
    game.currentRound.playersDicesDrawByPlayerId[2].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], nbDicesOfPlayer2);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 2 });
    game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 });
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[0] == nbDicesOfPlayer0, `player 0 should have ${nbDicesOfPlayer0} dices`);
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[1] == 0, "player 1 should have 0 dices");
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[2] == nbDicesOfPlayer2, `player 2 should have ${nbDicesOfPlayer2} dices`);

    game.initializeNewRound();

    console.log({ firstPlayerOfSecondRound: game.currentRound.firstPlayerId });

    console.assert(game.currentRound.firstPlayerId == 2, "the first player of the new round should be player with id 2.");
})();
