import * as PerudoGame from "./PerudoGame";

const nbPlayers = 6;
const game = new PerudoGame.Game(nbPlayers);

console.log("game start:");
console.log("Nb dices of all players by player id:", game.nbDicesOfAllPlayersByPlayerId);
console.log();

const rl =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

class AskForBidOrEndOfRoundProcessor {
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string, game: PerudoGame.Game): AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor | AskForEndOfRoundProcessor {
        switch (choice) {
            case "1":
                return new AskForBidDiceFaceProcessor(this.game);
            case "2":
                return new AskForEndOfRoundProcessor(this.game);
            default:
                return this;
        }
    }
}

class AskForBidDiceFaceProcessor {
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string | number, game: PerudoGame.Game): AskForBidDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor {
        choice = Number.parseInt(choice as string);
        if (choice > 0 && choice < 7) {
            return new AskForBidDiceQuantityProcessor(this.game, choice);
        }
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

class AskForBidDiceQuantityProcessor {
    constructor(private game: PerudoGame.Game, private diceFace) { }
    processChoice(choice: string | number, game: PerudoGame.Game): AskForBidDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor {
        choice = Number.parseInt(choice as string);
        // TODO: build the dice bid object and use it on the game object
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

class AskForEndOfRoundProcessor {
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string, game: PerudoGame.Game): AskForBidOrEndOfRoundProcessor {
        // TODO: use the end of round choice on the game object
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

(function loop(processor: AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor | AskForBidDiceQuantityProcessor | AskForEndOfRoundProcessor) {
    // Build the question
    const question =
        `round number: ${game.currentRoundNumber}
next player id: ${game.nextPlayerId}
nb dices of next player: ${game.nbDicesOfNextPlayer}
next player dices detail: ${JSON.stringify(game.nextPlayerDices)}
total nb dices of all other players: ${game.nbDicesOfOtherPlayersThanTheNextPlayer}
nb dices of all players by player id: ${JSON.stringify(game.nbDicesOfAllPlayersByPlayerId)} 
turn number: ${game.currentRound.turnNumber}\n`;
    // TODO: get the question from the processor object
    rl.question(
        question,
        (answer: string) => {
            processor = processor.processChoice(answer, game);
            if (game.isOver) {
                console.log('the game is over');
                rl.close();
                return;
            }
            loop(processor);
        });
})(new AskForBidOrEndOfRoundProcessor(game));
