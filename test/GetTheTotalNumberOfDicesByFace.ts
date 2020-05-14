import { PerudoGame } from "../PerudoGame";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);
console.log(game.currentRound.playersDicesDrawByPlayerId);
const allDices = game.currentRound.getTotalPositiveNbDiceByFaceName();
console.log({ allDices });