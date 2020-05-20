import * as PerudoGame from "../PerudoGame";

test('When the first player calls bluff at the beginning of the round, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    expect(() => game.callBluff())
        .toThrow(PerudoGame.ErrorMessages.CALLING_BLUFF_OR_EXACT_MATCH_AT_THE_BEGINNING_OF_THE_ROUND);
});

test('When the first player calls exact match at the beginning of the round, then there should be an error', () => {
    const nbPlayers = 2;
    const game = new PerudoGame.Game(nbPlayers);

    expect(() => game.callExactMatch())
        .toThrow(PerudoGame.ErrorMessages.CALLING_BLUFF_OR_EXACT_MATCH_AT_THE_BEGINNING_OF_THE_ROUND);
});
