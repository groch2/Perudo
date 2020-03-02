export namespace PerudoGame {
	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: Number }
	
	export enum PlayerEndOfTurnCall { Bluff, ExactMatch }

	export class Game {
		constructor(
			readonly playersDices: Number[],
			playerTurn: Number,
			lastBid: PlayerDiceBid | undefined) { }
	}
	
	function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfTurnCall): playerChoice is PlayerDiceBid {
		return (playerChoice as PlayerDiceBid).diceFace !== undefined;
	}

	export function playerPlays(playerPosition: Number, playerChoice: PlayerDiceBid | PlayerEndOfTurnCall): Game {
		if (isDiceBid(playerChoice)) {
			console.log(playerChoice);
		}
		else {
			console.log(PlayerEndOfTurnCall[<PlayerEndOfTurnCall>playerChoice]);
		}
		return;
	}
}
