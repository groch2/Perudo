import * as PerudoGame from "./perudoGame";

const nbPlayers = 2;
const game = new PerudoGame.Game(nbPlayers);

console.log("game start:");
console.log("Nb dices of all players by player id:", game.nbDicesByPlayerId);
console.log();

const rl =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

class AskForBidOrEndOfRoundProcessor {
    public readonly question: string;
    constructor(private game: PerudoGame.Game) {
        this.question = `The current bid is: ${game.currentBidNbDices} ${PerudoGame.diceFacesNames[game.currentBidDiceFace]};
Do you want to bid (1), call bluff (2) or end of round (3) ?`;
    }
    processChoice(choice: string): AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor {
        switch (choice) {
            case "1":
                return new AskForBidDiceFaceProcessor(this.game);
            case "2":
                game.callBluff();
                break;
            case "3":
                game.callExactMatch();
                break;
        }
        return this;
    }
}

class AskForBidDiceFaceProcessor {
    public readonly question: string;
    constructor(private game: PerudoGame.Game) {
        let nextDiceFaceChoices: PerudoGame.DiceFace[] | string =
            [...new Array(PerudoGame.diceFacesNames.length).keys()].slice(1);
        if (this.game.currentRound.isFirstPlayerPalafico || this.game.currentRound.turnNumber > 0) {
            nextDiceFaceChoices = nextDiceFaceChoices.slice(this.game.currentBidDiceFace - 1)
            nextDiceFaceChoices.unshift(PerudoGame.DiceFace.Paco);
        }
        nextDiceFaceChoices = nextDiceFaceChoices.map(df => `${PerudoGame.diceFacesNames[df]}: ${df + 1}`).join(", ");
        this.question = `On which dice face to you want to bid ? (${nextDiceFaceChoices})`;
    }
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
    public readonly question = `How many ${PerudoGame.DiceFace[this.diceFace]} do you want to bid ? (enter an integer numeric value)`;
    constructor(private game: PerudoGame.Game, private diceFace: number) { }
    processChoice(choice: string | number): AskForBidDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor {
        // TODO: validate that the user input is correct (it must be an integer number less than the total number of dices that are still on the table)
        // TODO: catch the error thrown by playerPlays if the bid is invalid
        // TODO: return a new AskForBidOrEndOfRoundProcessor if the user input is incorrect, or if the bid is invalid (resest the turn to allow the current player to make another choice)
        choice = Number.parseInt(choice as string);
        game.bid(choice, this.diceFace as PerudoGame.DiceFace);
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

(function loop(processor: AskForBidOrEndOfRoundProcessor | AskForBidDiceFaceProcessor | AskForBidDiceQuantityProcessor) {
    const question =
        `round number: ${game.currentRoundNumber}
player id: ${game.nextPlayerId}
nb dices of player: ${game.nbDicesOfNextPlayer}
player dices detail: ${JSON.stringify(game.nextPlayerDices)}
total nb dices of all other players: ${game.nbDicesOfOtherPlayersThanTheNextPlayer}
nb dices of all players by player id: ${JSON.stringify(game.nbDicesByPlayerId)} 
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
