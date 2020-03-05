import { PerudoGame } from "./PerudoGame";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);

for (let turn = 0; turn < nbPlayers * 2; turn++) {
    const bid = { diceFace: PerudoGame.DiceFace.Two, diceQuantity: 4 + turn };
    game.currentRound.playerPlays(bid);
    console.log(game.currentRound.lastTurn);
}
