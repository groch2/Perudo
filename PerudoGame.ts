export namespace PerudoGame {
	const nbStartingDicesByPlayer = 5;

	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

	export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

	export abstract class Turn {
		constructor(
			readonly playerId: number) { }
	}

	export class BeforeLastTurn extends Turn {
		constructor(
			readonly playerId: number,
			readonly turnId: number,
			readonly bid: PlayerDiceBid) {
			super(playerId);
		}
	}

	export class LastTurn extends Turn {
		constructor(
			readonly playerId: number,
			readonly bid: PlayerEndOfRoundCall,
			readonly playerIdWhoLostOneDice: number | undefined) {
			super(playerId);
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
			public readonly nbPlayers: number,
			public readonly nbDicesOfEachPlayerByPlayerId: number[],
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

		public get lastBeforeEndTurn() {
			return (
				this.isOver ?
					this.endTurn :
					this.beforeEndTurns[this.beforeEndTurns.length - 1]);
		}

		public get isOver() {
			return this._isOver;
		}

		public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
			const isRoundBeginning = this._beforeEndTurns.length == 0;
			const previousTurn = isRoundBeginning ? null : this._beforeEndTurns[this._beforeEndTurns.length - 1] as BeforeLastTurn;
			const playerIdOfCurrentTurn = previousTurn ? (previousTurn.playerId + 1) % this.nbPlayers : null;
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
						isRoundBeginning ? 0 : previousTurn.turnId + 1,
						isRoundBeginning ? this.firstPlayerId : playerIdOfCurrentTurn,
						playerChoice));
			}
			else {
				if (isRoundBeginning) {
					throw Error("It is an error to end a round at the beginning of the round, before any bid was made.");
				}
				const countPacosAsJoker = previousTurn.bid.diceFace !== DiceFace.Paco && !this.isFirstPlayerOfCurrentRoundPlafico;
				const nbDicesMatchingLastBid =
					this.playersDicesDrawByPlayerId.reduce((diceTotal, playerDices) => {
						return diceTotal + playerDices.get(<any>DiceFace[previousTurn.bid.diceFace]) + (countPacosAsJoker ? playerDices.get(<any>DiceFace[DiceFace.Paco]) : 0);
					}, 0);
				let playerIdWhoLostOneDice: undefined | number;
				switch (playerChoice) {
					case PlayerEndOfRoundCall.Bluff:
						const looserPlayerId =
							nbDicesMatchingLastBid < previousTurn.bid.diceQuantity ?
								previousTurn.playerId :
								playerIdOfCurrentTurn;
						this.nbDicesOfEachPlayerByPlayerId[looserPlayerId]--;
						playerIdWhoLostOneDice = looserPlayerId;
						break;
					case PlayerEndOfRoundCall.ExactMatch:
						const isExactMatch = previousTurn.bid.diceQuantity === nbDicesMatchingLastBid;
						this.nbDicesOfEachPlayerByPlayerId[playerIdOfCurrentTurn] +=
							isExactMatch ? 1 : -1;
						this.nbDicesOfEachPlayerByPlayerId[playerIdOfCurrentTurn] =
							Math.min(this.nbDicesOfEachPlayerByPlayerId[playerIdOfCurrentTurn], nbStartingDicesByPlayer);
						playerIdWhoLostOneDice = isExactMatch ? undefined : playerIdOfCurrentTurn;
						break;
					default:
						throw new Error("unknown end of round call");
				}
				this._endTurn =
					new LastTurn(
						playerIdOfCurrentTurn,
						playerChoice,
						playerIdWhoLostOneDice);
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
			const getArrayOfLengthEqualToNbPlayers = () => new Array(nbPlayers);
			const nbDicesOfEachPlayerByPlayerId = getArrayOfLengthEqualToNbPlayers().fill(nbStartingDicesByPlayer);
			const playersDicesDrawByPlayerId = getArrayOfLengthEqualToNbPlayers().fill(0).map(_ => getDrawByThrowingDices(nbStartingDicesByPlayer));
			const firstRound = new Round([], null, false, this.nbPlayers, nbDicesOfEachPlayerByPlayerId, playersDicesDrawByPlayerId, 0);
			this._rounds = [];
			this._rounds.push(firstRound);
		}

		public initializeNewRound(): void {
			const previousRound = this._rounds[this._rounds.length - 1];
			const nbDicesOfEachPlayerByPlayerId = previousRound.nbDicesOfEachPlayerByPlayerId.splice(0);
			const nbPlayers = previousRound.nbPlayers +
				(this.currentRound.endTurn.playerIdWhoLostOneDice && nbDicesOfEachPlayerByPlayerId[this.currentRound.endTurn.playerIdWhoLostOneDice] == 0 ? -1 : 0);
			const firstPlayer = this.currentRound.endTurn.playerIdWhoLostOneDice || this.currentRound.endTurn.playerId;
			const playersDicesDrawByPlayerId = Object.assign([], { length: nbPlayers }).fill(0).map(playerId => getDrawByThrowingDices(nbDicesOfEachPlayerByPlayerId[playerId]));
			const newRound = new Round([], null, false, nbPlayers, nbDicesOfEachPlayerByPlayerId, playersDicesDrawByPlayerId, firstPlayer);
			this._rounds.push(newRound);
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

		public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
			this.currentRound.playerPlays(playerChoice);
		}
	}

	export const diceFacesNames = (function () {
		let diceFaces = Object.keys(DiceFace);
		diceFaces = diceFaces.slice(diceFaces.length / 2);
		return diceFaces;
	})();

	export let throwingDicesEnabled = true;

	/// randomly generate a draw for a given number of perudo dices
	export function getDrawByThrowingDices(nbDices: number): Map<DiceFace, number> {
		let nbDiceByFace = diceFacesNames.reduce((state, item) => state.set(item, 0), new Map());
		if (!throwingDicesEnabled) {
			return nbDiceByFace;
		}
		new Array(nbDices).fill(0).map(_ => Math.trunc((Math.random() * diceFacesNames.length)) as DiceFace)
			.forEach(diceFace => nbDiceByFace.set(DiceFace[diceFace], nbDiceByFace.get(DiceFace[diceFace]) + 1));
		return nbDiceByFace;
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
