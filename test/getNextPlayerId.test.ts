import * as PerudoGame from "../PerudoGame";

const getNextPlayerId = PerudoGame.getNextPlayerId;

test("many players, but they don't have any dice left, except for one. So the next player should always be this one, regardless of the starting player", () => {
    const nbDicesByPlayerId = [0, 0, 0, 1, 0, 0, 0, 0];
    [...nbDicesByPlayerId.entries()]
        .filter(([value,]) => value > 0)
        .map(([, position]) => position)
        .forEach(positionOfPlayerWithoutDice => {
            const actualPlayerId = getNextPlayerId(nbDicesByPlayerId, positionOfPlayerWithoutDice);
            expect(actualPlayerId)
                .toBe(3);
        });
});
