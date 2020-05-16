export const nbStartingDicesByPlayer = 5;

export enum DiceFace { Paco, Two, Three, Four, Five, Six }

export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

export enum PlayerPosition { Last, BeforeLast }

export enum RoundDiceOutcome { PlayerLostOneDice, PlayerRecoveredOneDice }

export class Last2PlayersOfRound { lastPlayerId: number; beforeLastPlayerId: number }

export class ErrorMessages {
	public static BID_PACO_AFTER_NON_PACO = "the quantity of a bid of pacos following a bid of other dice face than paco must be superior to the half of the previous bid rounded up";
}

export class Turn {
	constructor(
		readonly playerId: number,
		readonly turnId: number,
		readonly bid: PlayerDiceBid) { }
}

export class EndOfRound {
	constructor(
		readonly lastPlayerId: number,
		readonly beforeLastPlayerId: number,
		readonly playerEndOfRoundCall: PlayerEndOfRoundCall,
		readonly impactedPlayerId: number | undefined,
		readonly roundDiceOutcome: RoundDiceOutcome | undefined) { }
	get positionOfPlayerImpactedByDiceOutcome() {
		switch (this.impactedPlayerId) {
			case this.lastPlayerId:
				return PlayerPosition.Last;
			case this.beforeLastPlayerId:
				return PlayerPosition.BeforeLast;
			default:
				return undefined;
		}
	}
}

function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): playerChoice is PlayerDiceBid {
	return (playerChoice as PlayerDiceBid).diceFace !== undefined;
}

export class Round {
	// if the first player of the round has only one dice left, then he or she is plafico and the pacos does not count has jokers during this round
	readonly isFirstPlayerOfCurrentRoundPlafico: boolean;

	constructor(
		private _turns: Turn[],
		private _endOfRound: EndOfRound,
		private _isOver: boolean,
		public readonly nbPlayers: number,
		public readonly nbDicesOfEachPlayerByPlayerId: number[],
		readonly playersDicesDrawByPlayerId: Map<DiceFace, number>[],
		readonly firstPlayerId: number) {
		this.isFirstPlayerOfCurrentRoundPlafico =
			[...playersDicesDrawByPlayerId[firstPlayerId].values()]
				.reduce((firstPlayerDicesTotal, playerNbDicesOfFace) => firstPlayerDicesTotal + playerNbDicesOfFace) === 1;
		this._nextPlayerId = 0;
	}

	private _nextPlayerId: number;
	public get nextPlayerId() {
		return this._nextPlayerId;
	}

	public get turns() {
		return this._turns;
	}

	public get endOfRound() {
		return this._endOfRound;
	}

	public get lastTurn() {
		return this._turns[this._turns.length - 1];
	}

	public get isOver() {
		return this._isOver;
	}

