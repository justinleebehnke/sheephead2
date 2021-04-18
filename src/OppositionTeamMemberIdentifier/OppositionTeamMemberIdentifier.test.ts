import EndOfRoundData from '../Entities/Round/EndOfRoundReportData'
import EndOfRoundViewData from '../Views/GamePlayViews/EndOfRoundReport/EndOfRoundViewData'
import OppositionTeamMemberIdentifier from './OppositionTeamMemberIdentifier'
import UniqueIdentifier from '../Utilities/UniqueIdentifier'

describe('Given an index it will decide whether the player is a member of the opposition (the non picking team)', () => {
  let endOfRoundData: EndOfRoundViewData

  beforeEach(() => {
    const endOfRoundReport: EndOfRoundData = {
      bury: {
        cards: [
          { cardId: '9s', pointValue: 0 },
          { cardId: 'ks', pointValue: 4 },
        ],
      },
      tricks: [
        {
          cards: [
            {
              cardId: '8d',
              pointValue: 0,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: 'jd',
              pointValue: 2,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
            {
              cardId: 'js',
              pointValue: 2,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
            {
              cardId: 'ad',
              pointValue: 11,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
          ],
          winningCardIndex: 2,
        },
        {
          cards: [
            {
              cardId: 'jc',
              pointValue: 2,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
            {
              cardId: 'qc',
              pointValue: 3,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
            {
              cardId: 'qs',
              pointValue: 3,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: '7d',
              pointValue: 0,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
          ],
          winningCardIndex: 1,
        },
        {
          cards: [
            {
              cardId: 'jh',
              pointValue: 2,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
            {
              cardId: 'qh',
              pointValue: 3,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: 'td',
              pointValue: 10,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
            {
              cardId: 'tc',
              pointValue: 10,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
          ],
          winningCardIndex: 1,
        },
        {
          cards: [
            {
              cardId: 'qd',
              pointValue: 3,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: 'ah',
              pointValue: 11,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
            {
              cardId: 'as',
              pointValue: 11,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
            {
              cardId: 'ac',
              pointValue: 11,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
          ],
          winningCardIndex: 0,
        },
        {
          cards: [
            {
              cardId: 'kd',
              pointValue: 4,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: 'th',
              pointValue: 10,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
            {
              cardId: 'kc',
              pointValue: 4,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
            {
              cardId: '9c',
              pointValue: 0,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
          ],
          winningCardIndex: 0,
        },
        {
          cards: [
            {
              cardId: '9d',
              pointValue: 0,
              playedByPlayerId: '45c78893-ac7b-4999-bd08-dbb557e851c7',
            },
            {
              cardId: 'kh',
              pointValue: 4,
              playedByPlayerId: '2711623a-5588-4c58-b316-94c00c5da1ef',
            },
            {
              cardId: 'ts',
              pointValue: 10,
              playedByPlayerId: 'e4858617-0a61-4568-b19e-374a1668a5f2',
            },
            {
              cardId: '9h',
              pointValue: 0,
              playedByPlayerId: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
            },
          ],
          winningCardIndex: 0,
        },
      ],
    }
    endOfRoundData = {
      pickerIndex: 0,
      pickerWentAlone: false,
      players: [
        {
          id: '45c78893-ac7b-4999-bd08-dbb557e851c7',
          name: 'Player 1',
          currentHandCentsWon: 0,
          totalCentsWon: 0,
        }, // <-- Picker
        {
          id: '2711623a-5588-4c58-b316-94c00c5da1ef',
          name: 'Player 2',
          currentHandCentsWon: 0,
          totalCentsWon: 0,
        }, // <-- Partner
        {
          id: 'e4858617-0a61-4568-b19e-374a1668a5f2',
          name: 'Player 3',
          currentHandCentsWon: 0,
          totalCentsWon: 0,
        },
        {
          id: 'fe044200-99b9-4c21-bd5d-94a9dd5c1d1f',
          name: 'Player 4',
          currentHandCentsWon: 0,
          totalCentsWon: 0,
        },
      ],
      endOfRoundReport,
    }
  })

  it('Should return false for the picker', () => {
    expect(
      new OppositionTeamMemberIdentifier(endOfRoundData).isMemberOfOpposition(
        new UniqueIdentifier(endOfRoundData.players[0].id)
      )
    ).toBe(false)
  })

  it('Should return false for the player who played the jack of diamonds since the picker did not go alone', () => {
    expect(
      new OppositionTeamMemberIdentifier(endOfRoundData).isMemberOfOpposition(
        new UniqueIdentifier(endOfRoundData.players[1].id)
      )
    ).toBe(false)
  })

  it('Should return true for the player who played the jack of diamonds if the picker went alone', () => {
    endOfRoundData.pickerWentAlone = true
    expect(
      new OppositionTeamMemberIdentifier(endOfRoundData).isMemberOfOpposition(
        new UniqueIdentifier(endOfRoundData.players[1].id)
      )
    ).toBe(true)
  })

  it('Should return true for the player that did not play the jack of diamonds and was not the picker', () => {
    expect(
      new OppositionTeamMemberIdentifier(endOfRoundData).isMemberOfOpposition(
        new UniqueIdentifier(endOfRoundData.players[2].id)
      )
    ).toBe(true)

    expect(
      new OppositionTeamMemberIdentifier(endOfRoundData).isMemberOfOpposition(
        new UniqueIdentifier(endOfRoundData.players[3].id)
      )
    ).toBe(true)
  })
})

export {}
