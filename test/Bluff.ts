import { PerudoGame } from "../PerudoGame";

const nbPlayers = 2;
PerudoGame.throwingDicesEnabled = false;
const game = new PerudoGame.Game(nbPlayers);

for (let diceFace = 0; diceFace < PerudoGame.diceFacesNames.length; diceFace++) {
    for (let playerId = 0; playerId < 2; playerId++) {
        game.currentRound.playersDicesDrawByPlayerId[playerId].set(diceFace, 0);
    }
}

game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Paco, 1);
game.currentRound.playersDicesDrawByPlayerId[0].set(PerudoGame.DiceFace.Four, 1);

game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Three, 2);
game.currentRound.playersDicesDrawByPlayerId[1].set(PerudoGame.DiceFace.Four, 1);

console.log(game.currentRound.getTotalNbDiceByFaceName());

game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 4 });
game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

game.initializeNewRound();

console.log({ nbDicesOfEachPlayerByPlayerId: game.currentRound.nbDicesOfEachPlayerByPlayerId });