	public playerPlays(playerChoice: PlayerDiceBid | PlayerEndOfRoundCall): void {
		const isRoundBeginning = this._turns.length == 0;
		const previousTurn = isRoundBeginning ? null : this.lastTurn as Turn;
		const currentPlayerId = this._nextPlayerId;
		this._nextPlayerId =
			!previousTurn ? 1 :
				(this.nbDicesOfEachPlayerByPlayerId
					.concat(this.nbDicesOfEachPlayerByPlayerId)
					.slice(currentPlayerId + 1)
					.findIndex(nbDicesOfPlayerId => nbDicesOfPlayerId > 0)
					+ currentPlayerId + 1) % this.nbPlayers;
		if (isDiceBid(playerChoice)) {
			if (this.isFirstPlayerOfCurrentRoundPlafico) {
				if (playerChoice.diceFace > previousTurn.bid.diceFace && playerChoice.diceQuantity > previousTurn.bid.diceQuantity) {
					throw new Error("in a round where the first player is plafico, a bid must be of greater quantity OR greater value than the previous one, and not both");
				}
			}
			else {
				if (isRoundBeginning) {
					if (playerChoice.diceFace === DiceFace.Paco) {
						throw new Error("It is forbidden to start a round by bidding pacos if the first player of the round has more than one dice");
					}
				}
				else {
					if (previousTurn.bid.diceFace !== DiceFace.Paco) {
						if (playerChoice.diceFace === DiceFace.Paco) {
							if (playerChoice.diceQuantity < Math.ceil(previousTurn.bid.diceQuantity / 2)) {
								throw new Error(ErrorMessages.BID_PACO_AFTER_NON_PACO);
							}
						}
						else {
							const diceFaceDiff = playerChoice.diceFace - previousTurn.bid.diceFace;
							const diceQuantityDiff = playerChoice.diceQuantity - previousTurn.bid.diceQuantity;
							if (!(diceFaceDiff == 0 && diceQuantityDiff > 0 || diceFaceDiff > 0 && diceQuantityDiff == 0)) {
								throw new Error("a bid of other dice face than paco following a bid of other dice face than paco must be of greater quantity OR greater dice face, and not both");
							}
						}
					}
					else {
						if (playerChoice.diceFace === DiceFace.Paco) {
							if (playerChoice.diceQuantity <= previousTurn.bid.diceQuantity) {
								throw new Error("a bid of pacos following a bid of pacos must increase the quantity");
							}
						}
						else {
							const previousNonPacoBidQuantity = findLast(this._turns, turn => turn.bid.diceFace !== DiceFace.Paco).bid.diceQuantity;
							if (playerChoice.diceQuantity <= previousNonPacoBidQuantity * 2) {
								throw new Error("a bid other dice face than paco following a bid of pacos must be greater than twice the most recent bid of other dice face than paco");
							}
						}
					}
				}
			}
			this._turns.push(
				new Turn(
					currentPlayerId,
					isRoundBeginning ? 0 : previousTurn.turnId + 1,
					playerChoice));
		}
		else {
			if (isRoundBeginning) {
				throw Error("It is an error to call a bluff or an exact match at the beginning of the round, before any bid was made.");
			}
			const countPacosAsJoker = previousTurn.bid.diceFace !== DiceFace.Paco && !this.isFirstPlayerOfCurrentRoundPlafico;
			const nbDicesMatchingLastBid =
				this.playersDicesDrawByPlayerId.reduce((diceTotal, playerDices) => {
					return diceTotal + playerDices.get(previousTurn.bid.diceFace) + (countPacosAsJoker ? playerDices.get(DiceFace.Paco) : 0);
				}, 0);
			let impactedPlayerId: undefined | number;
			let roundDiceOutcome: RoundDiceOutcome | undefined;
			switch (playerChoice) {
				case PlayerEndOfRoundCall.Bluff:
					roundDiceOutcome = RoundDiceOutcome.PlayerLostOneDice;
					impactedPlayerId =
						nbDicesMatchingLastBid < previousTurn.bid.diceQuantity ?
							previousTurn.playerId :
							currentPlayerId;
					this.nbDicesOfEachPlayerByPlayerId[impactedPlayerId]--;
					break;
				case PlayerEndOfRoundCall.ExactMatch:
					const isExactMatch = previousTurn.bid.diceQuantity === nbDicesMatchingLastBid;
					const nbDicesOfLastPlayer = this.nbDicesOfEachPlayerByPlayerId[this.nextPlayerId];
					[impactedPlayerId, roundDiceOutcome] =
						(() => {
							if (isExactMatch) {
								if (nbDicesOfLastPlayer < nbStartingDicesByPlayer) {
									this.nbDicesOfEachPlayerByPlayerId[this.nextPlayerId]++;
									return [currentPlayerId, RoundDiceOutcome.PlayerRecoveredOneDice];
								}
								return [undefined, undefined];
							}
							this.nbDicesOfEachPlayerByPlayerId[this.nextPlayerId]--;
							return [currentPlayerId, RoundDiceOutcome.PlayerLostOneDice];
						})();
					break;
				default:
					throw new Error("unknown end of round call");
			}
			this._endOfRound =
				new EndOfRound(
					currentPlayerId,
					previousTurn.playerId,
					playerChoice,
					impactedPlayerId,
					roundDiceOutcome);
			this._isOver = true;
		}
	};

