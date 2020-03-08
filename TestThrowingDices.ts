import { PerudoGame } from "./PerudoGame";

const diceDraw = PerudoGame.getDrawByThrowingDices(5).map(d => PerudoGame.DiceFace[d]);
console.log(diceDraw);