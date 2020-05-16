import * as PerudoGame from "./PerudoGame";

const nbPlayers = 2;
const game = new PerudoGame.Game(nbPlayers);

console.log("Nb dices by player id", game.nbDicesByPlayerId);
console.log("Nb dices faces of current round by player id", game.getDicesFacesOfCurrentRoundByPlayerId().map(d => [...d.values()]));

const rl =
    require('readline')
        .createInterface({
            input: process.stdin,
            output: process.stdout
        });

(function loop() {
    const nextPlayerDices = game.currentRound.playersDicesDrawByPlayerId[game.currentRound.nextPlayerId]
    const nbDicesByPlayerId = game.nbDicesByPlayerId;
    const nextPlayerId = game.currentRound.nextPlayerId;
    const question =
        `round ${game.previousRounds.length - 1}
nb dices of other players: ${nbDicesByPlayerId.reduce((a, b) => a + b) - nbDicesByPlayerId[nextPlayerId]}
next player id: ${nextPlayerId}
next player dices: ${[...nextPlayerDices.values()]}
turn number: ${game.currentRound.getTurnNumber()}\n`;
    game.currentRound.lastTurn
    rl.question((question, answer: string) => {
        console.log(answer);
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