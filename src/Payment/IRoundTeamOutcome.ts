import UniqueIdentifier from '../Utilities/UniqueIdentifier'

interface IRoundTeamOutcome {
  isMemberOfOpposition(playerId: UniqueIdentifier): boolean
  oppositionTeamScore: number
  pickingTeamScore: number
}

export default IRoundTeamOutcome
