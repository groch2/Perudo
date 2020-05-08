import { PerudoGame } from "../PerudoGame";

let diceDraw = PerudoGame.getDrawByThrowingDices(5);
//[...diceDraw.entries()].map(pair => [PerudoGame.DiceFace[pair[0]], pair[1]]);
console.log([...diceDraw.entries()]);
