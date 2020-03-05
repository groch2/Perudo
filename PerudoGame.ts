export namespace PerudoGame {
	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

	export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

	export abstract class Turn {
		constructor(
			readonly turn: number,
			readonly player: number) { }
	}

	export class BeforeLastTurn extends Turn {
		constructor(
			turn: number,
			player: number,
			readonly bid: PlayerDiceBid) {
			super(turn, player);
		}
	}

	export class LastTurn extends Turn {
		constructor(
			turn: number,
			player: number,
			readonly bid: PlayerEndOfRoundCall) {
			super(turn, player);
		}
	}

	function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): playerChoice is PlayerDiceBid {
		return (playerChoice as PlayerDiceBid).diceFace !== undefined;
	}

	export class Round {
		constructor(
			private _beforeEndTurns: BeforeLastTurn[],
			private _endTurn: LastTurn,
			private _isOver: boolean,
			private _nbActivePlayers: number,
			readonly playersDices: number[],
			readonly firstPlayer: number) { }

		public get beforeEndTurns() {
			return this._beforeEndTurns;
		}

		public get endTurn() {
			return this._endTurn;
		}

		public get lastTurn() {
			return (
				this.isOver ?
					this.lastTurn :
					this.beforeEndTurns[this.beforeEndTurns.length - 1]);
		}

		public get isOver() {
			return this._isOver;
		}

		private _looserPlayer: number;
		public get looserPlayer() {
			if (!this.isOver) {
				throw new Error("this round is not over yet");
			}
			return this._looserPlayer;
		}
		private _winnerPlayer: number;
		public get winnerPlayer() {
			if (!this.isOver) {
				throw new Error("this round is not over yet");
			}
			return this._winnerPlayer;
		}
		public EndRound(looserPlayer: number, winnerPlayer: number): void {
			if (this.isOver) {
				throw new Error("This round is already over");
			}
			this._looserPlayer = looserPlayer;
			this._winnerPlayer = winnerPlayer;
		}

		public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
			console.log(playerChoice);
			const isRoundBeginning = this._beforeEndTurns.length == 0;
			const previousTurn: BeforeLastTurn | null = isRoundBeginning ? null : this._beforeEndTurns[this._beforeEndTurns.length - 1] as BeforeLastTurn;
			if (isDiceBid(playerChoice)) {
				this._beforeEndTurns.push(
					new BeforeLastTurn(
						isRoundBeginning ? 0 : previousTurn.turn + 1,
						isRoundBeginning ? this.firstPlayer : (previousTurn.player + 1) % this._nbActivePlayers,
						playerChoice));
			}
			else {
				if (isRoundBeginning) {
					throw Error("It is an error to end a round at the beginning of the round, before any bid was made.");
				}
				const previousBid = previousTurn.bid;
				this._endTurn =
					new LastTurn(
						previousTurn.turn + 1,
						(previousTurn.player + 1) % this._nbActivePlayers,
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
			this._rounds = [];
			this._rounds.push(firstRound);
		}

		public initializeNewRound(): void {
			const previousRound = this._rounds[this._rounds.length - 1];
			const newRound = new Round([], null, false, this._nbPlayers, previousRound.playersDices, previousRound.winnerPlayer);
		}

		public get currentRound() {
			return this._rounds[this._rounds.length - 1];
		}

		public get previousRounds() {
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
