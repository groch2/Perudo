import * as PerudoGame from "./PerudoGame";

const nbPlayers = 6;
const game = new PerudoGame.Game(nbPlayers);

console.log("game start:");
console.log("Nb dices of all players by player id:", game.nbDicesOfAllPlayersByPlayerId);
console.log();

const rl =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

(function loop() {
    const question =
        `round number: ${game.currentRoundNumber}
next player id: ${game.nextPlayerId}
next player dices detail: ${JSON.stringify(game.nextPlayerDices)}
total nb dices of all other players: ${game.nbDicesOfOtherPlayersThanTheNextPlayer}
nb dices of all players by player id: ${JSON.stringify(game.nbDicesOfAllPlayersByPlayerId)} 
turn number: ${game.currentRound.turnNumber}\n`;
    rl.question(
        question,
        (answer: string) => {
            switch (answer.toUpperCase()) {
                case 'Y':
                    loop();
                    return;
                default:
                    console.log('over');
                    rl.close();
                    return;
            }
        });
})();
