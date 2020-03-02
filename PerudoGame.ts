export namespace PerudoGame {
	export enum DiceFace { Paco, Two, Three, Four, Five, Six }

	export type PlayerDiceBid = { diceFace: DiceFace, diceQuantity: number }

	export enum PlayerEndOfTurnCall { Bluff, ExactMatch }

	export class Game {
		constructor(
			readonly turn: number,
			readonly playersDices: number[],
			readonly playerTurn: number,
			readonly lastBid: PlayerDiceBid | undefined) { }
	}

	function isDiceBid(playerChoice: PlayerDiceBid | PlayerEndOfTurnCall): playerChoice is PlayerDiceBid {
		return (playerChoice as PlayerDiceBid).diceFace !== undefined;
	}

	export function playerPlays(game: Game, playerPosition: number, playerChoice: PlayerDiceBid | PlayerEndOfTurnCall): Game {
		if (isDiceBid(playerChoice)) {
			console.log(playerChoice);
			return (
				new Game(
					game.turn + 1,
					game.playersDices,
					game.playerTurn + 1,
					<PlayerDiceBid>playerChoice));
		}
		console.log(PlayerEndOfTurnCall[<PlayerEndOfTurnCall>playerChoice]);
		return game;
	}
}
