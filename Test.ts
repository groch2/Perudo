import { PerudoGame } from "./PerudoGame";

const nbPlayers = 6;
const playersDices: number[] = Object.assign([], { length: nbPlayers }).fill(5);

const game = new PerudoGame.Game(0, playersDices, 0, undefined);
let testGame: PerudoGame.Game;

testGame = PerudoGame.playerPlays(game, 0, { diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 3 });
console.log(testGame);

testGame = PerudoGame.playerPlays(game, 1, PerudoGame.PlayerEndOfTurnCall.Bluff);
console.log(testGame);
