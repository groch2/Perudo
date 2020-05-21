import * as PerudoGame from "../perudoGame";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);
console.log(game.currentRound.playersDicesDrawByPlayerId);
const allDices = game.currentRound.totalPositiveNbDicesByFaceName;
console.log({ allDices });
