export const nbStartingDicesByPlayer = 5;

export enum DiceFace { Paco, Two, Three, Four, Five, Six }

enum RoundDiceOutcome { PlayerLostOneDice, PlayerRecoveredOneDice }

export class ErrorMessages {
	public static readonly BID_PACO_AFTER_NON_PACO =
		"the quantity of a bid of pacos following a bid of other dice face than paco must be superior to the half of the previous bid rounded up";
	public static readonly START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS =
		'It is forbidden to start a round by bidding pacos, except if the first player of the round has only one dice left (he is said to be "plafico")';
	public static readonly BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY =
		"in a round where the first player is plafico, a bid must be of greater quantity OR greater value than the previous one, and not both";
	public static readonly BIDDING_PACOS_IN_NOT_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY =
		"a bid of other dice face than paco following a bid of other dice face than paco must be of greater quantity OR greater dice face, and not both";
	public static readonly BIDDING_PACOS_AFTER_A_BID_OF_PACOS =
		"a bid of pacos following a bid of pacos must increase the quantity";
	public static readonly BIDDING_NON_PACOS_AFTER_A_BID_OF_PACOS =
		"a bid of other dice face than paco following a bid of pacos must be greater than twice the number of dices of the previous bid";
	public static readonly CALLING_BLUFF_OR_EXACT_MATCH_AT_THE_BEGINNING_OF_THE_ROUND =
		"It is an error to call a bluff or an exact match at the beginning of the round, before any bid was made.";
	public static readonly GAME_OVER = "The game is over";
}

class Turn {
	constructor(
		readonly turnId: number,
		readonly playerId: number,
		readonly playerBidDiceFace: DiceFace,
		readonly playerBidDiceQuantity: number) { }
}

class EndOfRound {
	constructor(
		readonly lastPlayerId: number,
		readonly beforeLastPlayerId: number,
		readonly isEndOfRoundBluff: boolean,
		readonly impactedPlayerId: number | undefined,
		readonly roundDiceOutcome: RoundDiceOutcome | undefined) { }
}

// returns the id of the the player that is supposed to play after the player whose id is fromPlayerId
export function getNextPlayerId(nbDicesByPlayerId: number[], fromPlayerId: number): number {
	return (
		(nbDicesByPlayerId
			.concat(nbDicesByPlayerId)
			.slice(fromPlayerId)
			.findIndex(nbDicesOfPlayerId => nbDicesOfPlayerId > 0)
			+ fromPlayerId) % nbDicesByPlayerId.length);
}

class Round {
	// if the first player of the round has only one dice left, then he or she is plafico and the pacos does not count has jokers during this round
	// and he or she can start the round by bidding pacos
	public readonly isFirstPlayerPalafico: boolean;

	constructor(
		public readonly nbPlayers: number,
		public readonly nbDicesByPlayer: number[],
		readonly playersDicesDrawByPlayerId: Map<DiceFace, number>[],
		readonly firstPlayerId: number,
		private _turns: Turn[] = new Array<Turn>(),
		private _endOfRound: EndOfRound = null) {
		this.isFirstPlayerPalafico =
			nbDicesByPlayer[firstPlayerId] === 1;
		this._nextPlayerId = firstPlayerId;
	}

	private _nextPlayerId: number;
	public get nextPlayerId() {
		return this._nextPlayerId;
	}

	public get endOfRound() {
		return this._endOfRound;
	}

	public get isRoundBeginning() {
		return this._turns.length == 0;
	}

	private get lastTurn() {
		return this.isRoundBeginning ? null : this._turns[this._turns.length - 1];
	}

