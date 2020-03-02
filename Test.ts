import { PerudoGame } from "./PerudoGame";

PerudoGame.playerPlays(0, { diceFace: PerudoGame.DiceFace.Paco, diceQuantity: 3 });

PerudoGame.playerPlays(1, PerudoGame.PlayerEndOfTurnCall.Bluff);