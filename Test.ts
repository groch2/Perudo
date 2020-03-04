import { PerudoGame } from "./PerudoGame";

const nbPlayers = 6;
const playersDices: number[] = Object.assign([], { length: nbPlayers }).fill(5);

const game = new PerudoGame.Game(5);
