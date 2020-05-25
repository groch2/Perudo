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
    constructor(private game: PerudoGame.Game, readonly isPreviousChoiceValid: boolean = true) {
        this.question = `${isPreviousChoiceValid ? "" : "Your input is incorrect, please choose a valid option.\n"}`;
        this.question += this.game.currentRound.turnNumber > 0 ? `The current bid is: ${this.game.currentBidNbDices} ${PerudoGame.diceFacesNames[this.game.currentBidDiceFace]}\n` : "";
        this.question += `Do you want to bid (1), call bluff (2) or exact match (3) ?`;
    }
    processChoice(choice: string | number): AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor {
        choice = Number.parseInt(choice as string);
        switch (choice) {
            case 1:
                return new AskForDiceFaceProcessor(this.game);
            case 2:
                this.game.callBluff();
                break;
            case 3:
                this.game.callExactMatch();
                break;
        }
        switch (choice) {
            case 2:
            case 3:
                return new AskForDiceFaceProcessor(this.game);
        }
        return new AskForBidOrEndOfRoundProcessor(this.game, false);
    }
}

class AskForDiceFaceProcessor {
    public readonly question: string;
    constructor(private game: PerudoGame.Game, readonly isPreviousChoiceValid: boolean = true) {
        this.question = `${isPreviousChoiceValid ? "" : "Your input is incorrect, please choose a valid option.\n"}`;
        this.question += this.game.currentRound.turnNumber > 0 ? `The current bid is: ${this.game.currentBidNbDices} ${PerudoGame.diceFacesNames[this.game.currentBidDiceFace]}\n` : "";
        let nextDiceFaceChoices: PerudoGame.DiceFace[] | string =
            [...new Array(PerudoGame.diceFacesNames.length).keys()].slice(1);
        if (this.game.currentRound.isFirstPlayerPalafico || this.game.currentRound.turnNumber > 0) {
            nextDiceFaceChoices = nextDiceFaceChoices.slice(this.game.currentBidDiceFace - 1)
            nextDiceFaceChoices.unshift(PerudoGame.DiceFace.Paco);
        }
        nextDiceFaceChoices = nextDiceFaceChoices.map(df => `${PerudoGame.diceFacesNames[df]}: ${df + 1}`).join(", ");
        this.question += `On which dice face to you want to bid ? (${nextDiceFaceChoices})`;
    }
    processChoice(choice: string | number): AskForDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor {
        choice = Number.parseInt(choice as string) - 1;
        if (choice >= 0 && choice < 6) {
            return new AskForDiceQuantityProcessor(this.game, choice);
        }
        return new (
            this.game.currentRound.isRoundBeginning ?
                AskForDiceFaceProcessor :
                AskForBidOrEndOfRoundProcessor)(this.game, false);
    }
}

class AskForDiceQuantityProcessor {
    public readonly question = `How many ${PerudoGame.DiceFace[this.diceFace]} do you want to bid ? (enter an integer numeric value)`;
    constructor(private game: PerudoGame.Game, private diceFace: PerudoGame.DiceFace) { }
    processChoice(choice: string | number): AskForDiceQuantityProcessor | AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor {
        // TODO: validate that the user input is correct (it must be an integer number less than the total number of dices that are still on the table)
        // TODO: catch the error thrown by playerPlays if the bid is invalid
        // TODO: return a new AskForBidOrEndOfRoundProcessor if the user input is incorrect, or if the bid is invalid (resest the turn to allow the current player to make another choice)
        if (!/^\d+$/.test(choice as string)) {
            return new (
                this.game.currentRound.isRoundBeginning ?
                    AskForDiceFaceProcessor :
                    AskForBidOrEndOfRoundProcessor)(this.game, false);
        }
        console.debug({ playerBefore: this.game.nextPlayerId });
        this.game.bid(choice as number, this.diceFace);
        console.debug({ playerAfter: this.game.nextPlayerId });
        return new AskForBidOrEndOfRoundProcessor(this.game);
    }
}

(function loop(processor: AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor | AskForDiceQuantityProcessor) {
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
})(new AskForDiceFaceProcessor(game));
