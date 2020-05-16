import * as  PerudoGame from "../PerudoGame";

const diceDraw = PerudoGame.getDrawByThrowingDices(5);
const onlyPositiveDiceQuantityByFace = [...diceDraw.entries()].filter(([, quantity]) => quantity > 0);
const diceQuantityByDiceFaceName = onlyPositiveDiceQuantityByFace.map(([diceFace, diceQuantity]) => [PerudoGame.DiceFace[diceFace], diceQuantity]);
console.log(diceQuantityByDiceFaceName);
