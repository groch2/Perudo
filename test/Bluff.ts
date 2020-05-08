import { PerudoGame } from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.throwingDicesEnabled = false;

(function secondPlayersCallsBluffAndLooseOneDice() {
    const game = new PerudoGame.Game(nbPlayers);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 2);
    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 4 });

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[0] == PerudoGame.nbStartingDicesByPlayer - 1, "player 1 should have 4 dices");
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[1] == PerudoGame.nbStartingDicesByPlayer, "player 2 should have 5 dices");
})();

(function secondPlayersCallsBluffAndFirstPlayerLooseOneDice() {
    const game = new PerudoGame.Game(nbPlayers);

    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 1);
    game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);

    game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 2);

    console.log({ totalDicesQuantity: game.currentRound.getTotalPositiveNbDiceByFaceName() });

    game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 3 });

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });

    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[0] == PerudoGame.nbStartingDicesByPlayer, "player 1 should have 5 dices");
    console.assert(game.currentRound.nbDicesOfEachPlayerByPlayerId[1] == PerudoGame.nbStartingDicesByPlayer - 1, "player 2 should have 4 dices");
})();
