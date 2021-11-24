import * as PerudoGame from "./perudoGame";

export const diceFacesSymbolsByDiceFaceName = (() => {
  const diceFacesSymbols = "⚀⚁⚂⚃⚄⚅".split("");
  return PerudoGame.diceFacesNames.reduce((dictionary, diceFace, index) => {
    dictionary[diceFace] = diceFacesSymbols[index];
    return dictionary;
  }, {});
})();

export class AskForBidOrEndOfRoundProcessor {
  public readonly question: string;
  constructor(
    private game: PerudoGame.Game,
    readonly isPreviousChoiceValid: boolean = true
  ) {
    this.question = `${
      isPreviousChoiceValid
        ? ""
        : "Your input is incorrect, please choose a valid option.\n"
    }`;
    this.question +=
      this.game.currentRoundTurnNumber > 0
        ? `The current bid is: ${this.game.currentBidNbDices} ${
            diceFacesSymbolsByDiceFaceName[
              PerudoGame.diceFacesNames[this.game.currentBidDiceFace]
            ]
          }\n`
        : "";
    this.question += `Do you want to bid (1), call bluff (2) or exact match (3) ?`;
  }
  processChoice(
    choice: string
  ): AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor {
    if (!/^1|2|3$/.test(choice as string)) {
      return new AskForBidOrEndOfRoundProcessor(this.game, false);
    }
    switch (choice) {
      case "1":
        return new AskForDiceFaceProcessor(this.game);
      case "2":
        this.game.callBluff();
        break;
      case "3":
        this.game.callExactMatch();
        break;
    }
    switch (choice) {
      case "2":
      case "3":
        return new AskForDiceFaceProcessor(this.game);
    }
    return new AskForBidOrEndOfRoundProcessor(this.game, false);
  }
}

export class AskForDiceFaceProcessor {
  public readonly question: string;
  constructor(
    private game: PerudoGame.Game,
    readonly isPreviousChoiceValid: boolean = true,
    private readonly validInputExpression: RegExp = /^[1-6]$/
  ) {
    this.question = `${
      isPreviousChoiceValid
        ? ""
        : "Your input is incorrect, please choose a valid option.\n"
    }`;
    if (this.game.currentRoundTurnNumber > 0) {
      this.question += `The current bid is: ${this.game.currentBidNbDices} ${
        diceFacesSymbolsByDiceFaceName[
          PerudoGame.diceFacesNames[this.game.currentBidDiceFace]
        ]
      }\n`;
      this.validInputExpression = new RegExp(
        `^[${this.game.currentBidDiceFace + 1}-6]$`
      );
    }
    let nextDiceFaceChoices: PerudoGame.DiceFace[] | string = [
      ...new Array(PerudoGame.diceFacesNames.length).keys(),
    ].slice(1);
    if (
      this.game.isCurrentRoundFirstPlayerPalafico ||
      this.game.currentRoundTurnNumber > 0
    ) {
      if (this.game.currentBidDiceFace > 0) {
        nextDiceFaceChoices = nextDiceFaceChoices.slice(
          this.game.currentBidDiceFace - 1
        );
      }
      nextDiceFaceChoices.unshift(PerudoGame.DiceFace.Paco);
    }
    nextDiceFaceChoices = nextDiceFaceChoices
      .map(
        (df) =>
          `${diceFacesSymbolsByDiceFaceName[PerudoGame.diceFacesNames[df]]} : ${
            df + 1
          }`
      )
      .join(", ");
    this.question += `On which dice face to you want to bid ? (${nextDiceFaceChoices})`;
    if (this.game.isRoundBeginning) {
      this.validInputExpression = this.game.isCurrentRoundFirstPlayerPalafico
        ? /^[1-6]$/
        : /^[2-6]$/;
    }
  }
  processChoice(
    choice: string | number
  ):
    | AskForDiceQuantityProcessor
    | AskForBidOrEndOfRoundProcessor
    | AskForDiceFaceProcessor
    | ConfirmDiceQuantityProcessor {
    choice = choice as string;
    if (this.validInputExpression.test(choice)) {
      choice = Number.parseInt(choice) - 1;
      if (
        !this.game.isRoundBeginning &&
        choice > this.game.currentBidDiceFace
      ) {
        return new ConfirmDiceQuantityProcessor(this.game, choice);
      }
      return new AskForDiceQuantityProcessor(this.game, choice);
    }
    return new (
      this.game.isRoundBeginning
        ? AskForDiceFaceProcessor
        : AskForBidOrEndOfRoundProcessor
    )(this.game, false);
  }
}

export class ConfirmDiceQuantityProcessor {
  public readonly question: string;
  constructor(
    private game: PerudoGame.Game,
    private diceFace: PerudoGame.DiceFace
  ) {
    this.question = `Do you want to bid ${game.currentBidNbDices} ${
      diceFacesSymbolsByDiceFaceName[PerudoGame.DiceFace[diceFace]]
    } ? (Yes : y,Y | No : n,N,...)`;
  }
  processChoice(
    choice: string
  ): AskForDiceFaceProcessor | AskForBidOrEndOfRoundProcessor {
    if (choice.toUpperCase() === "Y") {
      this.game.bid(this.game.currentBidNbDices, this.diceFace);
    }
    return new AskForBidOrEndOfRoundProcessor(this.game);
  }
}

export class AskForDiceQuantityProcessor {
  public readonly question = `How many ${
    diceFacesSymbolsByDiceFaceName[PerudoGame.DiceFace[this.diceFace]]
  } do you want to bid ? (enter an integer numeric value)`;
  constructor(
    private game: PerudoGame.Game,
    private diceFace: PerudoGame.DiceFace
  ) {
    if (this.game.currentRoundTurnNumber > 0) {
      this.question += `\nyour bid must be greater than ${this.game.currentBidNbDices}`;
    }
  }
  processChoice(
    choice: string
  ): AskForBidOrEndOfRoundProcessor | AskForDiceFaceProcessor {
    if (!/^\d+$/.test(choice)) {
      return new (
        this.game.isRoundBeginning
          ? AskForDiceFaceProcessor
          : AskForBidOrEndOfRoundProcessor
      )(this.game, false);
    }
    let isInputValid = true;
    try {
      this.game.bid(Number.parseInt(choice), this.diceFace);
    } catch {
      isInputValid = false;
    }
    return new AskForBidOrEndOfRoundProcessor(this.game, isInputValid);
  }
}
