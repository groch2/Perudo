export const nbStartingDicesByPlayer = 5;

export enum DiceFace { Paco, Two, Three, Four, Five, Six }

export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

export enum PlayerEndOfRoundCall { Bluff, ExactMatch }

export enum PlayerPosition { Last, BeforeLast }

export enum RoundDiceOutcome { PlayerLostOneDice, PlayerRecoveredOneDice }

export class Last2PlayersOfRound { lastPlayerId: number; beforeLastPlayerId: number }

export class ErrorMessages {
	public static readonly BID_PACO_AFTER_NON_PACO =
		"the quantity of a bid of pacos following a bid of other dice face than paco must be superior to the half of the previous bid rounded up";
	public static readonly START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS =
		'It is forbidden to start a round by bidding pacos, except if the first player of the round has only one dice left (he is said to be "plafico")';
	public static readonly BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY =
		"in a round where the first player is plafico, a bid must be of greater quantity OR greater value than the previous one, and not both";
	public static readonly BIDDING_PACOS_IN_NOT_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY =
		"a bid of other dice face than paco following a bid of other dice face than paco must be of greater quantity OR greater dice face, and not both";
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

export function getNextPlayerId(nbDiceByPlayerId: number[], firstPossibleNextPlayerId: number): number {
	return (
		(nbDiceByPlayerId
			.concat(nbDiceByPlayerId)
			.slice(firstPossibleNextPlayerId)
			.findIndex(nbDicesOfPlayerId => nbDicesOfPlayerId > 0)
			+ firstPossibleNextPlayerId) % nbDiceByPlayerId.length);
}

export class Round {
	// if the first player of the round has only one dice left, then he or she is plafico and the pacos does not count has jokers during this round
	public readonly isFirstPlayerOfCurrentRoundPlafico: boolean;

	constructor(
		private _turns: Turn[],
		private _endOfRound: EndOfRound,
		private _isOver: boolean,
		public readonly nbPlayers: number,
		public readonly nbDicesByPlayer: number[],
		readonly playersDicesDrawByPlayerId: Map<DiceFace, number>[],
		readonly firstPlayerId: number) {
		this.isFirstPlayerOfCurrentRoundPlafico =
			nbDicesByPlayer[firstPlayerId] === 1;
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
				getNextPlayerId(this.nbDicesByPlayer, currentPlayerId + 1);
		if (isDiceBid(playerChoice)) {
			const throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity = (errorMessage: string) => {
				const diceFaceDiff = playerChoice.diceFace - previousTurn.bid.diceFace;
				const diceQuantityDiff = playerChoice.diceQuantity - previousTurn.bid.diceQuantity;
				if (!(diceFaceDiff == 0 && diceQuantityDiff > 0 || diceFaceDiff > 0 && diceQuantityDiff == 0)) {
					throw new Error(errorMessage);
				}
			};
			if (this.isFirstPlayerOfCurrentRoundPlafico) {
				if (!isRoundBeginning) {
					throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity(
						ErrorMessages.BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
				}
			}
			else {
				if (isRoundBeginning) {
					if (playerChoice.diceFace === DiceFace.Paco) {
						throw new Error(ErrorMessages.START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS);
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
							throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity(
								ErrorMessages.BIDDING_PACOS_IN_NOT_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
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
					this.nbDicesByPlayer[impactedPlayerId]--;
					break;
				case PlayerEndOfRoundCall.ExactMatch:
					const isExactMatch = previousTurn.bid.diceQuantity === nbDicesMatchingLastBid;
					const nbDicesOfLastPlayer = this.nbDicesByPlayer[this.nextPlayerId];
					[impactedPlayerId, roundDiceOutcome] =
						(() => {
							if (isExactMatch) {
								if (nbDicesOfLastPlayer < nbStartingDicesByPlayer) {
									this.nbDicesByPlayer[this.nextPlayerId]++;
									return [currentPlayerId, RoundDiceOutcome.PlayerRecoveredOneDice];
								}
								return [undefined, undefined];
							}
							this.nbDicesByPlayer[this.nextPlayerId]--;
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

	public constructor(nbPlayersOrNbDicesByPlayer: number | number[]) {
		const nbPlayers = nbPlayersOrNbDicesByPlayer as number;
		let nbDicesByPlayer = nbPlayersOrNbDicesByPlayer as number[]
		nbDicesByPlayer = nbDicesByPlayer.length ? nbDicesByPlayer : new Array<number>(nbPlayers).fill(0);

		this._isOver = false;
		this._nbPlayers = nbPlayers || nbDicesByPlayer.length;

		nbDicesByPlayer =
			nbDicesByPlayer || new Array(nbPlayers).fill(nbStartingDicesByPlayer);
		const playersDicesDrawByPlayerId =
			nbDicesByPlayer.map(nbStartingDices => getDrawByThrowingDices(nbStartingDices));

		this._rounds = [];
		const firstRound = new Round([], null, false, this.nbPlayers, nbDicesByPlayer, playersDicesDrawByPlayerId, 0);
		this._rounds.push(firstRound);
	}

	public initializeNewRound(): void {
		const nbDicesOfEachPlayerByPlayerId = this.currentRound.nbDicesByPlayer.splice(0);
		const playersDicesDrawByPlayerId =
			new Array(this._nbPlayers)
				.fill(0)
				.map(playerId => getDrawByThrowingDices(nbDicesOfEachPlayerByPlayerId[playerId]));
		const firstPlayerId =
			getNextPlayerId(nbDicesOfEachPlayerByPlayerId, this.currentRound.endOfRound.impactedPlayerId);
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
		return this.currentRound.nbDicesByPlayer;
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
