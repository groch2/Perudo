export namespace PerudoGame {
	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

	export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

	export abstract class Turn {
		constructor(
			readonly turn: number,
			readonly playerTurn: number) { }
	}

	export class BeforeLastTurn extends Turn {
		constructor(
			turn: number,
			playerTurn: number,
			readonly bid: PlayerDiceBid) {
			super(turn, playerTurn);
		}
	}

	export class LastTurn extends Turn {
		constructor(
			turn: number,
			playerTurn: number,
			readonly bid: PlayerEndOfRoundCall) {
			super(turn, playerTurn);
		}
	}

	function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): playerChoice is PlayerDiceBid {
		return (playerChoice as PlayerDiceBid).diceFace !== undefined;
	}

	export class Round {
		constructor(
			private _beforeLastTurns: BeforeLastTurn[],
			private _lastTurn: LastTurn,
			private _isOver: boolean,
			private _nbActivePlayers: number,
			readonly playersDices: number[],
			readonly firstPlayer: number) { }

		public get beforeLastTurns() {
			return this._beforeLastTurns;
		}

		public get isOver() {
			return this._isOver;
		}

		public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
			console.log(playerChoice);
			const isRoundBeginning = this._beforeLastTurns.length == 0;
			const previousTurn: BeforeLastTurn | null = isRoundBeginning ? null : this._beforeLastTurns[this._beforeLastTurns.length - 1] as BeforeLastTurn;
			if (isDiceBid(playerChoice)) {
				this._beforeLastTurns.push(
					new BeforeLastTurn(
						isRoundBeginning ? 0 : previousTurn.turn + 1,
						isRoundBeginning ? this.firstPlayer : (previousTurn.playerTurn + 1) % this._nbActivePlayers,
						playerChoice));
			}
			else {
				if (isRoundBeginning) {
					throw Error("It is an error to end a round at the beginning of the round, before any bid was made.");
				}
				const previousBid = previousTurn.bid;
				this._lastTurn =
					new LastTurn(
						previousTurn.turn + 1,
						(previousTurn.playerTurn + 1) % this._nbActivePlayers,
						playerChoice);
			}
		};
	}

	export class Game {
		private _isOver: boolean;
		private _nbPlayers: number;
		private _rounds: Round[];

		public constructor(nbPlayers: number) {
			this._isOver = false;
			this._nbPlayers = nbPlayers;
			const firstRound = new Round([], null, false, this.nbPlayers, Object.assign([], { length: nbPlayers }).fill(5), 0);
			this._rounds.push(firstRound);
		}

		public initializeNewRound(): void {
			const newRound = new Round([], null, false, this._nbPlayers)
		}

		public get activeRound() {
			return this._rounds[this._rounds.length - 1];
		}

		public get rounds() {
			return this._rounds;
		}

		public get nbPlayers() {
			return this._nbPlayers;
		}

		public get isOver() {
			return this._isOver;
		}
	}
}
