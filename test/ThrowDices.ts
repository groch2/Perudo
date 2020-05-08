import { PerudoGame } from "../PerudoGame";

let diceDraw = PerudoGame.getDrawByThrowingDices(5);
console.log([...diceDraw.entries()].filter(([, quantity]) => quantity > 0));
