import UniqueIdentifier from '../Utilities/UniqueIdentifier'

interface IRoundTeamOutcome {
  isMemberOfOpposition(playerId: UniqueIdentifier): boolean
  getPlayerScore(playerId: UniqueIdentifier): number
  oppositionTeamScore: number
  pickingTeamScore: number
}

export default IRoundTeamOutcome
