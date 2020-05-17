import * as PerudoGame from "../PerudoGame";

const getNextPlayerId = PerudoGame.getNextPlayerId;

test("10 players, but none have any dice left except for one. So the next player should always be this one, regardless of the starting player", () => {
    const nbPlayers = 10;
    for (let onlyPlayerIdWithOneDiceLeft = 0; onlyPlayerIdWithOneDiceLeft < nbPlayers; onlyPlayerIdWithOneDiceLeft++) {
        const nbDicesByPlayerId = new Array(nbPlayers).fill(0);
        nbDicesByPlayerId[onlyPlayerIdWithOneDiceLeft] = 1;
        [...nbDicesByPlayerId.entries()]
            .filter(([nbDices,]) => nbDices > 0)
            .map(([, playerId]) => playerId)
            .forEach(playerIdOfPlayerWithoutDice => {
                const actualPlayerId = getNextPlayerId(nbDicesByPlayerId, playerIdOfPlayerWithoutDice);
                expect(actualPlayerId)
                    .toBe(onlyPlayerIdWithOneDiceLeft);
            });
    }
});
