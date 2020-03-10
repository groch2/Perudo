import { PerudoGame } from "./PerudoGame";

const nbPlayers = 2;
PerudoGame.throwingDicesEnabled = false;
const game = new PerudoGame.Game(nbPlayers);

game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Paco], 1);
game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 0);
game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], 0);
game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);
game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Five], 0);
game.currentRound.playersDicesDrawByPlayerId[0].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Six], 0);

game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Paco], 0);
game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Two], 0);
game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Three], 2);
game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Four], 1);
game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Five], 0);
game.currentRound.playersDicesDrawByPlayerId[1].set(<any>PerudoGame.DiceFace[PerudoGame.DiceFace.Six], 0);

let nbDiceByFace = PerudoGame.diceFacesNames.reduce((state, item) => Object.defineProperty(state, item, { value: 0, writable: true, enumerable: true }), {});
game.currentRound.playersDicesDrawByPlayerId.forEach(draw => [...draw.entries()].forEach(nbDicesForFace => nbDiceByFace[nbDicesForFace[0]] += nbDicesForFace[1]));

console.log(JSON.stringify(nbDiceByFace));

game.playerPlays({ diceFace: PerudoGame.DiceFace.Four, diceQuantity: 4 });
game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

game.initializeNewRound();

console.log({ nbDicesOfEachPlayerByPlayerId: JSON.stringify(game.currentRound.nbDicesOfEachPlayerByPlayerId) });