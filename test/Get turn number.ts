import { PerudoGame } from "../PerudoGame";

const nbPlayers = 3;
PerudoGame.throwingDicesEnabled = false;

(function Three_PLayers_Play_Seven_Turns() {
    const game = new PerudoGame.Game(nbPlayers);
    const nbTurnsToPlay = 7;
    let diceQuantityOfBid = 1;

    for (let expectedTurnNumber = 0; expectedTurnNumber < nbTurnsToPlay; expectedTurnNumber++) {
        console.log("Turn number:", game.currentRound.getTurnNumber());
        console.assert(game.currentRound.getTurnNumber() === expectedTurnNumber);

        console.log("player plays...");
        game.playerPlays({ diceFace: PerudoGame.DiceFace.Two, diceQuantity: diceQuantityOfBid });

        diceQuantityOfBid++;
    }

    console.log("Turn number:", game.currentRound.getTurnNumber());
    console.assert(game.currentRound.getTurnNumber() === nbTurnsToPlay);

    console.log("player is about to end the round");
    game.playerPlays(PerudoGame.PlayerEndOfRoundCall.Bluff);

    console.log("Last turn number:", { turnNumber: game.currentRound.getTurnNumber() });
})();
