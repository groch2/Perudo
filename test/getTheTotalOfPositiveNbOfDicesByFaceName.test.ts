import * as PerudoGame from "../PerudoGame";

beforeAll(PerudoGame.disableThrowingDices);

test('When no dice is on a particular face, then that dice face should not appear in the total of positive nb of dices by face name', () => {
    const nbDicesByPlayer = [1, 0];
    for(let diceFaceIndexA = 0; diceFaceIndexA < PerudoGame.diceFacesNames.length; diceFaceIndexA ++){
        const game = new PerudoGame.Game(nbDicesByPlayer.slice(0));
        game.currentRound.playersDicesDrawByPlayerId[0].set(diceFaceIndexA, 1);

        for (let diceFaceIndexB = 0; diceFaceIndexB < PerudoGame.diceFacesNames.length; diceFaceIndexB++) {
            if (diceFaceIndexB === diceFaceIndexA) continue;
            const isDiceFaceB_Present = game.currentRound.totalOfPositiveNbOfDicesByFaceName.some(([diceFace,]) => diceFace === PerudoGame.DiceFace[diceFaceIndexB]);
            expect(isDiceFaceB_Present).toBe(false);
        }
    }
});