	public getTotalNbDiceByFaceIndex() {
		const nbDiceByFace = new Array<number>(diceFacesNames.length).fill(0);
		this.playersDicesDrawByPlayerId.forEach(playerDices => {
			for (let [diceFace, quantity] of playerDices) {
				nbDiceByFace[DiceFace[diceFace]] += quantity;
			}
		});
		return nbDiceByFace;
	}

	public getTotalNbDiceByFaceName() {
		return [...this.getTotalNbDiceByFaceIndex().entries()]
			.map(([diceNameIndex, diceQuantity]) => [diceFacesNames[diceNameIndex], diceQuantity]);
	}

	public getTotalPositiveNbDiceByFaceName() {
		return this.getTotalNbDiceByFaceName().filter(([, quantity]) => quantity > 0);
	}

	public getTurnNumber() {
		return this._turns.length;
	}
}

export class Game {
	private _isOver: boolean;
	private _nbPlayers: number;
	private _rounds: Round[];

	public constructor(nbPlayers: number, nbDicesByPlayerId?: number[]) {
		this._isOver = false;
		this._nbPlayers = nbPlayers;

		const nbDicesOfEachPlayerByPlayerId =
			nbDicesByPlayerId || new Array(nbPlayers).fill(nbStartingDicesByPlayer);
		const playersDicesDrawByPlayerId =
			nbDicesOfEachPlayerByPlayerId.map(nbStartingDices => getDrawByThrowingDices(nbStartingDices));

		this._rounds = [];
		const firstRound = new Round([], null, false, this.nbPlayers, nbDicesOfEachPlayerByPlayerId, playersDicesDrawByPlayerId, 0);
		this._rounds.push(firstRound);
	}

	public initializeNewRound(): void {
		const nbDicesOfEachPlayerByPlayerId = this.currentRound.nbDicesOfEachPlayerByPlayerId.splice(0);
		const playersDicesDrawByPlayerId = new Array(this._nbPlayers).fill(0).map(playerId => getDrawByThrowingDices(nbDicesOfEachPlayerByPlayerId[playerId]));
		const firstPlayerId =
			nbDicesOfEachPlayerByPlayerId
				.concat(nbDicesOfEachPlayerByPlayerId)
				.findIndex((nbDicesOfPlayerId, playerId) =>
					playerId >= this.currentRound.endOfRound.impactedPlayerId && nbDicesOfPlayerId > 0) % this.nbPlayers;
		const newRound = new Round([], null, false, this._nbPlayers, nbDicesOfEachPlayerByPlayerId, playersDicesDrawByPlayerId, firstPlayerId);
		this._rounds.push(newRound);
	}

	public get currentRound() {
		return this._rounds[this._rounds.length - 1];
	}

	public get nextPlayerId() {
		return this.currentRound.nextPlayerId;
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

	public get nbDicesByPlayerId() {
		return this.currentRound.nbDicesOfEachPlayerByPlayerId;
	}

	public getDicesFacesOfCurrentRoundByPlayerId() {
		return this.currentRound.playersDicesDrawByPlayerId;
	}
}

export const diceFacesNames = (function () {
	let diceFaces = Object.keys(DiceFace);
	return diceFaces.slice(diceFaces.length / 2);
})();

let _isThrowingDicesEnabled = true;
export function disableThrowingDices() {
	_isThrowingDicesEnabled = false;
}
export function enableThrowingDices() {
	_isThrowingDicesEnabled = true;
}

/// randomly generate a draw of dices for a given number of dices
export function getDrawByThrowingDices(nbDices: number): Map<DiceFace, number> {
	let nbDiceByFace =
		diceFacesNames.reduce(
			(nbDiceByFace, diceFace) => nbDiceByFace.set(diceFacesNames.indexOf(diceFace), 0),
			new Map<DiceFace, number>());
	if (!_isThrowingDicesEnabled) {
		return nbDiceByFace;
	}
	new Array(nbDices)
		.fill(0)
		.map(_ => Math.trunc((Math.random() * diceFacesNames.length)) as DiceFace)
		.forEach(diceFace => nbDiceByFace.set(diceFace, nbDiceByFace.get(diceFace) + 1));
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