	// the next player makes a call based on an estimate of how many dice of a particular number there are under all the cups on the table.
	public bid(nbDices: number, diceFace: DiceFace) {
		const currentPlayerId = this._nextPlayerId;
		this._nextPlayerId =
			!this.lastTurn ? 1 :
				getNextPlayerId(this.nbDicesByPlayer, currentPlayerId + 1);
		const throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity = (errorMessage: string) => {
			const diceFaceDiff = diceFace - this.lastTurn.playerBidDiceFace;
			const diceQuantityDiff = nbDices - this.lastTurn.playerBidDiceQuantity;
			if (!(diceFaceDiff == 0 && diceQuantityDiff > 0 || diceFaceDiff > 0 && diceQuantityDiff == 0)) {
				throw new Error(errorMessage);
			}
		};
		if (this.isFirstPlayerPalafico) {
			if (!this.isRoundBeginning) {
				throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity(
					ErrorMessages.BIDDING_PACOS_IN_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
			}
		}
		else {
			if (this.isRoundBeginning) {
				if (diceFace === DiceFace.Paco) {
					throw new Error(ErrorMessages.START_NON_PLAFICO_ROUND_BY_BIDDING_PACOS);
				}
			}
			else {
				if (this.lastTurn.playerBidDiceFace !== DiceFace.Paco) {
					if (diceFace === DiceFace.Paco) {
						if (nbDices < Math.ceil(this.lastTurn.playerBidDiceQuantity / 2)) {
							throw new Error(ErrorMessages.BID_PACO_AFTER_NON_PACO);
						}
					}
					else {
						throwErrorWithMessageIfBiddingIsNotIncreasedByDiceFaceValueXOrByDiceQuantity(
							ErrorMessages.BIDDING_PACOS_IN_NOT_PLAFICO_ROUND_MUST_INCREASE_THE_PREVIOUS_BID_QUANTITY);
					}
				}
				else {
					if (diceFace === DiceFace.Paco) {
						if (nbDices <= this.lastTurn.playerBidDiceQuantity) {
							throw new Error(ErrorMessages.BIDDING_PACOS_AFTER_A_BID_OF_PACOS);
						}
					}
					else {
						if (nbDices <= this.lastTurn.playerBidDiceQuantity * 2) {
							throw new Error(ErrorMessages.BIDDING_NON_PACOS_AFTER_A_BID_OF_PACOS);
						}
					}
				}
			}
		}
		this._turns.push(
			new Turn(
				this.isRoundBeginning ? 0 : this.lastTurn.turnId + 1,
				currentPlayerId,
				diceFace,
				nbDices));
	}

	// the next players states that the previous bid is above the actual count of the dices that are on the table
	public callBluff() {
		if (this.isRoundBeginning) {
			throw Error(ErrorMessages.CALLING_BLUFF_OR_EXACT_MATCH_AT_THE_BEGINNING_OF_THE_ROUND);
		}
		const countPacosAsJoker = this.lastTurn.playerBidDiceFace !== DiceFace.Paco && !this.isFirstPlayerPalafico;
		const nbDicesMatchingLastBid =
			this.playersDicesDrawByPlayerId.reduce((diceTotal, playerDices) => {
				return diceTotal + playerDices.get(this.lastTurn.playerBidDiceFace) + (countPacosAsJoker ? playerDices.get(DiceFace.Paco) : 0);
			}, 0);
		const impactedPlayerId =
			nbDicesMatchingLastBid < this.lastTurn.playerBidDiceQuantity ?
				this.lastTurn.playerId :
				this.nextPlayerId;
		this.nbDicesByPlayer[impactedPlayerId]--;
		this._endOfRound =
			new EndOfRound(
				this.nextPlayerId,
				this.lastTurn.playerId,
				true,
				impactedPlayerId,
				RoundDiceOutcome.PlayerLostOneDice);
	}

	// the next players states that the previous bid exactly matches the actual count of the dices that are on the table
	public callExactMatch() {
		if (this.isRoundBeginning) {
			throw Error(ErrorMessages.CALLING_BLUFF_OR_EXACT_MATCH_AT_THE_BEGINNING_OF_THE_ROUND);
		}
		const countPacosAsJoker = this.lastTurn.playerBidDiceFace !== DiceFace.Paco && !this.isFirstPlayerPalafico;
		const nbDicesMatchingLastBid =
			this.playersDicesDrawByPlayerId.reduce((diceTotal, playerDices) => {
				return diceTotal + playerDices.get(this.lastTurn.playerBidDiceFace) + (countPacosAsJoker ? playerDices.get(DiceFace.Paco) : 0);
			}, 0);
		let impactedPlayerId: undefined | number;
		let roundDiceOutcome: RoundDiceOutcome | undefined;
		const isExactMatch = this.lastTurn.playerBidDiceQuantity === nbDicesMatchingLastBid;
		const nbDicesOfLastPlayer = this.nbDicesByPlayer[this.nextPlayerId];
		[impactedPlayerId, roundDiceOutcome] =
			(() => {
				if (!isExactMatch) {
					this.nbDicesByPlayer[this.nextPlayerId]--;
					return [this.nextPlayerId, RoundDiceOutcome.PlayerLostOneDice];
				}
				if (nbDicesOfLastPlayer < nbStartingDicesByPlayer) {
					this.nbDicesByPlayer[this.nextPlayerId]++;
					return [this.nextPlayerId, RoundDiceOutcome.PlayerRecoveredOneDice];
				}
				return [undefined, undefined];
			})();
		this._endOfRound =
			new EndOfRound(
				this.nextPlayerId,
				this.lastTurn.playerId,
				false,
				impactedPlayerId,
				roundDiceOutcome);
	}

	private get totalNbDicesByFaceIndex() {
		const nbDiceByFace = new Array<number>(diceFacesNames.length).fill(0);
		this.playersDicesDrawByPlayerId.forEach(playerDices => {
			for (let [diceFace, quantity] of playerDices) {
				nbDiceByFace[diceFace] += quantity;
			}
		});
		return nbDiceByFace;
	}

	// for each dice face for which there is at least on dice on that face, return the number of dices that are on that face in the current round
	public get totalOfPositiveNbOfDicesByFaceName() {
		return [...this.totalNbDicesByFaceIndex.entries()]
			.map(([diceFaceIndex, diceQuantity]) => [diceFacesNames[diceFaceIndex], diceQuantity])
			.filter(([, quantity]) => quantity > 0);
	}

	public get turnNumber() {
		return this._turns.length;
	}
}

export class Game {
	private _nbPlayers: number;
	private _rounds: Round[];
	private _nbPlayersNotEliminated: number;

