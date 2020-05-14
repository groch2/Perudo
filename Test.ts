import { PerudoGame } from "./PerudoGame";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);
console.log("dice faces: ", game.currentRound.getTotalNbDiceByFaceName());

const nbTurnsBeforeLast = nbPlayers * 2;
for (let turn = 0; turn < nbTurnsBeforeLast; turn++) {
    const bid = { diceFace: PerudoGame.DiceFace.Two, diceQuantity: 3 + turn };
    game.currentRound.playerPlays(bid);
    console.log(game.currentRound.lastTurn);
}

game.currentRound.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);
console.log(game.currentRound.endOfRound);

console.log(game.nbDicesByPlayerId);
