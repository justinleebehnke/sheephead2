import UniqueIdentifier from '../Utilities/UniqueIdentifier'

interface IRoundTeamOutcome {
  isMemberOfOpposition(playerId: UniqueIdentifier): boolean
  getPlayerScore(playerId: UniqueIdentifier): number
  oppositionTeamScore: number
  oppositionTricksWon: number
  pickerId: UniqueIdentifier
  pickerTricksWon: number
  pickingTeamScore: number
  pickingTeamTricksWon: number
}

export default IRoundTeamOutcome