	public constructor(nbPlayersOrNbDicesByPlayer: number | number[]) {
		let nbDicesByPlayer = nbPlayersOrNbDicesByPlayer as number[]
		nbDicesByPlayer =
			nbDicesByPlayer.length ?
				nbDicesByPlayer :
				new Array(nbPlayersOrNbDicesByPlayer as number).fill(nbStartingDicesByPlayer);

		this._nbPlayers = nbDicesByPlayer.length;
		this._nbPlayersNotEliminated = nbDicesByPlayer.filter(nbDices => nbDices > 0).length;

		const playersDicesDrawByPlayerId =
			nbDicesByPlayer.map(nbStartingDices => getDrawByThrowingDices(nbStartingDices));

		this._rounds = [];
		const firstRound = new Round(this._nbPlayers, nbDicesByPlayer, playersDicesDrawByPlayerId, 0);
		this._rounds.push(firstRound);
	}

	private initializeNewRound(): void {
		const nbDicesOfEachPlayerByPlayerId = this.currentRound.nbDicesByPlayer.splice(0);
		const playersDicesDrawByPlayerId =
			new Array(this._nbPlayers)
				.fill(0)
				.map(playerId => getDrawByThrowingDices(nbDicesOfEachPlayerByPlayerId[playerId]));
		const firstPlayerId =
			getNextPlayerId(nbDicesOfEachPlayerByPlayerId, this.currentRound.endOfRound.impactedPlayerId);
		const newRound = new Round(this._nbPlayers, nbDicesOfEachPlayerByPlayerId, playersDicesDrawByPlayerId, firstPlayerId);
		this._rounds.push(newRound);
	}

	// TODO: make this getter private. It exposes a way to mutate the state of the game, and it should not.
	public get currentRound() {
		return this._rounds[this._rounds.length - 1];
	}

	public get nextPlayerId() {
		return this.currentRound.nextPlayerId;
	}

	public get currentRoundNumber() {
		return this._rounds.length - 1;
	}

	public get nbPlayers() {
		return this._nbPlayers;
	}

	public get isOver() {
		return this._nbPlayersNotEliminated == 1;
	}

	public bid(nbDices: number, diceFace: DiceFace) {
		if (this.isOver) {
			throw new Error(ErrorMessages.GAME_OVER);
		}
		this.currentRound.bid(nbDices, diceFace);
	}

	public callBluff() {
		this.callEndOfRoundMethod(this.currentRound.callBluff);
	}

	public callExactMatch() {
		this.callEndOfRoundMethod(this.currentRound.callExactMatch);
	}

	private callEndOfRoundMethod(endOfRoundMethod: () => void) {
		if (this.isOver) {
			throw new Error(ErrorMessages.GAME_OVER);
		}
		endOfRoundMethod.call(this.currentRound);
		if (this.nbDicesByPlayerId[this.currentRound.endOfRound.impactedPlayerId] == 0) {
			this._nbPlayersNotEliminated--;
		}
		if (!this.isOver) {
			this.initializeNewRound();
		}
	}

	public get nbDicesByPlayerId() {
		return this.currentRound.nbDicesByPlayer.slice(0);
	}

	public get nbDicesOfNextPlayer() {
		return this.nbDicesByPlayerId[this.nextPlayerId];
	}

	public get nbDicesOfOtherPlayersThanTheNextPlayer() {
		return this.nbDicesByPlayerId.reduce((a, b) => a + b) - this.nbDicesByPlayerId[this.nextPlayerId];
	}

	public get currentRoundPlayersDicesDrawByPlayerId() {
		return (
			this
				.currentRound
				.playersDicesDrawByPlayerId
				.map(diceDraw => 
					[...diceDraw.entries()]
						.filter(([, quantity]) => quantity > 0)
						.map(([diceFace, diceQuantity]) => [diceFacesNames[diceFace], diceQuantity])));
	}

	public get nextPlayerDices() {
		return this.currentRoundPlayersDicesDrawByPlayerId[this.nextPlayerId];
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
		.map(() => Math.trunc((Math.random() * diceFacesNames.length)) as DiceFace)
		.forEach(diceFace => nbDiceByFace.set(diceFace, nbDiceByFace.get(diceFace) + 1));
	return nbDiceByFace;
}
