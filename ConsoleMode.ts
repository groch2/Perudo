import * as PerudoGame from "./perudoGame";
import {
  AskForBidOrEndOfRoundProcessor,
  AskForDiceFaceProcessor,
  AskForDiceQuantityProcessor,
  ConfirmDiceQuantityProcessor,
  diceFacesSymbolsByDiceFaceName,
} from "./gameProcessor";

const nbPlayers = 3;
const game = new PerudoGame.Game(nbPlayers);

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

(function loop(
  processor:
    | AskForBidOrEndOfRoundProcessor
    | AskForDiceFaceProcessor
    | AskForDiceQuantityProcessor
    | ConfirmDiceQuantityProcessor
) {
  const nextPlayerDices = game.nextPlayerDices
    .map(
      ([diceFace, diceQuantity]) =>
        `${diceQuantity}${diceFacesSymbolsByDiceFaceName[diceFace]}`
    )
    .join(" ");
  const question = `round number: ${game.currentRoundNumber}
player id: ${game.nextPlayerId}
nb dices of player: ${game.nbDicesOfNextPlayer}
player dices detail: ${nextPlayerDices}
total nb dices of all other players: ${
    game.nbDicesOfOtherPlayersThanTheNextPlayer
  }
nb dices of all players by player id: ${JSON.stringify(game.nbDicesByPlayerId)}
turn number: ${game.currentRound.turnNumber}
${processor.question}\n`;
  rl.question(question, (answer: string) => {
    processor = processor.processChoice(answer);
    if (game.isOver) {
      console.log(
        `the game is over, the winner is player ${game.nextPlayerId}`
      );
      rl.close();
      return;
    }
    loop(processor);
  });
})(new AskForDiceFaceProcessor(game));
