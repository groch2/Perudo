import * as PerudoGame from "./PerudoGame";

const nbPlayers = 2;
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
    public readonly question = "Do you want to bid (1) or call for bluff or end of round (2) ?";
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string): AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor | AskForEndOfRoundProcessor {
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
    // TODO: Do not allow the player to choose Paco if it is the beginning of a non plafico round
    // TODO: Get the last bid to give a clue to the player
    public readonly question = "On which dice face to you want to bid ? (Paco: 1, Two: 2, Three: 3, Four: 4, Five: 5, Six: 6)";
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string | number): AskForBidDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor {
        choice = Number.parseInt(choice as string) - 1;
        if (choice >= 0 && choice < 6) {
            return new AskForBidDiceQuantityProcessor(this.game, choice);
        }
        // TODO: notifiy the user that his input is invalid and that he is redirected to the first choice (do you want to bid or end the round by calling bluff or exact match)
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

class AskForBidDiceQuantityProcessor {
    // TODO: Get the last bid to give a clue to the player
    public readonly question = `How many ${PerudoGame.DiceFace[this.diceFace]} do you want to bid ? (enter an integer numeric value)`;
    constructor(private game: PerudoGame.Game, private diceFace: number) { }
    processChoice(choice: string | number): AskForBidDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor {
        // TODO: validate that the user input is correct (it must be an integer number less than the total number of dices that are still on the table)
        // TODO: catch the error thrown by playerPlays if the bid is invalid
        // TODO: return a new AskForBidOrEndOfRoundProcessor if the user input is incorrect, or if the bid is invalid (resest the turn to allow the current player to make another choice)
        choice = Number.parseInt(choice as string);
        game.playerPlays({ diceFace: (this.diceFace as PerudoGame.DiceFace), diceQuantity: choice });
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

class AskForEndOfRoundProcessor {
    public readonly question = "Do you want to call bluff (1) or exact match (2) ?";
    constructor(private game: PerudoGame.Game) { }
    processChoice(choice: string): AskForBidDiceFaceProcessor {
        switch (choice) {
            case "1":
                game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);
                break;
            case "2":
                game.playerPlays(PerudoGame.PlayerEndOfRoundCall.ExactMatch);
                break;

        }
        return new AskForBidDiceFaceProcessor(this.game);
    }
}

(function loop(processor: AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor | AskForBidDiceQuantityProcessor | AskForEndOfRoundProcessor) {
    const question =
        `round number: ${game.currentRoundNumber}
player id: ${game.nextPlayerId}
nb dices of player: ${game.nbDicesOfNextPlayer}
player dices detail: ${JSON.stringify(game.nextPlayerDices)}
total nb dices of all other players: ${game.nbDicesOfOtherPlayersThanTheNextPlayer}
nb dices of all players by player id: ${JSON.stringify(game.nbDicesOfAllPlayersByPlayerId)} 
turn number: ${game.currentRound.turnNumber}
${processor.question}\n`;
    rl.question(
        question,
        (answer: string) => {
            processor = processor.processChoice(answer);
            if (game.isOver) {
                console.log('the game is over');
                rl.close();
                return;
            }
            loop(processor);
        });
})(new AskForBidDiceFaceProcessor(game));
