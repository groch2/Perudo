export namespace PerudoGame {
	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

	export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

	export abstract class Turn {
		constructor(
			readonly turn: number,
			readonly playerId: number) { }
	}

	export class BeforeLastTurn extends Turn {
		constructor(
			turn: number,
			playerId: number,
			readonly bid: PlayerDiceBid) {
			super(turn, playerId);
		}
	}

	export class LastTurn extends Turn {
		constructor(
			turn: number,
			playerId: number,
			readonly bid: PlayerEndOfRoundCall) {
			super(turn, playerId);
		}
	}

	function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): playerChoice is PlayerDiceBid {
		return (playerChoice as PlayerDiceBid).diceFace !== undefined;
	}

	export class Round {
		readonly isFirstPlayerOfCurrentRoundPlafico: boolean;

		constructor(
			private _beforeEndTurns: BeforeLastTurn[],
			private _endTurn: LastTurn,
			private _isOver: boolean,
			private _nbActivePlayers: number,
			readonly playersDicesDrawByPlayerId: Map<DiceFace, number>[],
			readonly firstPlayerId: number) {
			this.isFirstPlayerOfCurrentRoundPlafico =
				[...playersDicesDrawByPlayerId[firstPlayerId].values()]
					.reduce((firstPlayerDicesTotal, playerNbDicesOfFace) => firstPlayerDicesTotal + playerNbDicesOfFace) === 1;
		}

		public get beforeEndTurns() {
			return this._beforeEndTurns;
		}

		public get endTurn() {
			return this._endTurn;
		}

		public get lastTurn() {
			return (
				this.isOver ?
					this.endTurn :
					this.beforeEndTurns[this.beforeEndTurns.length - 1]);
		}

		public get isOver() {
			return this._isOver;
		}

		private _looserPlayer: number | undefined;
		public get looserPlayer() {
			if (!this.isOver) {
				throw new Error("this round is not over yet");
			}
			return this._looserPlayer;
		}

		private _winnerPlayer: number | undefined;
		public get winnerPlayer() {
			if (!this.isOver) {
				throw new Error("this round is not over yet");
			}
			return this._winnerPlayer;
		}

		public SetLooserAndWinnerOfRound(looserPlayer: number, winnerPlayer: number): void {
			if (this.isOver) {
				throw new Error("This round is already over");
			}
			this._looserPlayer = looserPlayer;
			this._winnerPlayer = winnerPlayer;
		}

		public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
			const isRoundBeginning = this._beforeEndTurns.length == 0;
			const previousTurn: BeforeLastTurn | null = isRoundBeginning ? null : this._beforeEndTurns[this._beforeEndTurns.length - 1] as BeforeLastTurn;
			const playerIdOfCurrentTurn = (previousTurn.playerId + 1) % this._nbActivePlayers;
			if (isDiceBid(playerChoice)) {
				if (this.isFirstPlayerOfCurrentRoundPlafico) {
					if (playerChoice.diceFace > previousTurn.bid.diceFace === playerChoice.diceQuantity > previousTurn.bid.diceQuantity) {
						throw new Error("in a round where a the first player is plafico, a bid must be of greater quantity OR greater value than the previous one, and not both");
					}
				}
				else {
					if (isRoundBeginning) {
						if (playerChoice.diceFace === DiceFace.Paco && this.isFirstPlayerOfCurrentRoundPlafico) {
							throw new Error("It is forbidden to start a round by bidding a quantity of pacos if the first player of the round has more than one dice");
						}
					}
					else {
						if (previousTurn.bid.diceFace !== DiceFace.Paco) {
							if (playerChoice.diceFace === DiceFace.Paco) {
								if (playerChoice.diceQuantity < Math.ceil(previousTurn.bid.diceQuantity / 2)) {
									throw new Error("the quantity of a bid of pacos following a bid of other value than paco must be superior to the half of the previous bid rounded up");
								}
							}
							else if (playerChoice.diceFace > previousTurn.bid.diceFace === playerChoice.diceQuantity > previousTurn.bid.diceQuantity) {
								throw new Error("a bid of other value than paco following a bid of other value than paco must be of greater quantity OR greater value, and not both");
							}
						}
						else {
							if (playerChoice.diceFace === DiceFace.Paco) {
								if (playerChoice.diceQuantity <= previousTurn.bid.diceQuantity) {
									throw new Error("a bid of pacos following a bid of pacos must increase the quantity");
								}
							}
							else {
								const previousNonPacoBidQuantity = findLast(this.beforeEndTurns, turn => turn.bid.diceFace !== DiceFace.Paco).bid.diceQuantity;
								if (playerChoice.diceQuantity <= previousNonPacoBidQuantity * 2) {
									throw new Error("a bid of non pacos following a bid of pacos must be greater than twice the most recent bid of non pacos");
								}
							}
						}
					}
				}
				this._beforeEndTurns.push(
					new BeforeLastTurn(
						isRoundBeginning ? 0 : previousTurn.turn + 1,
						isRoundBeginning ? this.firstPlayerId : playerIdOfCurrentTurn,
						playerChoice));
			}
			else {
				if (isRoundBeginning) {
					throw Error("It is an error to end a round at the beginning of the round, before any bid was made.");
				}
				this._endTurn =
					new LastTurn(
						previousTurn.turn + 1,
						playerIdOfCurrentTurn,
						playerChoice);
				const countPacosAsJoker = previousTurn.bid.diceFace !== DiceFace.Paco && !this.isFirstPlayerOfCurrentRoundPlafico;
				const nbDicesMatchingLastBid =
					this.playersDicesDrawByPlayerId.reduce((diceTotal, playerDices) => {
						return diceTotal + playerDices[previousTurn.bid.diceFace] + (countPacosAsJoker ? playerDices[DiceFace.Paco] : 0);
					}, 0);
				switch (playerChoice) {
					case PlayerEndOfRoundCall.Bluff:
						if (previousTurn.bid.diceQuantity < nbDicesMatchingLastBid) {
							this.SetLooserAndWinnerOfRound(playerIdOfCurrentTurn, previousTurn.playerId);
						}
						else {
							this.SetLooserAndWinnerOfRound(previousTurn.playerId, playerIdOfCurrentTurn);
						}
						break;
					case PlayerEndOfRoundCall.ExactMatch:
						if (previousTurn.bid.diceQuantity === nbDicesMatchingLastBid) {

						}
						else {

						}
						break;
					default:
						throw new Error("unknown end of round call");
				}
				this._isOver = true;
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
			const newRound = new Round([], null, false, this._nbPlayers, previousRound.playersDicesDrawByPlayerId, previousRound.winnerPlayer);
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

	/// randomly generate a draw for a given number of perudo dices
	export function getDrawByThrowingDices(nbDices: number): DiceFace[] {
		const nbFacesOfPerudoDice = Object.keys(DiceFace).length / 2;
		return new Array(nbDices).fill(0).map(_ => Math.trunc((Math.random() * nbFacesOfPerudoDice)) as DiceFace);
	}

	function findLast<T>(array: Array<T>, predicate: (item: T) => boolean): T | undefined {
		for (let i = this.array.length - 1; i >= 0; i--) {
			if (predicate(array[i])) {
				return array[i];
			}
		}
		return undefined;
	}
}
