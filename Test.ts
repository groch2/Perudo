import { PerudoGame } from "./PerudoGame";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);

const nbTurnsBeforeLast = nbPlayers * 2;
for (let turn = 0; turn < nbTurnsBeforeLast; turn++) {
    const bid = { diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 + turn };
    game.currentRound.playerPlays(bid);
    console.log(game.currentRound.lastBeforeEndTurn);
}

game.currentRound.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);
console.log(game.currentRound.lastBeforeEndTurn);
